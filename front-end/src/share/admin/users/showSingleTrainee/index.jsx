import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate,useParams } from 'react-router-dom';

import './style/showsingletrainee.css'

function ShowSingleTrainee() {
  const [userError,setUserError]=useState();
  const [allUsers,setAllUsers]=useState();
  const headers={"Content-Type":"multipart/form-data","Authorization":"Bearer "+localStorage.getItem("access_token")};
  let { id } = useParams();
  const firstUpdate = useRef(true);
  const navigate=useNavigate();
  useEffect(_=>{
    if (firstUpdate.current) {
        firstUpdate.current = false;
        return;
      }
    axios.get("http://localhost:5000/user/view-single-user/"+id,{headers:headers}).then(res=>
      {
        if(res.data.success==true)
        {
          setAllUsers(res.data.data);
        }
        else if(res.data.success==false)
        {
          setUserError("Server request is not allowed");
        }
    }).catch(res=> setUserError("Cannot connect to server"));
    },[]);


  return (
    <div className='show-single-user'>
        {allUsers?<div className='show-single-user__user'>
          <img alt='Profile Picture' className='show-single-user__user__image' src={"http://localhost:5000/"+allUsers.user.imageUrl}></img>
          <h1 className='show-single-user__user__name'>{allUsers.user.firstName} {allUsers.user.lastName}</h1>
          <p className='show-single-user__user__item'><b>Email: </b>{allUsers.user.email}</p>
          <p className='show-single-user__user__item'><b>Address: </b>{allUsers.user.address}</p>
          <p className='show-single-user__user__item'><b>Mobile: </b>{allUsers.user.mobile}</p>
          <p className='show-single-user__user__item'><b>National ID: </b>{allUsers.user.nationalId}</p>
        
        </div>:""}
      <p className='login__error'>{userError}</p>
    </div>
  )
}

export default ShowSingleTrainee;