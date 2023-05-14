import * as React from 'react';
import * as Constants from '../../utils/constants';
import * as Utils from '../../utils/utils';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

type SelectOption = {
  value: string;
  label: string;
};

export class ModalImportRoomForm extends React.Component<ModalImportRoomFormProps> {
  state: Readonly<{
    room: FieldValidation;
    world: FieldValidation;
    shard: FieldValidation;
    showStructures: boolean;
    submitCalled: boolean;
    validForm: boolean;
    formError: string;
    modal: boolean;
  }>;

  constructor(props: any) {
    super(props);
    this.state = {
      room: {
        value: props.room,
        validateOnChange: false,
        valid: true,
      },
      world: {
        value: props.world,
        validateOnChange: false,
        valid: true,
      },
      shard: {
        value: props.shard,
        validateOnChange: false,
        valid: true,
      },
      showStructures: true,
      submitCalled: false,
      validForm: true,
      formError: '',
      modal: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleCheckboxChange(e: any) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    this.setState({ [e.target.name]: value });
    this.props.planner.setState({ [e.target.name]: value });
  }

  handleTextBlur(e: any, validationFunc: Function) {
    const field: 'room' | 'world' | 'shard' = e.target.name;
    const value = e.target.value;

    if (this.state[field].validateOnChange === false && this.state.submitCalled === false) {
      this.setState({
        [field]: {
          value: value,
          validateOnChange: true,
          valid: validationFunc(value),
        },
      });
      this.props.planner.setState({ [field]: value });
    }
  }

  handleTextChange(field: 'room' | 'world' | 'shard', value: string, validationFunc: Function) {
    this.setState({
      [field]: {
        value: value,
        valid: this.state[field].validateOnChange ? validationFunc(value) : true,
      },
    });
    this.props.planner.setState({ [field]: value });

    if (field === 'world') {
      // Changing world select option will select the first shard drop-down option
      const firstOption = this.props.worlds[value].shards[0];
      this.setState({
        shard: {
          value: firstOption,
          valid: this.validateShard(value),
        },
      });
      this.props.planner.setState({ shard: firstOption });
    }
  }

  validateRoom(room: string): boolean {
    if (typeof room !== 'string') return false;
    if (room.length < 4) return false;

    const regexRoom = new RegExp('^([WE]{1})([0-9]{1,2})([NS]{1})([0-9]{1,2})$');
    return room.match(regexRoom) !== null;
  }

  validateWorld(world: string): boolean {
    if (typeof world !== 'string') return false;
    if (world.length < 1) return false;

    return true;
  }

  validateShard(shard: string): boolean {
    if (typeof shard !== 'string') return false;
    if (shard.length < 1) return false;

    return true;
  }

  handleSubmit(e: any) {
    e.preventDefault();

    const parent = this.props.planner;
    const room = this.state.room.value;
    const world = this.state.world.value;
    const shard = this.state.shard.value;
    const includeStructs = this.state.showStructures;

    const validation = [
      {
        field: 'room',
        value: room,
        validationFunc: this.validateRoom,
      },
      {
        field: 'world',
        value: world,
        validationFunc: this.validateWorld,
      },
      {
        field: 'shard',
        value: shard,
        validationFunc: this.validateShard,
      },
    ];

    for (let props of validation) {
      let valid = props.validationFunc(props.value);
      this.setState({
        [props.field]: {
          value: props.value,
          valid: valid,
          validateOnChange: !valid,
        },
      });
      if (!valid) {
        return;
      }
    }

    fetch(Utils.getRoomTerrainUrl(world, shard, room)).then((response) => {
      if (!response.ok) {
        this.setState({ validForm: false, formError: 'Screeps Room Terrain API failed.' });
        return;
      }
      response.json().then((data: { ok: boolean; terrain: Array<{ terrain: string }>; error?: string }) => {
        if (!data || !data.ok) {
          this.setState({ validForm: false, formError: 'Bad data received from Screeps Room Terrain API.' });
          return;
        }
        if (data.error) {
          this.setState({ validForm: false, formError: data.error });
          return;
        }
        let { terrain } = data.terrain[0];
        let terrainMap: TerrainMap = {};
        for (var y = 0; y < 50; y++) {
          terrainMap[y] = {};
          for (var x = 0; x < 50; x++) {
            let code = terrain.charAt(y * 50 + x);
            terrainMap[y][x] = parseInt(code);
          }
        }
        parent.setState({
          terrain: terrainMap,
          room: room,
          world: world,
          shard: shard,
        });
      });
    });

    fetch(Utils.getRoomObjectsUrl(world, shard, room)).then((response) => {
      if (!response.ok) {
        this.setState({ validForm: false, formError: 'Screeps Room Objects API failed.' });
        return;
      }
      response
        .json()
        .then(
          (data: {
            ok: boolean;
            objects: Array<{ type: string; x: number; y: number; mineralType?: string }>;
            error?: string;
          }) => {
            if (!data || !data.ok) {
              this.setState({ validForm: false, formError: 'Bad data received from Screeps Room Objects API.' });
              return;
            }
            if (data.error) {
              this.setState({ validForm: false, formError: data.error });
              return;
            }

            let sources: { x: number; y: number }[] = [];
            let mineral: { [mineralType: string]: { x: number; y: number } } = {};
            let structures: { [structure: string]: { x: number; y: number }[] } = {};

            let keepStructures = ['controller'];
            if (includeStructs) {
              keepStructures.push(...Object.keys(Constants.CONTROLLER_STRUCTURES));
            }
            for (let o of data.objects) {
              if (o.type === 'source') {
                sources.push({
                  x: o.x,
                  y: o.y,
                });
              } else if (o.type === 'mineral') {
                mineral[o.mineralType!] = {
                  x: o.x,
                  y: o.y,
                };
              } else {
                if (keepStructures.indexOf(o.type) > -1) {
                  if (!structures[o.type]) {
                    structures[o.type] = [];
                  }
                  structures[o.type].push({
                    x: o.x,
                    y: o.y,
                  });
                }
              }
            }
            parent.setState({
              structures: structures,
              sources: sources,
              mineral: mineral,
            });
            this.toggleModal();
          }
        );
    });
  }

  getSelectedWorld() {
    const world = this.state.world.value;
    if (!world) {
      return null;
    }
    return {
      value: world,
      label: Constants.WORLDS[world],
    };
  }

  getWorldOptions() {
    return Object.keys(this.props.worlds).map((world) => ({
      value: world,
      label: Constants.WORLDS[world],
    }));
  }

  getSelectedShard() {
    const shard = this.state.shard.value;
    if (!shard) {
      return null;
    }
    return {
      value: shard,
      label: shard,
    };
  }

  getShardOptions() {
    const world = this.props.worlds[this.state.world.value];
    if (!world) {
      return [];
    }
    return world.shards.map((shard) => ({
      value: shard,
      label: shard,
    }));
  }

  toggleModal() {
    this.setState({ modal: !this.state.modal });
  }

  render() {
    return (
      <>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => this.toggleModal()}
          onMouseDown={(e) => e.preventDefault()}
        >
          <FontAwesomeIcon icon={faDownload} className="pe-1" /> Import Room
        </Button>
        <Modal show={this.state.modal} onHide={() => this.toggleModal()} className="import-room">
          <Modal.Header closeButton>Import Room</Modal.Header>
          <Modal.Body>
            <form id="load-room" className="load-room" onSubmit={this.handleSubmit}>
              <Row>
                <Col xs={6}>
                  <Form.Group className="mb-2">
                    <Form.Label htmlFor="worldName">World</Form.Label>
                    {Object.keys(this.props.worlds).length === 0 && <div className="loading">Loading</div>}
                    {Object.keys(this.props.worlds).length > 0 && (
                      <Form.Select
                        id="worldName"
                        value={this.props.world}
                        onChange={(e) => this.handleTextChange('world', e.target.value, this.validateWorld)}
                        className="select-world"
                      >
                        {this.getWorldOptions().map(({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </Form.Select>
                    )}
                    {!this.state.world.valid && (
                      <Alert variant="danger" className="py-1 px-2">
                        Invalid world selection
                      </Alert>
                    )}
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group className="mb-2">
                    <Form.Label htmlFor="shardName">Shard</Form.Label>
                    {!this.state.world.valid && <div className="loading">Loading</div>}
                    {this.state.world.valid && (
                      <Form.Select
                        id="shardName"
                        value={this.props.shard}
                        onChange={(e) => this.handleTextChange('shard', e.target.value, this.validateShard)}
                        className="select-shard"
                      >
                        {this.getShardOptions().map(({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </Form.Select>
                    )}
                    {!this.state.shard.valid && (
                      <Alert variant="danger" className="py-1 px-2">
                        Invalid shard selection
                      </Alert>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label htmlFor="roomName">Room name</Form.Label>
                    <Form.Control
                      id="roomName"
                      name="room"
                      value={this.state.room.value}
                      onBlur={(e) => this.handleTextBlur(e, this.validateRoom)}
                      onChange={(e) => this.handleTextChange('room', e.target.value, this.validateRoom)}
                    />
                    {!this.state.room.valid && (
                      <Alert variant="danger" className="py-1 px-2">
                        Invalid room name
                      </Alert>
                    )}
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group>
                    <Form.Check
                      type="checkbox"
                      id="showStructures"
                      name="showStructures"
                      checked={this.state.showStructures}
                      onChange={(e) => this.handleCheckboxChange(e)}
                      label="Include Structures"
                      className="mt-4"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </form>
          </Modal.Body>
          <Modal.Footer className="d-flex">
            {!this.state.validForm && this.state.formError && (
              <Alert variant="danger" className="py-1 px-2">
                {this.state.formError}
              </Alert>
            )}
            <Button type="submit" form="load-room" onMouseDown={() => this.setState({ submitCalled: true })}>
              Import Room
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
