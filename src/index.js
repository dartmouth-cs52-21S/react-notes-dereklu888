import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import AddBar from './components/AddBar';
import Note from './components/Note';
import './style.scss';
import * as db from './services/datastore';

class App extends Component {
  constructor(props) {
    super(props);

    // eslint-disable-next-line new-cap
    this.state = { notes: Immutable.Map() };
  }

  componentDidMount() {
    db.fetchNotes((newState) => {
      // eslint-disable-next-line new-cap
      this.setState({ notes: Immutable.Map(newState) });
    });
  }

  countUp = () => {
    this.counter += 1;
    return this.counter;
  }

  deleteNote = (id) => {
    // this.setState((prevState) => ({
    //   notes: prevState.notes.delete(id),
    // }));
    db.pushDelete(id);
  }

  addNote = (note) => {
    const defaultNote = {
      text: '',
      x: 200,
      y: 200,
      width: 200,
      height: 200,
      zIndex: 10,
    };

    // this.setState((prevState) => ({
    //   notes: prevState.notes.set(tempID, { ...note, ...defaultNote }),
    // }));
    db.pushNew({ ...note, ...defaultNote });
  }

  //   takes an object with note properties
  updateNote = (id, newNote) => {
    // this.setState((prevState) => ({
    //   notes: prevState.notes.update(id, (prevNote) => { return { ...prevNote, ...newNote }; }),
    // }));
    db.pushUpdate(id, newNote);
  }

  render() {
    //   the map [id, note] is destructuring the key, value tuple created by entrySeq https://zellwk.com/blog/es6/
    const notesItems = this.state.notes.entrySeq().map(([id, note]) => {
      return (
        <Note id={id}
          title={note.title}
          text={note.text}
          x={note.x}
          y={note.y}
          width={note.width}
          height={note.height}
          zIndex={note.zIndex}
          deleteNote={this.deleteNote}
          updateNote={this.updateNote}
          key={id}
        />
      );
    });
    return (
      <div className="content-wrapper">
        <div className="top-bar">
          <h1>My Bulletin Board</h1>
          <AddBar addNote={this.addNote} />
        </div>

        <div className="canvas">
          {notesItems}
        </div>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('main'));
