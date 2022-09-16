import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate,useParams  } from 'react-router-dom';

import './style/batchAddTrainee.css';

function BatchAddTrainee() {
  let { id } = useParams();
  const headers={"Content-Type":"multipart/form-data","Authorization":"Bearer "+localStorage.getItem("access_token")};
  const [allBatch,setAllBatch]=useState();
  const [allTrainee,setAllTrainee]=useState();
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
    axios.get("http://localhost:5000/admin/view-single-batch/"+id).then(res=>
      {
        if(res.data.success==true)
        {
          setAllBatch(res.data.data);
          axios.get("http://localhost:5000/admin/view-batch-trainee/"+id).then(res=>
          {
            if(res.data.success==true)
            {
                setAllTrainee(res.data.data);
            }
          }).catch(res=> setUserError("Cannot connect to server"));;
        }
        else if(res.data.success==false)
        {
          setUserError("Server request is not allowed");
        }
    }).catch(res=> setUserError("Cannot connect to server"));
    },[]);


  const addTrainee=(e)=>
  {
    const data={}
    data.batchName=allBatch.batch.batchName;
    data.traineeId=e.target.value;
    axios.post("http://localhost:5000/admin/add-trainee",data,headers).then(res=>
      {
        if(res.data.success==true)
        {
          axios.get("http://localhost:5000/admin/view-batch-trainee/"+id).then(res=>
            {
              if(res.data.success==true)
              {
                setAllTrainee(res.data.data);
              }
              else if(res.data.success==false)
              {
                setUserError("Server request is not allowed");
              }
          }).catch(res=> setUserError("Cannot connect to server"));
        }
        else
        {
          setUserError("Invalid User");
        }
      });
    
  }

  return (
    <div className='batch-add-trainee'>
      {allBatch?
        <>
          <Link className='batch-add-trainee__name' to={"/batch/trainee/"+allBatch.batch._id}> <h1>{allBatch.batch.batchName}</h1> </Link>
          <p className='batch-add-trainee__start-date' ><b>Start Date: </b>{allBatch.batch.batchDate}</p>
          {allTrainee && allTrainee.allUser.length>0?allTrainee.allUser.map(trainee=>
          {
            return<div className='batch-add-trainee__trainee'>
                <h3 className='batch-add-trainee__trainee__name'>{trainee.firstName} {trainee.lastName}</h3>
                <p className='batch-add-trainee__trainee__email'><b>Email: </b> {trainee.email}</p>
                <button className='batch-add-trainee__trainee__single' value={trainee._id} onClick={addTrainee} >Add</button>
            </div>
          }):<h1>No Trainee Found</h1>}
        </>
        :""}
      <p className='login__error'>{userError}</p>
    </div>
  )
}

export default BatchAddTrainee;