import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate,useParams  } from 'react-router-dom';

import "./style/singleQuiz.css";

function TrainerSingeQuiz() {
  let totalMarks=[];
  let { id,quizName } = useParams();
  const [allTerm,setAllTerm]=useState();
  const [allBatch,setAllBatch]=useState();
  const [userError,setUserError]=useState();
  const navigate=useNavigate();
  const firstUpdate = useRef(true);
  const headers={"Content-Type":"multipart/form-data","Authorization":"Bearer "+localStorage.getItem("access_token")};
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
      //console.log("http://localhost:5000/trainer/get-single-quiz/"+id+"/"+quizName);
    axios.get("http://localhost:5000/trainer/get-single-quiz/"+id+"/"+quizName,{headers:headers}).then(res=>
      {
        if(res.data.success==true)
        {
          setAllTerm(res.data.data);
          axios.get("http://localhost:5000/admin/view-single-batch/"+res.data.data.term.batchId).then(res=>
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
        else if(res.data.success==false)
        {
          setUserError("Server request is not allowed");
        }
    }).catch(res=> setUserError("Cannot connect to server"));
    },[]);



    const  onSubmit = async (e) => {
        const mark=document.getElementById(e.target.value);
        const trainee=e.target.value;
        const data={}
        data.mark=mark.value;
        data.trainee=trainee;
        data.termId=id;
        data.quizName=quizName;
        console.log(data)

        axios.post("http://localhost:5000/trainer/add-quiz-marks",data,headers).then(res=>
        {
            if(res.data.success==true)
            {
                axios.get("http://localhost:5000/trainer/get-single-quiz/"+id+"/"+quizName,{headers:headers}).then(res=>
                {
                    if(res.data.success==true)
                    {
                    setAllTerm(res.data.data);
                    axios.get("http://localhost:5000/admin/view-single-batch/"+res.data.data.term.batchId).then(res=>
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
        }
        ).catch(res=>
        {
            setUserError("Cannot connect to server");
        });
      }



  return (
    <div >
    {allBatch?<div className='single-quiz'>
       <h1 className='single-quiz__title'> {allTerm.term.Quizes[0].quizName} </h1>
       <p className='single-quiz__item'><b>Quiz Details: </b> {allTerm.term.Quizes[0].quizDetails} </p>
       <table className='single-quiz__table'>
        <tr className='single-quiz__table__row'>
            <td className='single-quiz__table__column'><h2>Trainee Name</h2></td>
            <td className='single-quiz__table__column'><h2>Add Marks</h2></td>
            <td className='single-quiz__table__column'><h2>Current Marks</h2></td>
        </tr>
       {allBatch.batch.trainees.map(trainee=>
        {
            return <tr className='single-quiz__table__row'>
                <td className='single-quiz__table__column'>{trainee.trainee.firstName} {trainee.trainee.lastName}</td>
                <td className='single-quiz__table__column'>
                    <input id={trainee.trainee._id} placeholder='Marks'/>
                    <button onClick={onSubmit} value={trainee.trainee._id} >Add</button>
                </td>
                <td className='single-quiz__table__column'>
                {allTerm.term.Quizes[0].marks.map(mark=>
                {
                    if(mark.trainee._id==trainee.trainee._id)
                    {
                        return <>
                            <td>{mark.mark}</td>
                        </>
                    }
                })}
                </td>
            </tr>
        })}
        </table>
        
    </div>:<h1>Loading</h1>
    }
    <p className='login__error'>{userError}</p>
    {allTerm?console.log(allTerm.term.batch):""}
    </div>
  )
}

export default TrainerSingeQuiz;