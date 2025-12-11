import { useState } from "react";
import "./userButton.css";
import ImageComponent from "../image/image";
import { Link, useNavigate } from "react-router";
import apiReq from "../../utils/apiReq";
import useAuthStore from "../../utils/authStore";

export default function UserButton() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  
  const { currentUser, removeCurrentUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      await apiReq.post("/users/auth/logout", {});
      removeCurrentUser();
      navigate("/auth");
    }catch (err) {
      console.log(err);
    }
  }

  return currentUser ? (
    <div className="userButton">
      <ImageComponent path={currentUser.img || "/general/noAvatar.png"} alt="" />
      <div onClick={() => setOpen((prev) => !prev)}>
        <ImageComponent path="/general/arrow.svg" alt="" className="arrow" />
      </div>
      {open && (
        <div className="userOptions">
          <Link to={`/profile/${currentUser.userName}`} className="userOption">Profile</Link>
          <div className="userOption">Setting</div>
          <div className="userOption" onClick={handleLogout}>Logout</div>
        </div>
      )}
    </div>
  ) : (
    <Link to="/auth" className="loginLink">
      Login / Sign Up
    </Link>
  );
}
