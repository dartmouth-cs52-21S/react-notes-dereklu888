import React, { Component } from 'react';
import Draggable from 'react-draggable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPencilAlt, faCheck, faExpandArrowsAlt,
} from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import ReactMarkdown from 'react-markdown';
import TextareaAutosize from 'react-textarea-autosize';
import { ResizableBox } from 'react-resizable';
import '../../node_modules/react-resizable/css/styles.css';

class Note extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
    //   x: this.props.x,
    //   y: this.props.y,
    //   text: this.props.text,
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
    // this.setState((prevState) => ({
    //   ...prevState,
    //   text: event.target.value,
    // }));
    this.props.updateNote(this.props.id, {
      text: event.target.value,
    });
  }

  renderEdit = () => {
    if (this.state.isEditing) {
      // get the autosize text area module
      return (<TextareaAutosize onChange={this.onInputChange} value={this.props.text} />);
    } else {
      return (<ReactMarkdown>{this.props.text || ''}</ReactMarkdown>);
    }
  }

  handleDrag = (e, dragData) => {
    // this.setState((prevState) => ({
    //   ...prevState,
    //   x: dragData.x,
    //   y: dragData.y,
    // }));
    this.props.updateNote(this.props.id, {
      x: dragData.x,
      y: dragData.y,
    });
  }

  handleResize = (e, resizeData) => {
    this.props.updateNote(this.props.id, {
      width: resizeData.size.width,
      height: resizeData.size.height,
    });
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
            x: this.props.x, y: this.props.y,
          }}
          onDrag={this.handleDrag}
        >
          <ResizableBox resizeHandles={['se']}
            width={this.props.width}
            height={this.props.height}
            minConstraints={[160, 160]}
            maxConstraints={[500, 500]}
            handleSize={[20, 20]}
            onResize={this.handleResize}
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
          </ResizableBox>
        </Draggable>

      </div>
    );
  }
}

export default Note;
