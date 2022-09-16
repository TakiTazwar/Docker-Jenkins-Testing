import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import './style/courseCreate.css';

function CourseCreate() {
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
    console.log(data);
    axios.post("http://localhost:5000/admin/add-course",data,headers).then(res=>
    {
      if(res.data.success==true)
      {
        navigate("/courses/show");
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
    <div className='course-create'>
      <h1 className='course-create__title'>Create Course</h1>
      <form className='course-create__form' onSubmit={handleSubmit(onSubmit)}>
        <input className='course-create__form__input'  name="courseName" placeholder='Course Name' {...register('courseName',  { required: true })} />
        {errors.courseName && errors.courseName.type=="required" && <p className=''>Course Name cannot be empty</p>}
        
        <input className='course-create__form__input' name="courseDetails" placeholder='Course Details' {...register('courseDetails',  { required: true})} />
        {errors.courseDetails && errors.courseDetails.type=="required" && <p className=''>Course Details cannot be empty</p>}

        <input className='course-create__form__submit' type="submit" value="Create" />
      </form>
      <p className='login__error'>{userError}</p>
    </div>
  )
}

export default CourseCreate;