import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import tasklist from "../image/tasklist.png";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Checkbox, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TaskInput from "../components/taskInput";
import '../style/taskInput.css';

const theme = createTheme({
  palette: {
    primary: {
      main: "#000080", // Dark blue
    },
    secondary: {
      main: "#d4d0c8", // Light gray
      contrastText: "#000000", // Black
    },
    taskCompleted: {
      main: "#a5d6a7", // Light green
      contrastText: "#1b5e20", // Dark green
    },
    taskIncomplete: {
      main: "#ef9a9a", // Light coral
      contrastText: "#b71c1c", // Dark red
    },
  },
});

const TaskManagement = () => {
  const [getTask, setTask] = useState([]);
  const [cookies] = useCookies(["user-id", "token"]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies["user-id"] || !cookies["token"]) {
      navigate("/login");
    } else {
      LoadTask();
    }
  }, [cookies, navigate]);

  useEffect(() => {
    console.log("Tasks in state:", getTask);
  }, [getTask]);

  function LoadTask() {
    axios
      .get("http://127.0.0.1:2700/task", {
        headers: {
          Authorization: `Bearer ${cookies["token"]}`,
        },
      })
      .then((response) => {
        console.log("Tasks fetched:", response.data);
        setTask(response.data);
      })
      .catch((error) => {
        console.log("Error in Fetching All Tasks.", error);
      });
  }

  function handleUpdateTask(taskId) {
    navigate(`/updatetask/${taskId}`);
  }

  function handleDeleteTask(taskId) {
    axios
      .delete(`http://127.0.0.1:2700/deletetask/${taskId}`, {
        headers: {
          Authorization: `Bearer ${cookies["token"]}`,
        },
      })
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

  function handleMarkCompleted(taskId, isCompleted) {
    const endpoint = isCompleted ? "markcompleted" : "markincomplete";
    axios
      .put(`http://127.0.0.1:2700/${endpoint}/${taskId}`, {}, {
        headers: {
          Authorization: `Bearer ${cookies["token"]}`,
        },
      })
      .then(() => {
        console.log("Task status updated successfully");
        toast.success("Task status updated successfully!");
        setTask(prevTasks => {
          return prevTasks.map(task => {
            if (task._id === taskId) {
              return { ...task, isCompleted: isCompleted };
            } else {
              return task;
            }
          });
        });
      })
      .catch((error) => {
        console.log("Error updating task status.", error);
        toast.error("Error updating task status.");
      });
  }

  return (
    <Box>
      <ToastContainer />
      <Box sx={{ textAlign: 'center', marginTop:"300px" }}>
        <Typography variant="h4" component="h2">
          <img
            src={tasklist}
            width={50}
            height={50}
            alt="tasklist-img"
            style={{ margin: 10 }}
          />
          Task Manager
        </Typography>
        <Box sx={{ m: 5 }}>
          <TaskInput LoadTask={LoadTask} />
        </Box>
      </Box>

      <ThemeProvider theme={theme}>
        <Box className="table-container">
          <TableContainer component={Paper} sx={{ 
            maxHeight: '500px', 
            overflowY: 'auto', 
            border: '2px solid black', 
            borderRadius: '10px',
             }}>
            <Table>
              <TableHead sx={{
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
                fontWeight: 'bold',
                zIndex: '100', // Ensure the TableHead is above TableBody
                position: 'sticky',
                top: 0,
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Add elevation
              }}>
                <TableRow className="table-header">
                  <TableCell>Status</TableCell>
                  <TableCell>Task Name</TableCell>
                  <TableCell>Task Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody >
                {getTask.map((task) => (
                  <TableRow key={task._id} className="table-row" sx={{
                    backgroundColor: task.isCompleted ? theme.palette.taskCompleted.main : theme.palette.taskIncomplete.main,
                    borderLeft: task.isCompleted ? `5px solid ${theme.palette.taskCompleted.contrastText}` : `5px solid ${theme.palette.taskIncomplete.contrastText}`,
                    '&:not(:last-child)': {
                      marginBottom: '10px', // Adjust space between rows
                    }
                  }}>
                    <TableCell className="table-cell">
                      <Checkbox
                        checked={task.isCompleted}
                        onChange={() => handleMarkCompleted(task._id, !task.isCompleted)}
                      />
                    </TableCell>
                    <TableCell className="table-cell">{task.TaskName}</TableCell>
                    <TableCell className="table-cell">{task.TaskDescription}</TableCell>
                    <TableCell className="table-cell table-cell-actions">
                      <IconButton className="icon-button" aria-label="update" onClick={() => handleUpdateTask(task._id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton className="icon-button" aria-label="delete" onClick={() => handleDeleteTask(task._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </ThemeProvider>
    </Box>
  );
};

export default TaskManagement;
