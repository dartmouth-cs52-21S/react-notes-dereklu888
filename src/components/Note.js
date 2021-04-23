import React, { Component } from 'react';
import Draggable from 'react-draggable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faCheck, faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

class Note extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      x: this.props.x,
      y: this.props.y,
      text: this.props.text,
    };
  }

  toggleEdit = () => {
    this.setState((prevState) => ({
      isEditing: !prevState.isEditing,
    }));
  }

  deleteSelf = () => {
    this.props.deleteNote(this.props.id);
  }

  onInputChange = (event) => {
    this.setState((prevState) => ({
      ...prevState,
      text: event.target.value,
    }));
    // this.props.updateNote(this.props.id, {
    //   text: event.target.value,
    // });
  }

  renderEdit = () => {
    if (this.state.isEditing) {
      // get the autosize text area module
      return (<textarea onChange={this.onInputChange} value={this.state.text} />);
    } else {
      return (<p>{this.state.text}</p>);
    }
  }

  handleDrag = (e, dragData) => {
    this.setState((prevState) => ({
      ...prevState,
      x: dragData.x,
      y: dragData.y,
    }));
    // this.props.updateNote(this.props.id, {
    //   x: dragData.x,
    //   y: dragData.y,
    // });
  }

  getEditIcon = () => {
    return (!this.state.isEditing ? faPencilAlt : faCheck);
  }

  render() {
    return (
      <div className="note" id={this.props.id}>
        <Draggable
          handle=".drag"
          grid={[1, 1]}
          bounds=".content-wrapper"
          defaultPosition={{ x: this.props.x, y: this.props.y }}
          position={{
            x: this.state.x, y: this.state.y,
          }}
          onDrag={this.handleDrag}
        >
          <div className="note-content">

            {/* make this a flex */}
            <div className="note-bar">
              <h2>{this.props.title}</h2>

              <FontAwesomeIcon icon={faTrashAlt}
                aria-label="Delete"
                role="button"
                className="delete"
                onClick={this.deleteSelf}
                tabIndex={0}
              />
              <FontAwesomeIcon icon={this.getEditIcon()}
                aria-label="Edit"
                role="button"
                className="edit"
                onClick={this.toggleEdit}
                tabIndex={0}
              />

              {/* align self to flex end */}
              <FontAwesomeIcon icon={faExpandArrowsAlt} aria-label="Drag" role="button" className="drag" />

            </div>
            <div className="note-text">
              {this.renderEdit()}
            </div>
          </div>
        </Draggable>
      </div>
    );
  }
}

export default Note;
