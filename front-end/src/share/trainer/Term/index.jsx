import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';


function TrainerTerm() {
  const [allTerm,setAllTerm]=useState();
  const [userError,setUserError]=useState();
  const firstUpdate = useRef(true);
  const headers={"Content-Type":"multipart/form-data","Authorization":"Bearer "+localStorage.getItem("access_token")};
  useEffect(_=>{
    if (firstUpdate.current) {
        firstUpdate.current = false;
        return;
      }
    axios.get("http://localhost:5000/trainer/get-all-quiz",{headers:headers}).then(res=>
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

    const deleteTerm=(e)=>
    {
      axios.delete("http://localhost:5000/admin/delete-term/"+e.target.value).then(res=>
        {
          if(res.data.success==true)
          {
            axios.get("http://localhost:5000/admin/view-all-term").then(res=>
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
          }
          else
          {
            setUserError("Data Couldn't be fetched");
          }
        });
      
    }

  return (
    <div className='show-batch'>
      {allTerm?allTerm.term.map(singleTerm=>
        {
          return <div className='show-batch__batch'>
            <Link className='show-batch__batch__name' to={"/trainer/quizes/"+singleTerm._id}> <h1>{singleTerm.termName}</h1> </Link>
            <p className='show-batch__batch__item'><b>Start Date: </b>{new Date(singleTerm.startDate).getDate()+'/'+new Date(singleTerm.startDate).getMonth()+'/'+new Date(singleTerm.startDate).getFullYear()}</p>
            <p className='show-batch__batch__item'><b>End Date: </b>{new Date(singleTerm.endDate).getDate()+'/'+new Date(singleTerm.endDate).getMonth()+'/'+new Date(singleTerm.endDate).getFullYear()}</p>
            <p className='show-batch__batch__item'><b>Course Name: </b>{singleTerm.courseId.courseName}</p>
            <p className='show-batch__batch__item'><b>Number of Quizes: </b>{singleTerm.Quizes.length}</p>
          </div>
        }):""}
      {
        allTerm?console.log(allTerm.term):""
      }
      <p className='login__error'>{userError}</p>
    </div>
  )
}

export default TrainerTerm;