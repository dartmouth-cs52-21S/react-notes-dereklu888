/**
 *  Main JS script for the notes application.
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import AddBar from './components/AddBar';
import Note from './components/Note';
import './style.scss';
import * as db from './services/datastore';

/**
 * Main React component
 */
class App extends Component {
  /**
     * The constructor sets the initial state, specifying the Immutable.Map as notes
     * @param {*} props
     */
  constructor(props) {
    super(props);

    // eslint-disable-next-line new-cap
    this.state = { notes: Immutable.Map() };
  }

  /**
   * This function simply fetches the data available in Firebase when the component is mounted.
   */
  componentDidMount() {
    db.fetchNotes((newState) => {
      // eslint-disable-next-line new-cap
      this.setState({ notes: Immutable.Map(newState) });
    });
  }

  /**
   * This function deletes a given note ID.
   *
   * @param {string} id The id of the note to be deleted
   */
  deleteNote = (id) => {
    db.pushDelete(id);
  }

  /**
   * This function creates a new note on top of all other notes.
   *
   * @param {Object} note The note object to be created, this is usually just the note title as per the input from the AddBar.
   */
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

  /**
   * This function updates the note with the given id with the new properties specified in the newNote object.
   *
   * @param {string} id The ID of the note to be updated.
   * @param {Object} newNote The properties to be set/updated.
   */
  updateNote = (id, newNote) => {
    db.pushUpdate(id, newNote);
  }

  /**
   * This function brings forward a note so that it is on top of all other notes.
   *
   * @param {string} id The note ID to be brought forward.
   */
  bringFoward = (id) => {
    this.state.notes.entrySeq().forEach(([noteid, note]) => {
      if (id !== noteid && note.zIndex > this.state.notes.get(id).zIndex) {
        db.pushUpdate(noteid, { zIndex: note.zIndex - 1 });
      }
    });
    db.pushUpdate(id, { zIndex: this.state.notes.size });
  }

  /**
   * This function organizes all notes so that they are visible
   */
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
