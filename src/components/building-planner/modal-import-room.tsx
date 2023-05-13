import * as React from 'react';
import * as Constants from '../common/constants';
import { screepsWorlds } from '../common/utils';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
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
    this.toggleModal();

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

    fetch(`/api/terrain/${world}/${shard}/${room}`).then((response) => {
      response.json().then((data: any) => {
        let terrain = data.terrain[0].terrain;
        let terrainMap: TerrainMap = {};
        for (var y = 0; y < 50; y++) {
          terrainMap[y] = {};
          for (var x = 0; x < 50; x++) {
            let code = terrain.charAt(y * 50 + x);
            terrainMap[y][x] = code;
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

    fetch(`/api/objects/${world}/${shard}/${room}`).then((response) => {
      response.json().then((data: any) => {
        let sources: { x: number; y: number }[] = [];
        let mineral: { [mineralType: string]: { x: number; y: number } } = {};
        let structures: { [structure: string]: { x: number; y: number }[] } = {};

        let keepStructures = ['controller'];
        if (includeStructs) {
          keepStructures.push(...Object.keys(Constants.CONTROLLER_STRUCTURES));
        }
        for (let o of data.objects) {
          if (o.type == 'source') {
            sources.push({
              x: o.x,
              y: o.y,
            });
          } else if (o.type == 'mineral') {
            mineral[o.mineralType] = {
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
      });
    });
  }

  getSelectedWorld() {
    const world = this.state.world.value;
    if (!world) {
      return null;
    }
    const selected = {
      value: world,
      label: screepsWorlds[world],
    };
    return selected;
  }

  getWorldOptions() {
    const options: Array<SelectOption> = [];

    Object.keys(this.props.worlds).map((world) => {
      let props = {
        value: world,
        label: screepsWorlds[world],
      };
      options.push(props);
    });
    return options;
  }

  getSelectedShard() {
    const shard = this.state.shard.value;
    if (!shard) {
      return null;
    }
    const selected: SelectOption = {
      value: shard,
      label: shard,
    };
    return selected;
  }

  getShardOptions() {
    const world = this.props.worlds[this.state.world.value];
    if (!world) {
      return [];
    }
    const options: SelectOption[] = [];

    world.shards.map((shard) => {
      let props: SelectOption = {
        value: shard,
        label: shard,
      };
      options.push(props);
    });
    return options;
  }

  toggleModal() {
    this.setState({ modal: !this.state.modal });
  }

  render() {
    return (
      <>
        <button className="btn btn-secondary" onClick={() => this.toggleModal()}>
          <FontAwesomeIcon icon={faDownload} className="pe-1" /> Import Room
        </button>
        <Modal show={this.state.modal} onHide={() => this.toggleModal()} className="import-room">
          <Modal.Header closeButton>Import Room</Modal.Header>
          <Modal.Body>
            <form id="load-room" className="load-room" onSubmit={this.handleSubmit}>
              <Row>
                <Col xs={6}>
                  <Form.Label for="worldName">World</Form.Label>
                  {Object.keys(this.props.worlds).length === 0 && <div className="loading">Loading</div>}
                  {Object.keys(this.props.worlds).length > 0 && (
                    <Form.Select
                      value={this.props.world}
                      onChange={(e) => this.handleTextChange('world', e.target.value, this.validateWorld)}
                      className="select-world"
                    >
                      {this.getWorldOptions().map(({ value, label }) => (
                        <option value={value}>{label}</option>
                      ))}
                    </Form.Select>
                  )}
                  {!this.state.world.valid && (
                    <Alert variant="danger" className="p-1">
                      Invalid world selection
                    </Alert>
                  )}
                </Col>
                <Col xs={6}>
                  <Form.Label for="shardName">Shard</Form.Label>
                  {!this.state.world.valid && <div className="loading">Loading</div>}
                  {this.state.world.valid && (
                    <Form.Select
                      value={this.props.shard}
                      onChange={(e) => this.handleTextChange('shard', e.target.value, this.validateShard)}
                      className="select-shard"
                    >
                      {this.getShardOptions().map(({ value, label }) => (
                        <option value={value}>{label}</option>
                      ))}
                    </Form.Select>
                  )}
                  {!this.state.shard.valid && (
                    <Alert variant="danger" className="p-1">
                      Invalid shard selection
                    </Alert>
                  )}
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
                  <Form.Label for="roomName">Room</Form.Label>
                  <Form.Control
                    id="roomName"
                    name="room"
                    value={this.state.room.value}
                    onBlur={(e) => this.handleTextBlur(e, this.validateRoom)}
                    onChange={(e) => this.handleTextChange('room', e.target.value, this.validateRoom)}
                  />
                  {!this.state.room.valid && (
                    <Alert variant="danger" className="p-1">
                      Invalid room name
                    </Alert>
                  )}
                </Col>
                <Col xs={6}>
                  <Form.Check
                    type="checkbox"
                    id="showStructures"
                    name="showStructures"
                    checked={this.state.showStructures}
                    onChange={(e) => this.handleCheckboxChange(e)}
                    label="Include Structures"
                    className="mt-4"
                  />
                </Col>
              </Row>
              <Row>
                <Col></Col>
              </Row>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="submit"
              form="load-room"
              className="btn btn-primary"
              onMouseDown={() => this.setState({ submitCalled: true })}
            >
              Import Room
            </button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
