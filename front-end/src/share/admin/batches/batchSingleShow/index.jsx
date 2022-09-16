import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate,useParams  } from 'react-router-dom';
import './style/showSingleBatch.css';

function BatchSingleShow() {
  let { id } = useParams();
  const headers={"Content-Type":"application/json"};
  const [allBatch,setAllBatch]=useState();
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
        }
        else if(res.data.success==false)
        {
          setUserError("Server request is not allowed");
        }
    }).catch(res=> setUserError("Cannot connect to server"));
    },[]);


  const deleteTrainee=(e)=>
  {
    axios.delete("http://localhost:5000/admin/delete-trainee/"+allBatch.batch.batchName+"/"+e.target.value).then(res=>
      {
        if(res.data.success==true)
        {
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
        }
        else
        {
          setUserError("Invalid User");
        }
      });
    
  }

  return (
    <div className='show-single-batch'>
      {allBatch?
        <>
          <Link className='show-single-batch__name' to={"/batch/trainee/"+allBatch.batch._id}> <h1>{allBatch.batch.batchName}</h1> </Link>
          <p className='show-single-batch__start-date' ><b>Start Date: </b>{allBatch.batch.batchDate}</p>
          <Link className='show-single-batch__add-trainee' to={"/batch/add-trainee/"+allBatch.batch._id}> <button className='show-single-batch__single'>Add Trainee</button> </Link>
          {console.log(allBatch)}
          {allBatch.batch.trainees.length>0?allBatch.batch.trainees.map(
            trainee=>
            {
              return <div className='show-single-batch__trainee'>
                <h3 className='show-single-batch__trainee__name'>Trainee: {trainee.trainee.firstName} {trainee.trainee.lastName}</h3>
                <p className='show-single-batch__trainee__email'><b>Email: </b>{trainee.trainee.email}</p>
                <button className='show-single-batch__trainee__single' onClick={deleteTrainee} value={trainee.trainee._id}>-</button>
                </div> 
            }
          ):<h1>No Trainee Found</h1>}
          {/* {console.log(allBatch.batch.trainees.length>0)} */}
        </>
        :""}
      <p className='login__error'>{userError}</p>
    </div>
  )
}

export default BatchSingleShow;