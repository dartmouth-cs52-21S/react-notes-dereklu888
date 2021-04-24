import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import AddBar from './components/AddBar';
import Note from './components/Note';
import './style.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.counter = 2;

    // eslint-disable-next-line new-cap
    const noteMap = Immutable.Map({
      0: {
        title: 'testing',
        text: '![](http://i.giphy.com/gyRWkLSQVqlPi.gif)',
        x: 400,
        y: 12,
        zIndex: 10,
      },
      1: {
        title: 'headings',
        text: '# large ',
        x: 300,
        y: 300,
        zIndex: 20,
      },
    });

    this.state = { notes: noteMap };
  }

  countUp = () => {
    this.counter += 1;
    return this.counter;
  }

  deleteNote = (id) => {
    console.log('Deleted Note');
    this.setState((prevState) => ({
      notes: prevState.notes.delete(id),
    }));
  }

  addNote = (id, note) => {
    //   REMOVE THIS TEMPID WHEN THE TIMES COMES
    const tempID = this.countUp();

    const defaultNote = {
      text: '',
      x: 200,
      y: 200,
      zIndex: 10,
    };

    this.setState((prevState) => ({
      notes: prevState.notes.set(tempID, { ...note, ...defaultNote }),
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
    console.log(this.counter);
    const notesItems = this.state.notes.entrySeq().map(([id, note]) => {
      return (
        <Note id={id}
          title={note.title}
          text={note.text}
          x={note.x}
          y={note.y}
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
