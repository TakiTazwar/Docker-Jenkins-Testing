import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import UserTypeValue from "../../../services/contextApi/ThemeContext";
import './style/login.css';

function Login() {
  const value=useContext(UserTypeValue);
  const [userError,setUserError]=useState();
  const headers={"Content-Type":"application/json"};
  const navigate=useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm( {
    mode: "onChange"
  });

  const  onSubmit = async (data) => {
      axios.post("http://localhost:5000/user/login",data,headers).then(res=>
      {
        if(res.data.success==true)
        {
          localStorage.setItem('access_token', res.data.data.access_token);
          if(res.data.data.userType=="trainee")
          {
            value.setUserHeader("trainee");
            navigate("/trainee");
          }
          else if(res.data.data.userType=="trainer")
          {
            value.setUserHeader("trainer");
            navigate("/trainer");
          }
          else if(res.data.data.userType=="admin")
          {
            value.setUserHeader("admin");
            navigate("/admin");
          }
          else
          {
            setUserError("No User Found");
          }
        }
        else
        {
          setUserError("Invalid User");
        }
      }
      ).catch(res=>
      {
        setUserError("Cannot connect to server");
      });
  }

  return (
    <div className='login'>
      <form className='login__form' onSubmit={handleSubmit(onSubmit)}>
        <input className='login__form__input login__form__input--first'  name="email" placeholder='Email' {...register('email',  { required: true , pattern:/[\w-]+@([\w-]+\.)+[\w-]+/})} />
        {errors.email && errors.email.type=="pattern"&& <p className='login__form__error-show'>Enter a valid Email</p>}
        {errors.email && errors.email.type=="required" && <p className='login__form__error-show'>Email cannot be empty</p>}
        
        <input className='login__form__input' type="password" name="password" placeholder='Password' {...register('password',  { required: true})} />
        {errors.password && errors.password.  type=="required" && <p className='login__form__error-show'>Password cannot be empty</p>}

        <input className='login__form__input login__form__input--button' type="submit" value="Login" />
      </form>
      <Link className='login__reset-password' to={"/resetpasswordmail"}>Reset Password</Link>
      <p className='login__error'>{userError}</p>
    </div>
  )
}

export default Login;