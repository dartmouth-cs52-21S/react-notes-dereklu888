import React, { Component } from 'react';

class Note extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
    };
  }

  toggleEdit = () => {
    this.setState((prevState) => ({
      isEditing: !prevState.isEditing,
    }));
  }

  renderEdit = () => {
    if (this.state.isEditing) {
      // get the autosize text area module
      return (<textarea />);
    } else {
      return (<div />);
    }
  }

  render() {
    return (
      <div className="note" id={this.props.id}>
        {/* make this a flex */}
        <div className="note-bar">
          <h2>{this.props.title}</h2>

          <i id="mini-icon" aria-label="Delete" role="button" className="delete far fa-trash-alt" onClick={this.props.deleteNote(this.props.id)} tabIndex={0} />
          <i id="mini-icon" aria-label="Edit" role="button" className={this.state.isEditing ? 'edit fas fa-pencil-alt' : 'edit fas fa-check'} onClick={this.toggleEdit} tabIndex={0} />

          {/* align self to flex end */}
          <i id="mini-icon" aria-label="Drag" role="button" className="drag fas fa-expand-arrows-alt" />

        </div>
        <div className="note-content">
          {this.renderEdit()}
        </div>
      </div>
    );
  }
}

export default Note;
