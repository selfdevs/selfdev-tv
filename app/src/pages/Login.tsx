import React, { FormEventHandler } from 'react';
import { useNavigate } from 'react-router';
import { useOBS } from '../contexts/obs';

const Login = () => {
  const { connect } = useOBS();
  const navigate = useNavigate();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await connect(e.currentTarget.password.value);
      navigate('/mosaic');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="password" name="password" />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
