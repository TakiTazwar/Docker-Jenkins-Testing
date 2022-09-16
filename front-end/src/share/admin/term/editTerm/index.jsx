import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate,useParams } from 'react-router-dom';

function TermEdit() {
  const [userError,setUserError]=useState();
  const [allTerm,setAllTerm]=useState();
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
    axios.get("http://localhost:5000/admin/view-single-term/"+id).then(res=>
      {
        if(res.data.success==true)
        {
          setAllTerm(res.data.data);
        }
        else if(res.data.success==false)
        {
          setUserError("Server request is not allowed");
        }
    }).catch(res=> setUserError("Cannot connect to server"));
    },[]);

  const  onSubmit = async (data) => {
    data.id=allTerm.term._id;
    axios.put("http://localhost:5000/admin/edit-term",data,headers).then(res=>
    {
      if(res.data.success==true)
      {
        navigate("/term/show");
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
      <h1 className='batch-create__title'>Edit Term</h1>
      <form className='batch-create__form' onSubmit={handleSubmit(onSubmit)}>
          <input className='batch-create__form__input' defaultValue={allTerm?allTerm.term.termName:""} name="termName" placeholder='Term Name' {...register('termName')} />
          
          

          
          <div className='batch-create__form__date' >
            <span className='batch-create__form__date__label'>Start Date</span>
            <input className='batch-create__form__date__input' type="date" defaultValue={allTerm?allTerm.term.startDate:""} name="startDate" {...register('startDate')} />
          </div>

          <div className='batch-create__form__date' >
            <span className='batch-create__form__date__label'>End Date</span>
            <input className='batch-create__form__date__input' type="date" defaultValue={allTerm?allTerm.term.endDate:""} name="endDate" {...register('endDate')} />
          </div>
          <input className='batch-create__form__submit' type="submit" value="Edit" />
      </form>
      <p className='login__error'>{userError}</p>
    </div>
  )
}

export default TermEdit;