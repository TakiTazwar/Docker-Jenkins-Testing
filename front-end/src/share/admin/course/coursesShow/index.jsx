import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';


function CourseShow() {
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
    axios.get("http://localhost:5000/admin/view-all-course").then(res=>
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

    const deleteCourse=(e)=>
    {
      axios.delete("http://localhost:5000/admin/delete-course/"+e.target.value).then(res=>
        {
          if(res.data.success==true)
          {
            axios.get("http://localhost:5000/admin/view-all-course").then(res=>
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
    <div className='show-batch'>
      {allCourse?allCourse.course.map(course=>
        {
          return <div className='show-batch__batch'>
            <Link className='show-batch__batch__name' to={"/course/topic/"+course._id}> <h1>{course.courseName}</h1> </Link>
            <p className='show-batch__batch__item'>{course.courseDetails}</p>
            <div className='show-batch__batch__buttons'>
              <Link className='show-batch__batch__buttons__item' to={"/course/edit-course/"+course._id}> <button className='show-batch__batch__buttons__single'>Edit</button> </Link>
              <button className='show-batch__batch__buttons__single' onClick={deleteCourse} value={course.courseName}>Delete</button>
            </div>
          </div>
        }):""}
      {/* {
        allCourse?console.log(allCourse.course):""
      } */}
      <p className='login__error'>{userError}</p>
    </div>
  )
}

export default CourseShow;