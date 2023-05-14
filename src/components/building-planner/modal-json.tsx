import * as React from 'react';
import * as Constants from '../../utils/constants';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

export class ModalJson extends React.Component<ModalProps> {
  state: Readonly<{
    modal: boolean;
    format: boolean;
  }>;

  constructor(props: any) {
    super(props);
    this.state = {
      modal: false,
      format: true,
    };
  }

  createJson() {
    let buildings: { [structure: string]: { pos: Array<{ x: number; y: number }> } } = {};

    const parent = this.props.planner;
    let json = {
      name: parent.state.room,
      shard: parent.state.shard,
      rcl: parent.state.rcl,
      buildings: buildings,
    };
    const keepStructures = Object.keys(Constants.CONTROLLER_STRUCTURES);

    Object.keys(parent.state.structures).forEach((structure) => {
      if (
        keepStructures.indexOf(structure) > -1 &&
        parent.state.structures[structure].length > 0 &&
        !json.buildings[structure]
      ) {
        json.buildings[structure] = {
          pos: parent.state.structures[structure],
        };
      }
    });

    return json;
  }

  displayJson = () =>
    this.state.format
      ? JSON.stringify(this.createJson(), null, 2).replace(
          /{\n\s+"x": ([0-9]{1,4}),\n\s+"y": ([0-9]{1,4})\n\s+}/g,
          '{"x":$1,"y":$2}'
        )
      : JSON.stringify(this.createJson());

  import(e: any) {
    let json = JSON.parse(e.target.value);
    this.props.planner.loadJson(json);
  }

  toggleModal() {
    this.setState({ modal: !this.state.modal });
  }

  toggleFormatting(e: any) {
    this.setState({ format: e.target.checked });
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
          <FontAwesomeIcon icon={faCopy} className="pe-1" /> Room JSON
        </Button>
        <Modal size="lg" show={this.state.modal} onHide={() => this.toggleModal()} className="import-room">
          <Modal.Header closeButton>Room JSON</Modal.Header>
          <Modal.Body>
            <Row>
              <Col xs={12}>
                <Form.Control
                  as="textarea"
                  id="json-data"
                  onChange={(e) => this.import(e)}
                  value={this.displayJson()}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Check
                  type="checkbox"
                  id="format-json"
                  name="format-json"
                  checked={this.state.format}
                  onChange={(e) => this.toggleFormatting(e)}
                  label="Pretty Format"
                />
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
