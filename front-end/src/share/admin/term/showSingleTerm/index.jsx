import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate,useParams  } from 'react-router-dom';

import './style/showSingleTerm.css';

function TermSingleShow() {
  let { id } = useParams();
  const headers={"Content-Type":"application/json"};
  const [allTerm,setAllTerm]=useState();
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
    axios.get("http://localhost:5000/admin/view-single-term/"+id).then(res=>
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

    const removeBatch=()=>
    {
      axios.delete("http://localhost:5000/admin/term/delete-batch/"+id).then(res=>
        {
          if(res.data.success==true)
          {
            axios.get("http://localhost:5000/admin/view-single-term/"+id).then(res=>
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
            setUserError("Batch Couldn't be deleted");
          }
        }).catch(res=>
        {
            setUserError("Cannot connect to server");
        });
    }

    const removeCourse=()=>
    {
      axios.delete("http://localhost:5000/admin/term/delete-course/"+id).then(res=>
        {
          if(res.data.success==true)
          {
            axios.get("http://localhost:5000/admin/view-single-term/"+id).then(res=>
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
            setUserError("Course Couldn't be deleted");
          }
        }).catch(res=>
        {
            setUserError("Cannot connect to server");
        });
    }

    const removeTrainer=()=>
    {
      axios.delete("http://localhost:5000/admin/term/delete-trainer/"+id).then(res=>
        {
          if(res.data.success==true)
          {
            axios.get("http://localhost:5000/admin/view-single-term/"+id).then(res=>
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
            setUserError("Trainer Couldn't be deleted");
          }
        }).catch(res=>
        {
            setUserError("Cannot connect to server");
        });
    }

  return (
    <>
    {allTerm?<div className='term-single-show'>
            <div className='term-single-show__row'>
              <div className='term-single-show__row__item term-single-show__row__item--first'>
                  <h1 className='term-single-show__row__item__title'>Term</h1>
                  <p className='term-single-show__row__item__name'><b>Term Name:</b> {allTerm.term.termName}</p>
              </div>
              <div className='term-single-show__row__item'>
                  <h1 className='term-single-show__row__item__title'>Batch</h1>
              { allTerm.term.batchId?
                  <><p className='term-single-show__row__item__name'><b>Batch Name: </b>{allTerm.term.batchId.batchName} </p>
                    <button className='term-single-show__row__item__button' onClick={removeBatch} >Remove</button>
                  </>
                  :<div className='term-single-show__row__item__link'>
                      <p className='term-single-show__row__item__name'>Not Added</p>
                      <Link className='term-single-show__row__item__link' to={"/term/add-batch/"+allTerm.term._id}> <button className='term-single-show__row__item__button'>Add Batch</button> </Link>
                  </div>
              }
              </div>
            </div>
            <div className='term-single-show__row'>
              <div className='term-single-show__row__item term-single-show__row__item--first'>
                  <h1 className='term-single-show__row__item__title'>Course</h1>
              {allTerm.term.courseId?
                <><p className='term-single-show__row__item__name'><b>Course Name: </b> {allTerm.term.courseId.courseName}</p>
                  <button className='term-single-show__row__item__button' onClick={removeCourse} >Remove</button>
                </>
                  
                  :<div className='term-single-show__row__item__link'>
                      <p className='term-single-show__row__item__name'>Not Added</p>
                      <Link className='term-single-show__row__item__link' to={"/term/add-course/"+allTerm.term._id}> <button button className='term-single-show__row__item__button'>Add Course</button> </Link>
                  </div>
              }
              </div>
              <div className='term-single-show__row__item'>
                  <h1 className='term-single-show__row__item__title'>Trainer</h1>
                  {allTerm.term.trainerId?
                      <div className='term-single-show__row__item__link'><p className='term-single-show__row__item__name'><b>Trainer Name: </b>{allTerm.term.trainerId.firstName} {allTerm.term.trainerId.lastName}</p>
                        <button className='term-single-show__row__item__button' onClick={removeTrainer} >Remove</button>
                      </div>
                      :<div className='term-single-show__row__item__link'>
                          <p className='term-single-show__row__item__name'>Not Added</p>
                          {allTerm.term.courseId?
                              <Link className='term-single-show__row__item__link' to={"/term/add-trainer/"+allTerm.term._id+"/"+allTerm.term.courseId._id}> <button className='term-single-show__row__item__button'>Add Trainer</button> </Link>:<p className='term-single-show__row__item__name'>Please add a Course to add Trainer</p>
                          }
                      </div>
                  }
              </div>
            </div>
            
        </div>:""
    }
    <p className='login__error'>{userError}</p>
    {allTerm?console.log(allTerm.term.batch):""}
    </>
  )
}

export default TermSingleShow;