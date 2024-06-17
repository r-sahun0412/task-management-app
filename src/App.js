import React from 'react';
import { BrowserRouter, Link, Route, Routes, useNavigate } from 'react-router-dom';
import { Grid, Button, Typography } from '@mui/material';
import TaskManagement from './components/todo';
import { UserLogin } from './components/login';
import Main from './components/main';
import Register from './components/register';
import UpdateTask from './components/updateTask';
import { useCookies } from 'react-cookie';
import './style/App.css';

const App = () => {
  const [cookies, , removeCookie] = useCookies(["user-id", "token"]);
  const navigate = useNavigate();

  const handleSignout = () => {
    removeCookie("user-id");
    removeCookie("token");
    navigate("/login");
  };

  return (
    <div className="App">
      <header className="app-header">
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <h1 className="app-title">
              <Link to="/" className="app-title-link">TaskMaster</Link>
            </h1>
          </Grid>
          <Grid item>
            <nav className="app-nav">
              {cookies['user-id'] === undefined ? (
                <>
                  <Link to="/login" className="btn">User Sign in</Link>
                  <Link to="/register" className="btn ms-4">Register</Link>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" style={{ fontWeight: 'bold', textTransform: 'uppercase', marginRight: '1rem' }}>
                    {cookies['user-id']}
                  </Typography>
                  <Button className="btn" onClick={handleSignout}>Signout</Button>
                </div>
              )}
            </nav>
          </Grid>
        </Grid>
      </header>
      <main className="app-main" style={
        {
          marginTop:"50px"
        }
      }>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/taskmanager" element={<TaskManagement />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/updatetask/:id" element={<UpdateTask />} />
        </Routes>
      </main>
    </div>
  );
};

const AppWrapper = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

export default AppWrapper;
