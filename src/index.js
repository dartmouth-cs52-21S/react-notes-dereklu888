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
    db.pushDelete(id);
  }

  addNote = (note) => {
    const defaultNote = {
      text: '',
      x: 200,
      y: 200,
      width: 200,
      height: 200,
      zIndex: this.state.notes.size + 1,
    };

    db.pushNew({ ...note, ...defaultNote });
  }

  //   takes an object with note properties
  updateNote = (id, newNote) => {
    db.pushUpdate(id, newNote);
  }

  bringFoward = (id) => {
    this.state.notes.entrySeq().forEach(([noteid, note]) => {
      if (id !== noteid && note.zIndex > this.state.notes.get(id).zIndex) {
        db.pushUpdate(noteid, { zIndex: note.zIndex - 1 });
      }
    });
    db.pushUpdate(id, { zIndex: this.state.notes.size });
  }

  organize = () => {
    let curx = 0;
    let cury = 0;
    let maxHeight = 0;
    this.state.notes.entrySeq().forEach(([id, note]) => {
      if (curx + note.width > 1000) {
        curx = 0;
        cury += maxHeight;
        maxHeight = 0;
      }
      maxHeight = note.height > maxHeight ? note.height : maxHeight;
      db.pushUpdate(id, { x: curx, y: cury });
      curx += note.width;
    });
  }

  render() {
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
          bringFoward={this.bringFoward}
          key={id}
        />
      );
    });
    return (
      <div className="content-wrapper">
        <div className="top-bar">
          <h1>My Bulletin Board</h1>
          <AddBar addNote={this.addNote} organize={this.organize} />
        </div>

        <div className="canvas">
          {notesItems}
        </div>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('main'));
