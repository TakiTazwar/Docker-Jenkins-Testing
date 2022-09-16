import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ReactPaginate from 'react-paginate';
import './style/batchShow.css';

function BatchShow() {
  const [allBatch,setAllBatch]=useState();
  const [userError,setUserError]=useState();
  const itemNum=3;
  const mainUrl="http://localhost:5000/admin/view-all-batch?";
  const [url,setUrl]=useState(mainUrl);
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
    axios.get("http://localhost:5000/admin/view-all-batch?page=1&items=3").then(res=>
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

    const deleteBatch=(e)=>
    {
      axios.delete("http://localhost:5000/admin/delete-batch/"+e.target.value).then(res=>
        {
          if(res.data.success==true)
          {
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
          }
          else
          {
            setUserError("Invalid User");
          }
        });
      
    }

    const handlePageClick=(data)=>
    {
        const page=parseInt(data.selected)+1
        const Newurl=url+"&page="+page+"&items="+itemNum;
        console.log(Newurl)
        axios.get(Newurl,{headers:headers}).then(res=>
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

    const searchBatch= async (data)=>
    {
      const newUrl=mainUrl+"batchName="+data.search;
      await setUrl(newUrl);
      axios.get(newUrl,{headers:headers}).then(res=>
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
  return (
    <>
    <form className='search' onSubmit={handleSubmit(searchBatch)} >
      <input className='search__input' {...register('search')} />
      <input className='search__button' type="submit" value="Search" />
    </form>
    <div className='show-batch'>
      
      {allBatch?allBatch.batch.map(singleBatch=>
        {
          return <div className='show-batch__batch'>
            <Link className='show-batch__batch__name' to={"/batch/trainee/"+singleBatch._id}> <h1>{singleBatch.batchName}</h1> </Link>
            <p className='show-batch__batch__item'><b>Start Date: </b>{new Date(singleBatch.batchDate).getDate()+'/'+new Date(singleBatch.batchDate).getMonth()+'/'+new Date(singleBatch.batchDate).getFullYear()}</p>
            <div className='show-batch__batch__buttons'>
              <Link className='show-batch__batch__buttons__item' to={"/batch/edit-batch/"+singleBatch._id}> <button className='show-batch__batch__buttons__single'>Edit</button> </Link>
              <button className='show-batch__batch__buttons__single' onClick={deleteBatch} value={singleBatch.batchName}>Delete</button>
            </div>
          </div>
        }):""}
      {/* {
        allBatch?console.log(allBatch.batch):""
      } */}
      <p className='login__error'>{userError}</p>
    </div>
    <ReactPaginate 
      previousLabel={"<<"}
      nextLabel={">>"}
      breakLabel={"..."}
      pageCount={allBatch?allBatch.totalItems/itemNum:1}
      onPageChange={handlePageClick}
      containerClassName={"pagination justify-content-center batch-page__pagination"}
      pageClassName={"page-item"}
      pageLinkClassName={"page-link"}
      previousClassName={"page-item"}
      previousLinkClassName={"page-link"}
      nextClassName={"page-item"}
      nextLinkClassName={"page-link"}
      breakClassName={"page-item"}
      breakLinkClassName={"page-link"}
    />
  </>
  )
}

export default BatchShow;