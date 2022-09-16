import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

function TermCreate() {
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

    const start=new Date(data.startDate);
    const end=new Date(data.endDate);
    if(start.getTime()>end.getTime())
    {
      return setUserError("End date must be Greater");
    }
    

    axios.post("http://localhost:5000/admin/add-term",data,headers).then(res=>
    {
      if(res.data.success==true)
      {
        navigate("/term/show");
      }
      else
      {
        setUserError("Term Name Already Exists");
      }
    }
    ).catch(res=>
    {
      setUserError("Cannot connect to server");
    });
  }


  return (
    <div className='batch-create'>
      <h1 className='batch-create__title'>Create Term</h1>
      <form className='batch-create__form' onSubmit={handleSubmit(onSubmit)}>
        <input className='batch-create__form__input'  name="termName" placeholder='Term Name' {...register('termName',  { required: true })} />
        {errors.termName && errors.termName.type=="required" && <p className=''>Term Name cannot be empty</p>}
        
        <div className='batch-create__form__date' >
          <span className='batch-create__form__date__label'>Start Date</span>
          <input className='batch-create__form__date__input' type="date" name="startDate" {...register('startDate',  { required: true})} />
          {errors.startDate && errors.startDate.type=="required" && <p className=''>Start Date cannot be empty</p>}
        </div>

        <div className='batch-create__form__date' >
          <span className='batch-create__form__date__label'>End Date</span>
          <input className='batch-create__form__date__input' type="date" name="endDate" {...register('endDate',  { required: true})} />
          {errors.endDate && errors.endDate.type=="required" && <p className=''>End Date cannot be empty</p>}
        </div>
        <input className='batch-create__form__submit' type="submit" value="Create" />
      </form>
      <p className='login__error'>{userError}</p>
    </div>
  )
}

export default TermCreate;