import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate,useParams  } from 'react-router-dom';

import './style/showQuiz.css';

function TrainerQuizes() {
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

    const deleteQuiz=()=>
    {
      
    }

  return (
    <>
    {console.log(allTerm)}
    {allTerm?
    <div className='all-quiz'>
        <div className='all-quiz__term'>
        <p className='all-quiz__term__title'> {allTerm.term.termName}</p>
        {allTerm.term.batchId?<p className='all-quiz__term__item'><b>Batch Name: </b>{allTerm.term.batchId.batchName} </p>
            :<p className='all-quiz__term__item'>Batch Not Added</p>
        }
        <p className='all-quiz__term__item'><b>Course Name:</b> {allTerm.term.courseId.courseName}</p>
        {allTerm.term.courseId.courseTopics && allTerm.term.courseId.courseTopics.length>0?<p className='all-quiz__term__item'><b>Course Topics</b></p>:""}
            <div className='all-quiz__term__topics'>
                {allTerm.term.courseId.courseTopics && allTerm.term.courseId.courseTopics.length>0?allTerm.term.courseId.courseTopics.map(course=>{
                    return <div className='all-quiz__term__topics__topic'><p className='all-quiz__term__topics__text'>{course.topics}</p></div>
                }):""}

            </div>
        </div>
    
        <div className='all-quiz__quiz'>
        <Link className='all-quiz__quiz__link' to={"/trainer/create-quiz/"+allTerm.term._id}> <button className='all-quiz__quiz__link__single'>Add Quiz</button></Link>
            {allTerm.term.Quizes.length>0?allTerm.term.Quizes.map(quiz=>
            {
                return<div className='all-quiz__quiz__single'> 
                    <Link className='all-quiz__quiz__single__link' to={"/trainer/single-quiz/"+allTerm.term._id+"/"+quiz.quizName}> <h1>{quiz.quizName}</h1></Link>
                    <p><b>Quiz Details: </b>{quiz.quizDetails}</p>
                    <button onClick={deleteQuiz} className='all-quiz__quiz__single__button'>Delete Quiz</button>
                </div>
            })
            :<h1>No Quiz Found</h1>}
        </div>
    </div>:""
    }
    <p className='login__error'>{userError}</p>
    {allTerm?console.log(allTerm.term.batch):""}
    </>
  )
}

export default TrainerQuizes;