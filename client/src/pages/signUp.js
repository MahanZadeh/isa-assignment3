import React, { useState, useEffect } from 'react';
import { apiSignup } from '../api/pokeAPI';
import '../styles/signUp.css';
import { useNavigate  } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    password: "",
    email: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await apiSignup(data);
    console.log(response);
    if (response && response.status === 200) {

      navigate("/login", { state: { username: data.username } });
    }
  };

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  useEffect(() => { }, [
    data.username,
    data.password,
    data.email
  ]);

  console.log(data);

  return (
    <div className="signup-container">

      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Signup</h2>
        <input
          type="text"
          name="username"
          placeholder="username"
          onChange={changeHandler}
          className="signup-input"
        />
        <input
          type="text"
          name="email"
          placeholder="email"
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
          Signup
        </button>
      </form>

    </div>
  );
}

export default Signup;
