import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import tasklist from "../image/tasklist.png";

import axios from "axios";

import "./style.css";

import { useCookies } from "react-cookie";
import {  useNavigate } from "react-router-dom";

const TaskManagement = () => {
  
  
  // State variables
  
  const [getTask, setTask] = useState([]);
  
  const [newTask, setNewTask] = useState({
    TaskName: "",
    TaskDescription: "",
  });
  
  const [editingTask, setEditingTask] = useState(null);

  const  [cookies, setCookie, removeCookie] = useCookies();

  const navigate = useNavigate();
  
  // Fetch tasks on component load
  
  useEffect(() => {
    if(cookies["user-id"]==undefined){
      navigate("/login");
    }
    else{
      LoadTask();
    }
  }, []);




 
 
  // Fetch all tasks from the server
  
  function LoadTask() {
    axios
      .get("http://127.0.0.1:2700/task")
      .then((response) => {
        setTask(response.data);
      })
      .catch((error) => {
        console.log("Error in Fetching All Tasks.", error);
      });
  }

  
  
  // Add a new task
  
  function handleAddTask() {
    axios
      .post("http://127.0.0.1:2700/addtask", newTask)
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
      });
  }

  
  
  // Edit an existing task
  
  
  function handleEditTask(task) {
    setEditingTask(task);
    setNewTask({
      TaskName: task.TaskName,
      TaskDescription: task.TaskDescription,
    });
  }

  
  
  // Update a task
  
  function handleUpdateTask() {
    axios
      .put(`http://127.0.0.1:2700/updatetask/${editingTask._id}`, newTask)
      .then(() => {
        console.log("Task Updated Successfully");
        toast.success("Task updated successfully!");
        LoadTask();
        setEditingTask(null);
        setNewTask({
          TaskName: "",
          TaskDescription: "",
        });
      })
      .catch((error) => {
        console.log("Error in Updating Task.", error);
      });
  }

 
 
  // Delete a task
  
  function handleDeleteTask(taskId) {
    console.log("Deleting task with ID:", taskId);
    axios
      .delete(`http://127.0.0.1:2700/deletetask/${taskId}`)
      .then(() => {
        console.log("Task Deleted Successfully");
        toast.success("Task deleted successfully!");
        LoadTask();
      })
      .catch((error) => {
        console.log("Error in Deleting Task.", error);
        toast.error("Error deleting task.");
      });
  }

  
  
  // Toggle task completion status
  
  function handleTaskCheckBoxChange(taskId) {
    const updatedTasks = getTask.map((task) => {
      if (task._id === taskId) {
        const updatedTask = { ...task, completed: !task.completed };
        axios
          .put(
            `http://127.0.0.1:2700/${
              updatedTask.completed ? "markcompleted" : "markincomplete"
            }/${task._id}`
          )
          .then(() => {
            console.log(
              `Task ${
                updatedTask.completed ? "marked as completed" : "marked as incomplete"
              } in the database.`
            );
          })
          .catch((error) => {
            console.log("Error in marking task as completed/incomplete.", error);
          });
        return updatedTask;
      }
      return task;
    });

    setTask(updatedTasks);
  }

  return (
    
    <div className="container">
      
      <ToastContainer />
      <div className="task">
        <h2>
          <img
            src={tasklist}
            className="img-fluid"
            width={50}
            height={50}
            alt="tasklist-img"
          />
          Task Manager
        </h2>
        
        
        <div className="taskadd">
          
          {/* Input fields for adding a new task */}
          
          <input
            type="text"
            className="add-task form-control input-group mb-5"
            id="add"
            placeholder="Add Your Task"
            autoFocus
            value={newTask.TaskName}
            onChange={(e) =>
              setNewTask({ ...newTask, TaskName: e.target.value })
            }
          />
          <input
            type="text"
            className="add-task form-control"
            id="add-description"
            placeholder="Add Task Description"
            value={newTask.TaskDescription}
            onChange={(e) =>
              setNewTask({ ...newTask, TaskDescription: e.target.value })
            }
          />
          <div className="d-flex justify-content-center mt-3">
            {editingTask ? (
              <button className="btnTask " onClick={handleUpdateTask}>
                Update Task
              </button>
            ) : (
              <button className="btnTask" onClick={handleAddTask}>
                Add Task
              </button>
            )}
          </div>
        </div>

        
        
        {/* Task Card */}
        
        
        <div className="card-container d-flex justify-content-around flex-wrap">
          {getTask.map((task) => (
            <div
              className={`card m-5 w-lg-25 ${
                task.completed ? "bg-completed" : "bg-incomplete"
              }`}
              key={task._id}
            >
              <div className="card-header">
                <input
                  type="checkbox"
                  id={`task-${task._id}`}
                  className="custom-checkbox me-2 text-center"
                  checked={task.completed}
                  onChange={() => handleTaskCheckBoxChange(task._id)}
                />
                {task.TaskName}
              </div>
              <div className="card-body h-100">
                <p className="card-text">{task.TaskDescription}</p>
              </div>
              <div className="card-footer m-2 p-2 d-flex justify-content-between">
                <button
                  className="btn btn-outline-success text-black  bg-completed me-2"
                  onClick={() => handleEditTask(task)}
                >
                 <i class="fas fa-edit"></i>
                </button>
                <button
                  className="btn btn-outline-danger text-black bg-incomplete"
                  onClick={() => handleDeleteTask(task._id)}
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default TaskManagement;
