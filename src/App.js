

import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import TaskManagement from './components/todo';
import { UserLogin } from './components/login';

import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import "./App.css";
import Main from './components/main';


function App() {

  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [userName, setUserName] = useState('');

  const [cookies, setCookie, removeCookie] = useCookies();

  const handleSignout = () => {
    removeCookie("user-id");
  };

  // const handleSignOut = () => {
  //   setIsLoggedIn(false);
  //   setUserName('');
  // }
  
  return (
    <div className="App">
      <BrowserRouter>
        <header className="head d-flex justify-content-between p-2">
          <div>
            <h2>
              <Link to="/" className="text-black text-decoration-none">
                TaskMaster
              </Link>
            </h2>
          </div>
          <div>
            {cookies['user-id'] === undefined ? (
              <Link to="/login" className='btn bg-completed'>User Sign in</Link>
            ) : (
              <div>
                {cookies['user-id']}
                <Link to="/login" onClick={handleSignout} className="btn bg-incomplete ms-4">Signout</Link>
              </div>
            )}
          </div>
        </header>
        
        <Routes>
          <Route path='/' element={<Main />}></Route>
          <Route path='/taskmanager' element={ <TaskManagement />}></Route>
          <Route path='/login' element={<UserLogin />} />
          
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
