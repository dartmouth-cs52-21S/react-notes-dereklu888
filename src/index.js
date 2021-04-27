/**
 *  Main JS script for the notes application.
 */
import firebase from 'firebase';
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
    this.state = { auth: false, notes: Immutable.Map() };
  }

  /**
   * This function simply fetches the data available in Firebase when the component is mounted.
   */
  componentDidMount() {
    db.fetchNotes((newState) => {
      // eslint-disable-next-line new-cap
      this.setState((prevState) => ({
        ...prevState,
        // eslint-disable-next-line new-cap
        notes: Immutable.Map(newState),
      }));
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

  handleRegister = () => {
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((userCredential) => {
        this.setState((prevState) => ({
          ...prevState,
          auth: true,
        }));
      })
      .catch((error) => {
        console.log('Register failed');
      });
  }

  handleSignIn = () => {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((userCredential) => {
        this.setState((prevState) => ({
          ...prevState,
          auth: true,
        }));
      })
      .catch((error) => {
        console.log('Register failed');
      });
  }

  onInputChangeEmail = (event) => {
    this.setState((prevState) => ({
      ...prevState,
      email: event.target.value,
    }));
  }

  onInputChangePass = (event) => {
    this.setState((prevState) => ({
      ...prevState,
      password: event.target.value,
    }));
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
    if (firebase.auth().currentUser) {
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
    } else {
      return (
        <div className="content-wrapper">
          <h1>Please register or log in!</h1>
          <p>Email:</p>
          <input className="auth" type="email" name="email" onChange={this.onInputChangeEmail} />
          <p>Password: (must be at least 8 characters long)</p>
          <input className="auth" type="password" name="password" id="password" onChange={this.onInputChangePass} />
          <button type="submit" onClick={this.handleRegister} className="auth">Register</button>
          <button type="submit" onClick={this.handleSignIn} className="auth">Log in</button>
        </div>
      );
    }
  }
}
ReactDOM.render(<App />, document.getElementById('main'));
