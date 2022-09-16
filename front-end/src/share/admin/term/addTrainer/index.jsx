import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate,useParams  } from 'react-router-dom';

import './style/addTermTrainer.css';

function AddTermTrainer() {
  let { id,courseid } = useParams();
  const headers={"Content-Type":"application/json"};
  const [allTrainer,setAllTrainer]=useState();
  const [userError,setUserError]=useState();
  const navigate=useNavigate();
  const firstUpdate = useRef(true);
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
      console.log(courseid);
    axios.get("http://localhost:5000/admin/view-term-trainer/"+courseid).then(res=>
      {
        if(res.data.success==true)
        {
          setAllTrainer(res.data.data);
        }
        else if(res.data.success==false)
        {
          setUserError("Server request is not allowed");
        }
    }).catch(res=> setUserError("Cannot connect to server"));
    },[]);

    const addTrainer=(trainerId)=>
    {
        const data={}
        data.trainerId=trainerId;
        data.id=id;
        console.log(trainerId);
        axios.post("http://localhost:5000/admin/term/add-trainer",data,headers).then(res=>
        {
          if(res.data.success==true)
          {
            navigate("/term/single/"+id);
          }
          else
          {
            setUserError("Data Couldn't be Added");
          }
        }).catch(res=>
            {
                setUserError("Cannot Connect to server");
            });
    }


  return (
    <div className='add-term-trainer'>
    {allTrainer && (allTrainer.trainer.length>0)?allTrainer.trainer.map(person=>{
      return(
        <div className='add-term-trainer__trainer'>
          <p className='add-term-trainer__trainer__title'>{person.firstName} {person.lastName}</p>
          <p className='add-term-trainer__trainer__item'><b>Email: </b>{person.email}</p>
          <div className='add-term-trainer__trainer__topic'>
          {person.courseTopics.map(topic=>
            {
              return(
              
                <p className='add-term-trainer__trainer__topic__item'>{topic.topics}</p>
              
              )
            }
          )}
          </div>
          <button className='add-term-trainer__trainer__button' onClick={()=>addTrainer(person._id)}>Add Trainer</button>
        </div>
      )
    }):<h1 className='add-term-trainer__trainer__title'>Trainers doesn't match this course expertise  </h1>}
    <p className='login__error'>{userError}</p>
    {allTrainer?console.log(allTrainer):""}
    </div>
  )
}

export default AddTermTrainer;