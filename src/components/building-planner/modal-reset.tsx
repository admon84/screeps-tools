import * as React from 'react';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export class ModalReset extends React.Component<ModalProps> {
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

  resetMap() {
    this.toggleModal();
    this.props.planner.resetState();
  }

  render() {
    return (
      <>
        <button className="btn btn-secondary" onClick={() => this.toggleModal()}>
          <FontAwesomeIcon icon={faTrashAlt} className="pe-1" /> Reset
        </button>
        <Modal show={this.state.modal} onHide={() => this.toggleModal()} className="reset-map">
          <Modal.Header closeButton>Reset Confirmation</Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to wipe the map and start over?</p>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" form="load-room" className="btn btn-primary" onMouseDown={() => this.resetMap()}>
              Yes, reset the map
            </button>
            <button className="btn btn-secondary" onClick={() => this.toggleModal()}>
              Cancel
            </button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
