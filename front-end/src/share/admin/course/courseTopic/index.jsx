import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate,useParams  } from 'react-router-dom';

import './style/courseTopic.css';

function CourseTopic() {
  let { id } = useParams();
  const headers={"Content-Type":"application/json"};
  const [allCourse,setAllCourse]=useState();
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
    axios.get("http://localhost:5000/admin/view-single-course/"+id).then(res=>
      {
        if(res.data.success==true)
        {
          setAllCourse(res.data.data);
        }
        else if(res.data.success==false)
        {
          setUserError("Server request is not allowed");
        }
    }).catch(res=> setUserError("Cannot connect to server"));
    },[]);

    const onSubmit=(data)=>
    {
      data.id=id;
      axios.post("http://localhost:5000/admin/add-topic",data,headers).then(res=>
      {
        if(res.data.success==true)
        {
          axios.get("http://localhost:5000/admin/view-single-course/"+id).then(res=>
            {
              if(res.data.success==true)
              {
                setAllCourse(res.data.data);
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

  const deleteTopic=(e)=>
  {
    axios.delete("http://localhost:5000/admin/delete-topic/"+allCourse.course._id+"/"+e.target.value).then(res=>
      {
        if(res.data.success==true)
        {
          axios.get("http://localhost:5000/admin/view-single-course/"+id).then(res=>
            {
              if(res.data.success==true)
              {
                setAllCourse(res.data.data);
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
    <div className='course-topic'>
      {allCourse?
        <>
          <Link className='course-topic__name' to={"/course/topic/"+allCourse.course._id}> <h1>{allCourse.course.courseName}</h1> </Link>
          <p className='course-topic__details'><b>Course Details: </b>{allCourse.course.courseDetails}</p>
          <form className='course-topic__add-topic' onSubmit={handleSubmit(onSubmit)}>
            <input className='course-topic__add-topic__input'  name="topic" placeholder='Add Topics' {...register('topic',  { required: true})} />
            {errors.email && errors.email.type=="required" && <p className=''>Topics cannot be empty</p>}

            <input className='course-topic__add-topic__button' type="submit" value="+" />
          </form>
          {allCourse.course.courseTopics.length>0?<p className='course-topic__topic-label'>Topics:</p>:""}
          {allCourse.course.courseTopics.map(
            topic=>
            {
              return <div className='course-topic__topics'>
                  <p  className="course-topic__topics__label">{topic.topics}</p>
                  <button className="course-topic__topics__button" onClick={deleteTopic} value={topic.topics}>-</button>
                </div>
            }
          )}
        </>
        :""}
      <p className='login__error'>{userError}</p>
    </div>
  )
}

export default CourseTopic;