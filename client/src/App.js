import React, { useState, useEffect } from 'react';
import './App.css'; // Your CSS file

const usePlanInput = () => {
  const [newPlan, setNewPlan] = useState({ destination: '', date: '', traveler: '' });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewPlan({ ...newPlan, [name]: value });
  };

  return { newPlan, handleInputChange, setNewPlan };
};

const App = () => {
  const [travelPlans, setTravelPlans] = useState([]);
  const [displayPlans, setDisplayPlans] = useState(false);
  const { newPlan, handleInputChange, setNewPlan } = usePlanInput();

  useEffect(() => {
    // Fetch initial travel plans from your Node.js API endpoint
    fetch('http://localhost:3000/api/v1/travel-plans') // Update with your API URL
      .then((response) => response.json())
      .then((data) => setTravelPlans(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleAddPlan = () => {
    fetch('http://localhost:3000/api/v1/travel-plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPlan),
    })
      .then((response) => response.json())
      .then((data) => {
        setTravelPlans([...travelPlans, data]);
        setNewPlan({ destination: '', date: '', traveler: '' });
      })
      .catch((error) => console.error('Error adding plan:', error));
  };

  const handleDeletePlan = (id) => {
    fetch(`http://localhost:3000/api/v1/travel-plans/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedPlans = travelPlans.filter((plan) => plan.id !== id);
        setTravelPlans(updatedPlans);
      })
      .catch((error) => console.error('Error deleting plan:', error));
  };

  const toggleDisplayPlans = () => {
    setDisplayPlans(!displayPlans);
  };

  return (
    <div className="App">
      <h1>Travel Plans</h1>

      <form onSubmit={handleAddPlan}>
        <input type="text" name="destination" placeholder="Destination" value={newPlan.destination} onChange={handleInputChange} />
        <input type="text" name="date" placeholder="Date" value={newPlan.date} onChange={handleInputChange} />
        <input type="text" name="traveler" placeholder="Traveler" value={newPlan.traveler} onChange={handleInputChange} />
        <button type="submit">Add Plan</button>
      </form>

      <button onClick={toggleDisplayPlans}>Display Travel Plans</button>

      {displayPlans && travelPlans.length > 0 && (
        <ul>
          {travelPlans.map((plan) => (
            <li key={plan.id}>
              Destination: {plan.destination}, Date: {plan.date}, Traveler: {plan.traveler}
              <button onClick={() => handleDeletePlan(plan.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      {displayPlans && travelPlans.length === 0 && (
        <p>No travel plans available.</p>
      )}
    </div>
  );
};

export default App;
