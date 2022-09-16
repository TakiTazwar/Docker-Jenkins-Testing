import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate,useParams } from 'react-router-dom';

import './style/addtopic.css';

function AddTrainerTopic() {
  const [userError,setUserError]=useState();
  const [allTopics,setAllTopics]=useState();
  const headers={"Content-Type":"multipart/form-data","Authorization":"Bearer "+localStorage.getItem("access_token")};
  let { id } = useParams();
  const firstUpdate = useRef(true);
  const navigate=useNavigate();
  useEffect(_=>{
    if (firstUpdate.current) {
        firstUpdate.current = false;
        return;
      }
    axios.get("http://localhost:5000/admin/get-trainer-course-topic/"+id,{headers:headers}).then(res=>
      {
        if(res.data.success==true)
        {
          setAllTopics(res.data.data);
        }
        else if(res.data.success==false)
        {
          setUserError("Server request is not allowed");
        }
    }).catch(res=> setUserError("Cannot connect to server"));
    },[]);

  const addTopic=(e)=>
  {
    const data={};
    data.id=id;
    data.topic=e.target.value;
    axios.post("http://localhost:5000/admin/add-trainer-topic",data,headers).then(res=>
    {
      if(res.data.success==true)
      {
        navigate("/users/show/trainer");
      }
      else
      {
        setUserError("Topic Already Added");
      }
    }
    ).catch(res=>
    {
      setUserError("Cannot connect to server");
    });
  }


  return (
    <div className="add-trainer-topic">
      <h1 className="add-trainer-topic__title">Add Topics to Trainer</h1>
        {/* {allTopics?console.log(allTopics.topics):""} */}
        {allTopics && (allTopics.topics.length>0)?<>
          {allTopics.topics.map(topic=>
            {
              return <div className="add-trainer-topic__topics">
                <p className="add-trainer-topic__topics__label">{topic}</p>
                <button className="add-trainer-topic__topics__button" onClick={addTopic} value={topic} >Add</button>
              </div>
            })}
        
        </>:<h1>All Topics are added</h1>}
      <p className='login__error'>{userError}</p>
    </div>
  )
}

export default AddTrainerTopic;