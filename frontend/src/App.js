import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import ClassComponent from './frontend/src/classComponent';
import FunctionalComponent from './FunctionalComponent';
import React, { Component } from 'react';
import ConditionalComponent from './conditionalComponent';

function App() {
  const [classwork, setClasswork] = useState([
    { id: 1, name: 'Cpan 209 - Systems Design' },
    { id: 2, name: 'Cpan 211 - Data Structures & Algorithms' },
    { id: 3, name: 'Cpan 212 - Modern Web Technologies' },
    { id: 4, name: 'Cpan 213 - Cross-Platform Mobile App Dev.' },
    { id: 5, name: 'Cpan 214 - High-Level Prgrmng Languages' },
    { id: 6, name: 'Hist 217 - History of War' },
  ]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask) {
      const newId = classwork.length + 1;
      const newTaskObj = { id: newId, name: newTask };
      setClasswork([...classwork, newTaskObj]);
      setNewTask('');
    }
  };

  return (
    <div>
      <h1>Classwork List</h1>
      <ul>
        {classwork.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>

      <div>
        <input
          type="text"
          placeholder="Add a task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <h1>App Component</h1>
      <FunctionalComponent message="This message will be edited to do something in the future" />
      <h1>App Component</h1>
      <ClassComponent />
    </div>
  );
}

export default App;

