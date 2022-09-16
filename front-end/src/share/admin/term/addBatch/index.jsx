import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate,useParams  } from 'react-router-dom';

import './style/addTermBatch.css';

function AddTermBatch() {
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
    axios.get("http://localhost:5000/admin/view-all-batch").then(res=>
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

    const addBatch=(e)=>
    {
        const data={}
        data.batchId=e.target.value;
        data.id=id;

        axios.post("http://localhost:5000/admin/term/add-batch",data,headers).then(res=>
        {
          if(res.data.success==true)
          {
            navigate("/term/single/"+id);
          }
          else
          {
            setUserError("Data Couldn't be Deleted");
          }
        }).catch(res=>
        {
            setUserError("Cannot Connect to server");
        });
    }

  return (
    <div className='add-term-batch'>
    {allBatch?allBatch.batch.map(singleBatch=>
        {
          return <div className='add-term-batch__batch'>
            <div className="add-term-batch__batch__row">
              <h1 className="add-term-batch__batch__row__title">{singleBatch.batchName}</h1> 
              <button className="add-term-batch__batch__row__button" onClick={addBatch}  value={singleBatch._id}>+</button>
            </div>
            <p><b>Start Date: </b>{new Date(singleBatch.batchDate).getDate()+'/'+new Date(singleBatch.batchDate).getMonth()+'/'+new Date(singleBatch.batchDate).getFullYear()}</p>
          </div>
        }):<h1>Loading</h1>}
    <p className='login__error'>{userError}</p>
    {allBatch?console.log(allBatch):""}
    </div>
  )
}

export default AddTermBatch;