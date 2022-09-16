import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import './style/batchCreate.css';

function BatchCreate() {
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
    axios.post("http://localhost:5000/admin/add-batch",data,headers).then(res=>
    {
      if(res.data.success==true)
      {
        navigate("/batch/show");
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
    <div className='batch-create'>
      <h1 className='batch-create__title'>Create Batch</h1>
      <form  className='batch-create__form' onSubmit={handleSubmit(onSubmit)}>
        <input className='batch-create__form__input'  name="batchName" placeholder='Batch Name' {...register('batchName',  { required: true })} />
        {errors.batchName && errors.batchName.type=="required" && <p className=''>Batch Name cannot be empty</p>}
        
        <div className='batch-create__form__date' >
          <span className='batch-create__form__date__label'>Start Date</span>
          <input className='batch-create__form__date__input' type="date" name="batchDate" {...register('batchDate',  { required: true})} />
          {errors.batchDate && errors.batchDate.type=="required" && <p className=''>Batch Date cannot be empty</p>}
        </div>

        <input className='batch-create__form__submit' type="submit" value="Create" />
      </form>
      <p className='login__error'>{userError}</p>
    </div>
  )
}

export default BatchCreate;