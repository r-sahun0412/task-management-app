import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/Register.css'; // Import the CSS file

const Register = () => {
  const [formData, setFormData] = useState({
    UserId: '',
    UserName: '',
    Password: '',
    Email: '',
    Mobile: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:2700/registeruser', formData)
      .then(response => {
        setMessage(response.data);
        alert('User registered successfully');
        navigate('/login'); // Redirect to the login page after successful registration
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          setMessage(error.response.data);
        } else {
          setMessage('There was an error!');
        }
      });
  };

  return (
    <div className="register-container">
      <h1 className="register-header">User Registration</h1>
      {message && <p className="register-message">{message}</p>}
      <form className="register-form" onSubmit={handleSubmit}>
        <label className="register-label">User ID:</label>
        <input className="register-input" type="text" name="UserId" value={formData.UserId} onChange={handleChange} required />
        <br />

        <label className="register-label">User Name:</label>
        <input className="register-input" type="text" name="UserName" value={formData.UserName} onChange={handleChange} required />
        <br />

        <label className="register-label">Password:</label>
        <input className="register-input" type="password" name="Password" value={formData.Password} onChange={handleChange} required />
        <br />

        <label className="register-label">Email:</label>
        <input className="register-input" type="email" name="Email" value={formData.Email} onChange={handleChange} required />
        <br />

        <label className="register-label">Mobile:</label>
        <input className="register-input" type="tel" name="Mobile" value={formData.Mobile} onChange={handleChange} required />
        <br />

        <button className="register-button" type="submit" style={{marginTop:"10px"}}>Register</button>

        <div className="signin-link">
        <p>Already registered?</p>
        <button className="signin-button" onClick={() => navigate('/login')}>
          Sign In
        </button>
      </div>
      </form>
      
    </div>
  );
};

export default Register;
