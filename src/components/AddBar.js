/**
 * This file contains the AddBar component to be used in the App component.
 */

import React, { Component } from 'react';

/**
 * AddBar component
 */
class AddBar extends Component {
  /**
   * This function sets the current input value as an empty string.
   *
   * @param {*} props
   */
  constructor(props) {
    super(props);

    this.state = { newTitle: '' };
  }

  /**
   * This event handler changes the input box value based on the changes in it (a driven input box).
   *
   * @param {Event} event
   */
  onInputChange = (event) => {
    this.setState((prevState) => ({
      newTitle: event.target.value,
    }));
  }

  /**
   * This function creates a note by calling the addNote function passed to it with the title given.
   */
  makeNote = () => {
    if (this.state.newTitle) {
      this.props.addNote({ title: this.state.newTitle });
      this.setState((prevState) => ({
        newTitle: '',
      }));
    }
  }

  render() {
    return (
      <div id="add-bar">
        <span className="note-creator">
          <input onChange={this.onInputChange} value={this.state.newTitle} placeholder="New note title" />
          <button type="submit" onClick={this.makeNote}>Submit</button>
        </span>

        <button type="submit" onClick={this.props.organize} className="organize">Organize</button>
      </div>
    );
  }
}

export default AddBar;
