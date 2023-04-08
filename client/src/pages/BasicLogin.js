import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { apiLogin } from '../api/pokeAPI';
import '../styles/signUp.css';

function BasicLogin() {

  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState({
    username: location.state?.username || "",
    password: ""
  });

  const [credentialError, setCredentialError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    checkUser();
  };
  const [showPopup, setShowPopup] = useState(false);

  const checkUser = async () => {
    const { error, data: resData } = await apiLogin(data);

    if (!error && resData) {
      console.log(resData);
      setCredentialError(false);
      navigate("/");
    } else {
      setCredentialError(true);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
      console.log("login failed");
    }
  };

  // const checkUser = async () => {
  //   const { error, data: resData } = await apiLogin(data);

  //   if (!error && resData && resData.isAdmin) {
  //     console.log(resData);
  //     setCredentialError(false);
  //     navigate("/admin");
  //   } else {
  //     setCredentialError(true);
  //     setShowPopup(true);
  //     setTimeout(() => {
  //       setShowPopup(false);
  //     }, 3000);
  //     console.log("login failed");
  //   }
  // };


  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  useEffect(() => { }, [
    data.username,
    data.password,
  ]);
  const redirectToSignup = () => {
    navigate("/signup");
  };

  const redirectToAdminLogin = () => {
    navigate("/adminlogin");
  };
  return (
    <div className="signup-container">

      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Login</h2>
        <input
          type="text"
          name="username"
          placeholder="username"
          value={data.username}
          onChange={changeHandler}
          className="signup-input"
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          onChange={changeHandler}
          className="signup-input"
        />
        <button type="submit" className="signup-button">
          Login
        </button>
        <div className="button-container">
          <button onClick={redirectToSignup} className="signup-button">
            Sign Up
          </button>
          <button onClick={redirectToAdminLogin} className="signup-button">
            Admin Login
          </button>
        </div>
      </form>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h1 className="error-message">Invalid Credentials!</h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicLogin;
