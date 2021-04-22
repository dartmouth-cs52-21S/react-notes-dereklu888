import React from 'react';

const AddBar = (props) => {
  return (
    <div id="addbar">
      <input />
      <button type="submit" onClick={props.addNote()}>Submit</button>
    </div>
  );
};

export default AddBar;
