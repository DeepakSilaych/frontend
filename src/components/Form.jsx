import React, { useState } from 'react';
import axios from 'axios';

function Form() {
  const [name, setName] = useState('');
  const [height, setHeight] = useState('');
  const [waterlevel, setWaterlevel] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    let factor;
    if (waterlevel === 'Low') {
      factor = 0.33;
    } else if (waterlevel === 'Medium') {
      factor = 0.66;
    } else {
      factor = 1;
    }

    const waterLevelAdjusted = height * factor;

    let latitude = null;
    let longitude = null;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        sendData({ latitude, longitude, waterLevelAdjusted });
      },
      (error) => {
        console.error('Error fetching current location:', error);
        sendData({ latitude, longitude, waterLevelAdjusted });
      }
    );
  };

  const sendData = async (data) => {
    console.log(data);
    try {
      const response = await axios.post('http://localhost:8000/data/', {
        name : name,
        waterlevel: data.waterLevelAdjusted,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error storing data:', error);
      setMessage('Error: Unable to store data.');
    }
  };

  return (
    <div>
      <h1>Submit Data</h1>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required /><br /><br />

        <label htmlFor="height">Height (cm):</label>
        <input type="number" id="height" name="height" value={height} onChange={(e) => setHeight(e.target.value)} required /><br /><br />

        <label>Water Level:</label><br />
        <input type="radio" id="waterlevel1" name="waterlevel" value="Low" checked={waterlevel === 'Low'} onChange={() => setWaterlevel('Low')} />
        <label htmlFor="waterlevel1">Low</label><br />
        <input type="radio" id="waterlevel2" name="waterlevel" value="Medium" checked={waterlevel === 'Medium'} onChange={() => setWaterlevel('Medium')} />
        <label htmlFor="waterlevel2">Medium</label><br />
        <input type="radio" id="waterlevel3" name="waterlevel" value="High" checked={waterlevel === 'High'} onChange={() => setWaterlevel('High')} />
        <label htmlFor="waterlevel3">High</label><br /><br />

        <label htmlFor="location">Location:</label>
        <input type="text" id="location" name="location" value={location} onChange={(e) => setLocation(e.target.value)} required /><br /><br />

        <button onClick={handleSubmit}>Submit</button>
      </div>
      <div>{message}</div>
    </div>
  );
}

export default Form;
