/**
 * This file contains the note component to be used in the App component.
 */

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

/**
 * Note component
 */
class Note extends Component {
  /**
     * The constructor simply sets the current editing status to false.
     *
     * @param {*} props
     */
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
    };
  }

  /**
   * This function toggles the note's state of whether it is currently in edit mode or not.
   */
  toggleEdit = () => {
    this.setState((prevState) => ({
      isEditing: !prevState.isEditing,
    }));
  }

  /**
   * This function deletes this note by calling the deleteNote function passed in.
   */
  deleteSelf = () => {
    this.props.deleteNote(this.props.id);
  }

  /**
   * This event handler updates the note's text as it is being changed.
   *
   * @param {Event} event
   */
  onInputChange = (event) => {
    this.props.updateNote(this.props.id, {
      text: event.target.value,
    });
  }

  /**
   * This function returns either a text input box if the note is in editing mode, or just the text if not.
   *
   * @returns a JSX component to either allow editing or display text.
   */
  renderEdit = () => {
    if (this.state.isEditing) {
      return (<TextareaAutosize onChange={this.onInputChange} value={this.props.text} />);
    } else {
      return (<ReactMarkdown>{this.props.text || ''}</ReactMarkdown>);
    }
  }

  /**
   * This event handler updates the note's x and y position as it is dragged.
   *
   * @param {Event} e
   * @param {Object} dragData
   */
  handleDrag = (e, dragData) => {
    this.props.updateNote(this.props.id, {
      x: dragData.x,
      y: dragData.y,
    });
  }

  /**
   * This event handler updates the note's width and height as it is being resized.
   *
   * @param {} e
   * @param {*} resizeData
   */
  handleResize = (e, resizeData) => {
    this.props.updateNote(this.props.id, {
      width: resizeData.size.width,
      height: resizeData.size.height,
    });
  }

  /**
   * This function is used to render the icon when editing or not.
   *
   * @returns A pencil icon if the note is not in edit mode, a check if it is.
   */
  getEditIcon = () => {
    return (!this.state.isEditing ? faPencilAlt : faCheck);
  }

  render() {
    return (
      <div className="note" id={this.props.id}>

        <Draggable
          handle=".drag"
          grid={[2, 2]}
          bounds=".content-wrapper"
          defaultPosition={{ x: this.props.x, y: this.props.y }}
          position={{
            x: this.props.x, y: this.props.y,
          }}
          onDrag={this.handleDrag}
          onMouseDown={() => { this.props.bringFoward(this.props.id); }}
        >
          <ResizableBox resizeHandles={['se']}
            width={this.props.width}
            height={this.props.height}
            minConstraints={[160, 160]}
            maxConstraints={[500, 500]}
            handleSize={[20, 20]}
            onResize={this.handleResize}
            style={{ zIndex: this.props.zIndex }}
          >

            <div className="note-content">

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
