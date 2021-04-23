import React, { Component } from 'react';

class AddBar extends Component {
  constructor(props) {
    super(props);

    this.state = { newTitle: '' };
  }

  onInputChange = (event) => {
    this.setState((prevState) => ({
      newTitle: event.target.value,
    }));
  }

  makeNote = () => {
    // remove placeholder ID when implement server
    if (this.state.newTitle) {
      this.props.addNote(1, { title: this.state.newTitle });
      this.setState((prevState) => ({
        newTitle: '',
      }));
    }
  }

  render() {
    return (
      <div id="add-bar">
        <input onChange={this.onInputChange} value={this.state.newTitle} />
        <button type="submit" onClick={this.makeNote}>Submit</button>
      </div>
    );
  }
}

export default AddBar;
