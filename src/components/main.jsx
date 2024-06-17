
import task from "../image/task.webp";
import { Link } from "react-router-dom";

const Main = () => {

    return(
        <div className="text-center ">
           <figure>
           <img src={task} className="img-fluid bg-transparent mt-5"  alt="" />
           </figure>

           <div>
           <Link to="/login" className='signin-button' style={{margin:"5px"}}>User Sign in</Link>

           <Link to="/register" className="register-button">Register</Link>

           </div>
        </div>
    )
};

export default Main;