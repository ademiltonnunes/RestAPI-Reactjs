import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formIsValid = true;
    let errors = {};

    if (!username) {
      formIsValid = false;
      errors["username"] = "Please enter your username.";
    }

    if (!password) {
      formIsValid = false;
      errors["password"] = "Please enter your password.";
    }

    setErrors(errors);
    return formIsValid;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      onLogin(username, password);
    }
  };

  return (
    <div className="login-container">
        <div className="login-form" >
            <h2>3S ADMIN LOGIN</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
 
                    <input
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={errors.username ? "error" : ""}
                    />
                    {errors.username && <div className="error-message">{errors.username}</div>}
                </div>
                <div className="input-group">
                    <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? "error" : ""}
                    />
                    {errors.password && <div className="error-message">{errors.password}</div>}
                </div>
                <button className="login-button" type="submit">Login</button>
            </form>
        </div>
    </div>
  );
};

export default Login;
