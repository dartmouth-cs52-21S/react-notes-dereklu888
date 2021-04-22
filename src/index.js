import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import AddBar from './components/AddBar';
import './style.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { notes: new Immutable.Map() };
  }

  deleteNote = (id) => {
    this.setState((prevState) => ({
      notes: prevState.notes.delete(id),
    }));
  }

  addNote = (id, note) => {
    this.setState((prevState) => ({
      notes: prevState.notes.set(id, note),
    }));
  }

  //   takes an object with note properties
  updateNote = (id, newNote) => {
    this.setState((prevState) => ({
      notes: prevState.notes.update(id, (prevNote) => { return { ...prevNote, ...newNote }; }),
    }));
  }

  render() {
    //   the map [id, note] is destructuring the key, value tuple created by entrySeq https://zellwk.com/blog/es6/
    const notesItems = this.state.notes.entrySeq().map(([id, note]) => {
      return <div>id</div>;
    });
    return (
      <div className="content-wrapper">
        <AddBar />
        <div className="canvas">
          {notesItems}
        </div>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('main'));
