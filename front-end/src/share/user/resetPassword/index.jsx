import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {  useNavigate,useParams} from 'react-router-dom';
import './style/resetpassword.css';

function ResetPassword() {
  const [userError,setUserError]=useState();
  const headers={"Content-Type":"application/json"};
  const navigate=useNavigate();
  const { userid } = useParams();
  const { token } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm( {
    mode: "onChange"
  });

  const  onSubmit = async (data) => {
    data.userId=userid;
    data.resetToken=token;
    console.log(data);
    axios.post("http://localhost:5000/user/reset-password",data,headers).then(res=>
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
    <div className='reset-container'>
      <h1 className='reset-container__title'>Reset Password</h1>
        <form className='reset-container__form' onSubmit={handleSubmit(onSubmit)}>
          <input className='reset-container__form__input reset-container__form__input--first' type="password" name="password" placeholder='Password' {...register('password',  { required: true,pattern:/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/})} />
          {errors.password && errors.password.type=="pattern" && <p className='reset-container__form__error-show'>Password should contain atleast one number and one special character Min length 6</p>}
          {errors.password && errors.password.type=="required" && <p className='reset-container__form__error-show'>Password cannot be empty</p>}

          <input className='reset-container__form__input' type="password" name="confirm_password" placeholder='Confirm Password'
            {...register("confirm_password", {
              required: true,
              validate: (val) => {
                if (watch('password') != val) {
                  return false;
                }
              },
            })}
          />
          {errors.confirm_password && errors.confirm_password.type=="validate"&& <p className='reset-container__form__error-show'>Your passwords do no match</p>}
          {errors.confirm_password && errors.confirm_password.type=="required" && <p className='reset-container__form__error-show'>Confirm Password Cannot be Empty</p>}
          
          <input className='reset-container__form__button' value="Reset" type="submit" />
        </form>
        <p className='reset-container__error'>{userError}</p>
    </div>
  )
}

export default ResetPassword;