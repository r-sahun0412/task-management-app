import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import '../style/update.css';

function UpdateTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({
    TaskName: '',
    TaskDescription: ''
  });
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:2700/task/${id}`, {
          headers: {
            Authorization: `Bearer ${cookies.token}`
          }
        });
        setTask(response.data);
      } catch (error) {
        console.error('Error fetching task:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, cookies.token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await axios.put(`http://localhost:2700/updatetask/${id}`, task, {
        headers: {
          Authorization: `Bearer ${cookies.token}`
        }
      });
      navigate('/taskmanager');
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTask(prevTask => ({
      ...prevTask,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="update-task-container">
      <Typography variant="h4" component="h2" className="update-task-title">
        Update Task
      </Typography>
      <form onSubmit={handleSubmit} className="update-task-form">
        <label htmlFor="task-name">Task Name:</label>
        <input
          type="text"
          id="task-name"
          name="TaskName"
          value={task.TaskName}
          onChange={handleChange}
          className="custom-input"
        />
        <label htmlFor="task-description">Task Description:</label>
        <textarea
          id="task-description"
          name="TaskDescription"
          value={task.TaskDescription}
          onChange={handleChange}
          className="custom-textarea"
        ></textarea>
        <Button type="submit" variant="contained" color="primary" className="update-task-button">
          Update Task
        </Button>
        <Button
          sx={{marginTop:"10px"}}
          variant="contained"
          color="secondary"
          className="back-to-taskmanager-button"
          onClick={() => navigate('/taskmanager')}
        >
          Back to Task Manager
        </Button>
      </form>
    </Box>
  );
}

export default UpdateTask;
