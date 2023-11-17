// client/src/PropsAndState.js
import React, { useState } from 'react';

const PropsAndState = ({ propValue }) => {
  const [stateValue, setStateValue] = useState('Initial State');

  const handleStateChange = () => {
    setStateValue('Updated State');
  };

  return (
    <div>
      <p>Prop Value: {propValue}</p>
      <p>State Value: {stateValue}</p>
      <button onClick={handleStateChange}>Change State</button>
    </div>
  );
};

export default PropsAndState;
