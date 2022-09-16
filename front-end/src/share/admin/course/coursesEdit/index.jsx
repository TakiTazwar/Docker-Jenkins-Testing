import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate,useParams } from 'react-router-dom';

function CourseEdit() {
  const [userError,setUserError]=useState();
  const [allCourse,setAllCourse]=useState();
  const headers={"Content-Type":"application/json"};
  let { id } = useParams();
  const firstUpdate = useRef(true);
  const navigate=useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm( {
    mode: "onChange"
  });

  useEffect(_=>{
    if (firstUpdate.current) {
        firstUpdate.current = false;
        return;
      }
    axios.get("http://localhost:5000/admin/view-single-course/"+id).then(res=>
      {
        if(res.data.success==true)
        {
          setAllCourse(res.data.data);
        }
        else if(res.data.success==false)
        {
          setUserError("Server request is not allowed");
        }
    }).catch(res=> setUserError("Cannot connect to server"));
    },[]);

  const  onSubmit = async (data) => {
    data.id=allCourse.course._id;
    axios.put("http://localhost:5000/admin/edit-course",data,headers).then(res=>
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
      <h1 className='course-create__title'>Edit Course</h1>
      <form className='course-create__form' onSubmit={handleSubmit(onSubmit)}>
        <input className='course-create__form__input' defaultValue={allCourse?allCourse.course.courseName:""} name="courseName" placeholder='Course Name' {...register('courseName')} />
        
        <input className='course-create__form__input' defaultValue={allCourse?allCourse.course.courseDetails:""} name="courseDetails" placeholder='Course Details' {...register('courseDetails')} />

        <input className='course-create__form__submit' type="submit" value="Edit" />
      </form>
      <p className='login__error'>{userError}</p>
    </div>
  )
}

export default CourseEdit;