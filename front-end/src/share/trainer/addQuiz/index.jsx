import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate,useParams } from 'react-router-dom';


function AddQuiz() {
  let { termId } = useParams();
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
    data.termId=termId;
    axios.post("http://localhost:5000/trainer/add-quiz",data,headers).then(res=>
    {
      if(res.data.success==true)
      {
        navigate("/trainer/quizes/"+termId);
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
      <h1 className='course-create__title'>Create Quiz</h1>
      <form className='course-create__form' onSubmit={handleSubmit(onSubmit)}>
        <input className='course-create__form__input'  name="quizName" placeholder='Quiz Name' {...register('quizName',  { required: true })} />
        {errors.courseName && errors.courseName.type=="required" && <p className=''>Quiz Name Name cannot be empty</p>}
        
        <input className='course-create__form__input' name="quizName" placeholder='Quiz Details' {...register('quizDetails',  { required: true})} />
        {errors.courseDetails && errors.courseDetails.type=="required" && <p className=''>Quiz Details cannot be empty</p>}

        <input className='course-create__form__submit' type="submit" value="Create" />
      </form>
      <p className='login__error'>{userError}</p>
    </div>
  )
}

export default AddQuiz;