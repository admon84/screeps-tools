import * as React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

export class ModalSettings extends React.Component<ModalProps> {
  state: Readonly<{
    modal: boolean;
  }>;

  constructor(props: any) {
    super(props);
    this.state = {
      modal: false,
    };
  }

  toggleModal() {
    this.setState({ modal: !this.state.modal });
  }

  handleCheckboxChange(e: any) {
    const field: 'showStatsOverlay' | 'blockStructuresOnEdges' = e.target.name;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    this.setState({ [field]: value });
    this.props.planner.setState({ [field]: value });

    this.props.planner.setState({
      settings: {
        ...this.props.planner.state.settings,
        [field]: value,
      },
    });
  }

  render() {
    return (
      <>
        <button className="btn btn-secondary" onClick={() => this.toggleModal()}>
          <FontAwesomeIcon icon={faCog} className="pe-1" /> Settings
        </button>
        <Modal show={this.state.modal} onHide={() => this.toggleModal()} className="settings">
          <Modal.Header closeButton>Settings</Modal.Header>
          <Modal.Body>
            <Form.Check
              type="checkbox"
              id="showStatsOverlay"
              name="showStatsOverlay"
              checked={this.props.planner.state.settings.showStatsOverlay}
              onChange={(e) => this.handleCheckboxChange(e)}
              label="Show hovered tile position (x, y)"
            />
            <Form.Check
              type="checkbox"
              id="blockStructuresOnEdges"
              name="blockStructuresOnEdges"
              checked={this.props.planner.state.settings.blockStructuresOnEdges}
              onChange={(e) => this.handleCheckboxChange(e)}
              label="Prevent structures from being placed on outer edge tiles"
            />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
