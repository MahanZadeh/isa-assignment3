import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { apiLogin } from '../api/pokeAPI';
import { apiGetAuthUser } from "../api/pokeAPI";
import '../styles/signUp.css';


function AdminLogin() {

  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
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

    if (!error && resData && resData.isAdmin) {
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

  const getCurrentUser = async () => {
    var { data } = await apiGetAuthUser();
    console.log(data);
    var adminGuy = data.data.is_admin;

    if (adminGuy === 'true') {
      console.log("I am true");
      navigate("/admin");
    } else {
      console.log("I am false ");
    }
  };

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  useEffect(() => { }, [
    data.username,
    data.password,
  ]);

  useEffect(() => {
    getCurrentUser()
  }, []);

  return (
    <div style={{ textAlign: 'center' }} className="signup-container">
      <form onSubmit={handleSubmit} className='signup-form'>
        <span> Admin Login </span>
        <br />
        <input
          type="text"
          name="username"
          placeholder="username"
          onChange={changeHandler}
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="password"
          onChange={changeHandler}
        />
        <br />
        <button type="submit" className="signup-button">
          Login
        </button>
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

export default AdminLogin;