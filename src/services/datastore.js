import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyD9EBHUeZh91PBruZG6t-vh-DdH6sQ0nng',
  authDomain: 'react-notes-f535a.firebaseapp.com',
  databaseURL: 'https://react-notes-f535a-default-rtdb.firebaseio.com',
  projectId: 'react-notes-f535a',
  storageBucket: 'react-notes-f535a.appspot.com',
  messagingSenderId: '937706150591',
  appId: '1:937706150591:web:aca665cdb375a60b4f840a',
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log('Firebase started');

export function fetchNotes(callback) {
  firebase.database().ref('notes').on('value', (snapshot) => {
    const newNoteState = snapshot.val();
    callback(newNoteState);
  });
}

export function pushDelete(id) {
  firebase.database().ref('notes').child(id).remove();
}

export function pushNew(note) {
  return firebase.database().ref('notes').push(note).key;
}

export function pushUpdate(id, note) {
  firebase.database().ref('notes').child(id).update(note);
}
