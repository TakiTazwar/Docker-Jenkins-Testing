import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate,useParams  } from 'react-router-dom';

function AddTermCourse() {
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

    const addCourse=(e)=>
    {
        const data={}
        data.courseId=e.target.value;
        data.id=id;

        axios.post("http://localhost:5000/admin/term/add-course",data,headers).then(res=>
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
    <div className='add-term-batch'>
    {allCourse?allCourse.course.map(singleCourse=>
        {
          return <div div className='add-term-batch__batch' >
            <h1 className="add-term-batch__batch__row__title">{singleCourse.courseName}</h1>
            <button className="add-term-batch__batch__row__button" onClick={addCourse}  value={singleCourse._id}>+</button>
          </div>
        }):<h1>Loading</h1>}
    <p className='login__error'>{userError}</p>
    {allCourse?console.log(allCourse):""}
    </div>
  )
}

export default AddTermCourse;