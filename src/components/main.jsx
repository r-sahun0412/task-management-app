
import task from "../image/task.webp";
import { Link } from "react-router-dom";

const Main = () => {

    return(
        <div className="text-center ">
           <figure>
           <img src={task} className="img-fluid bg-transparent mt-5"  alt="" />
           </figure>

           <div>
           <Link to="/login" className='btn bg-completed'>User Sign in</Link>

           </div>
        </div>
    )
};

export default Main;