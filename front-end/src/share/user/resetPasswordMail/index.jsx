import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import './style/resetpassword.css';

function ResetPasswordMail() {
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
    axios.post("http://localhost:5000/user/reset-password-mail",data,headers).then(res=>
      {
        if(res.data.success==true)
        {
            navigate("/login");
        }
        else
        {
          setUserError("Server Error");
        }
      }
      ).catch(res=>
      {
        setUserError("Cannot connect to server");
      });
  }
    

  return (
    <div className='reset'>
        <form className='reset__form' onSubmit={handleSubmit(onSubmit)}>
            <input className='reset__form__email'  name="email" placeholder='Email' {...register('email',  { required: true , pattern:/[\w-]+@([\w-]+\.)+[\w-]+/})} />
            {errors.email && errors.email.type=="pattern"&& <p className='reset__form__error-show'>Enter a valid Email</p>}
            {errors.email && errors.email.type=="required" && <p className='login__form__error-show'>Email cannot be empty</p>}

            <input className='reset__form__button' value="Reset" type="submit" />
        </form>
        <p className='reset__error'>{userError}</p>
    </div>
  )
}

export default ResetPasswordMail;