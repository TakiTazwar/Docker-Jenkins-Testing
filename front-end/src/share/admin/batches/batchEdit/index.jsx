import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate,useParams } from 'react-router-dom';

import './style/batchEdit.css';

function BatchEdit() {
  const [userError,setUserError]=useState();
  const [allBatch,setAllBatch]=useState();
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
    axios.get("http://localhost:5000/admin/view-single-batch/"+id).then(res=>
      {
        if(res.data.success==true)
        {
          setAllBatch(res.data.data);
        }
        else if(res.data.success==false)
        {
          setUserError("Server request is not allowed");
        }
    }).catch(res=> setUserError("Cannot connect to server"));
    },[]);

  const  onSubmit = async (data) => {
    data.id=allBatch.batch._id;
    axios.put("http://localhost:5000/admin/edit-batch",data,headers).then(res=>
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
    <div className='batch-edit'>
      <h1 className='batch-edit__title'>Edit Batch</h1>
        {allBatch?console.log(allBatch.course):""}
      <form className='batch-edit__form' onSubmit={handleSubmit(onSubmit)}>
        <input className='batch-edit__form__input' defaultValue={allBatch?allBatch.batch.batchName:""} name="batchName" placeholder='Batch Name' {...register('batchName')} />
        
        <div className='batch-edit__form__date' >
          <span className='batch-edit__form__date__label'>Start Date</span>
          <input className='batch-edit__form__date__input' type="date" defaultValue={allBatch?allBatch.batch.batchDate:""} name="batchDate" {...register('batchDate')} />
        </div>

        <input className='batch-edit__form__submit' type="submit" value="Edit" />
      </form>
      <p className='login__error'>{userError}</p>
    </div>
  )
}

export default BatchEdit;