import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import './style/showtrainee.css';

function TraineeShow() {
  const [allTrainers,setAllTrainers]=useState();
  const [pageCount,setPageCount]=useState();
  const itemNum=3;
  const [userError,setUserError]=useState();
  const headers={"Content-Type":"multipart/form-data","Authorization":"Bearer "+localStorage.getItem("access_token")};
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
    axios.get("http://localhost:5000/user/get-all-users?type=trainee&page=0&items=3",{headers:headers}).then(res=>
      {
        if(res.data.success==true)
        {
          setAllTrainers(res.data.data.allUser);
          setPageCount(res.data.data.totalItems);
        }
        else if(res.data.success==false)
        {
          setUserError("Server request is not allowed");
        }
    }).catch(res=> setUserError("Cannot connect to server"));
    },[]);

    const deleteUser=(e)=>
    {
      axios.delete("http://localhost:5000/user/delete-user/"+e.target.value,{headers:headers}).then(res=>
        {
          if(res.data.success==true)
          {
            axios.get("http://localhost:5000/user/get-all-users?type=trainee&page=0&items=3",{headers:headers}).then(res=>
              {
                if(res.data.success==true)
                {
                  setAllTrainers(res.data.data.allUser);
                  setPageCount(res.data.data.totalItems);
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

    const handlePageClick=(data)=>
    {
        const page=parseInt(data.selected)+1;
        //const Newurl=url+"&page="+page+"&items="+itemNum;
        axios.get("http://localhost:5000/user/get-all-users?type=trainee&page="+page+"&items="+itemNum,{headers:headers}).then(res=>
        {
          if(res.data.success==true)
          {
            setAllTrainers(res.data.data.allUser);
            setPageCount(res.data.data.totalItems);
          }
          else if(res.data.success==false)
          {
            setUserError("Server request is not allowed");
          }
      }).catch(res=> setUserError("Cannot connect to server"));
    }

  return (
    <div >
      <div className='show-trainees'>
        {allTrainers?allTrainers.map(user=>
          {
            return <div className='show-trainees__trainee'>
              <Link className='show-trainees__trainee__name' to={"/users/show/trainee/"+user._id}> <h1>{user.firstName} {user.lastName}</h1> </Link>
              <p className='show-trainees__trainee__item'><b>Email: </b>{user.email}</p>
              <p className='show-trainees__trainee__item'><b>Mobile: </b>{user.mobile}</p>
              <div className='show-trainees__trainee__buttons'>
                <Link className='show-trainees__trainee__buttons__item' to={"/users/edit/"+user._id}> <button className='show-trainees__trainee__buttons__single'>Edit</button> </Link>
                <button className='show-trainees__trainee__buttons__item show-trainees__trainee__buttons__single' onClick={deleteUser} value={user._id}>Delete</button>
              </div>
            </div>
          }):""}
        <p className='login__error'>{userError}</p>
      </div>
      <ReactPaginate 
        previousLabel={"<<"}
        nextLabel={">>"}
        breakLabel={"..."}
        pageCount={pageCount?pageCount/itemNum:1}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
      />

    </div>
  )
}

export default TraineeShow;