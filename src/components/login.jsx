import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import "./style.css"



export function UserLogin({ onLogin, onSetUserName }) {
    
    
    const [getUser, setUser] = useState({ UserId: "", Password: "" });
    const [getError, setError] = useState("");
    const navigate = useNavigate();
    const  [cookies, setCookie, removeCookie] = useCookies([`user-id`]);



    function handleIdChange(e) {
        setUser({
            UserId: e.target.value,
            Password: getUser.Password
        });
    }

    function handlePwdChange(e) {
        setUser({
            UserId: getUser.UserId,
            Password: e.target.value
        });
    }

   // Inside UserLogin component
   function handleSubmit(e) {
    e.preventDefault();
    axios({
      method: "get",
      url: "http://127.0.0.1:2700/users",
    })
      .then((response) => {
        for (var user of response.data) {
          if (
            user.UserId === getUser.UserId &&
            user.Password === getUser.Password
          ) {

            setCookie("user-id", getUser.UserId);
            // onLogin(true); // Call the prop function to update isLoggedIn
            // onSetUserName(user.UserName); // Call the prop function to update userName
            navigate("/taskmanager");
            break;
          } else {
            setError("Invalid Credentials");
          }
        }
      });
    }
  

    return (
        <div className="d-flex justify-content-center align-content-center mt-5 ">
            <div className="p-4 m-2 border border-3 border-dark rounded-5" style={{width:440}}>
                <h2 className="text-center fw-bold"> User Login</h2>
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="UserId" className="form-label">User Id</label>
                            <input
                                type="text"
                                className="form-control"
                                id="UserId"
                                onChange={handleIdChange}
                                value={getUser.UserId}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                onChange={handlePwdChange}
                                value={getUser.Password}
                            />
                        </div>
                        <button type="submit" className="btn bg-completed w-100">Login</button>
                        <div className="text-center mt-4">
                            <p><b><i>For Logging In <br /> UserId : john_wick <br /> Password: john@123</i></b></p>
                        </div>
                        <p className="text-center text-danger mt-4 fw-bold">{getError}</p>
                    </form>
                </div>
            </div>
        </div>
    );
}
