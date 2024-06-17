import React, { useState } from 'react';
import { Box, Grid, Button } from '@mui/material'; // Remove TextField import
import { toast } from 'react-toastify';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import '../style/taskInput.css';

const TaskInput = ({ LoadTask }) => {
  const [newTask, setNewTask] = useState({
    TaskName: "",
    TaskDescription: "",
  });
  const [cookies] = useCookies(["user-id", "token"]);

  function handleAddTask() {
    if (newTask.TaskName.trim() === "" || newTask.TaskDescription.trim() === "") {
      toast.error("Both task name and description are required.");
      return;
    }

    axios
      .post("http://127.0.0.1:2700/addtask", newTask, {
        headers: {
          Authorization: `Bearer ${cookies["token"]}`,
        },
      })
      .then(() => {
        console.log("Task Added Successfully");
        toast.success("Task added successfully!");
        LoadTask();
        setNewTask({
          TaskName: "",
          TaskDescription: "",
        });
      })
      .catch((error) => {
        console.log("Error in Adding Task.", error);
        if (error.response && error.response.status === 403) {
          toast.error("You are not authorized to add a task.");
        } else {
          toast.error("Error adding task.");
        }
      });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  return (
    <Box className="update-task-container">
    
      <form>
        <label htmlFor="TaskName">Task Name</label>
        <input
          type="text"
          id="TaskName"
          name="TaskName"
          value={newTask.TaskName}
          onChange={handleInputChange}
          className="custom-input"
        />

        <label htmlFor="TaskDescription">Task Description</label>
        <textarea
          id="TaskDescription"
          name="TaskDescription"
          value={newTask.TaskDescription}
          onChange={handleInputChange}
          className="custom-textarea"
          rows={4} // Adjust rows as per your design
        />

        <Button 
          variant="contained"
          color="primary"
          onClick={handleAddTask}
          className="custom-button"
        >
          Add Task
        </Button>
      </form>
    </Box>
  );
};

export default TaskInput;
