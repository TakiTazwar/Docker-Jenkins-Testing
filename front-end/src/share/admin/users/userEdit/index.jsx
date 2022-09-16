import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate,useParams } from 'react-router-dom';

import './style/useredit.css';

function UserEdit() {
  const [userError,setUserError]=useState();
  const [allUsers,setAllUsers]=useState();
  const headers={"Content-Type":"multipart/form-data","Authorization":"Bearer "+localStorage.getItem("access_token")};
  let { id } = useParams();
  const firstUpdate = useRef(true);
  const navigate=useNavigate();
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
    axios.get("http://localhost:5000/user/view-single-user/"+id,{headers:headers}).then(res=>
      {
        if(res.data.success==true)
        {
          setAllUsers(res.data.data);
        }
        else if(res.data.success==false)
        {
          setUserError("Server request is not allowed");
        }
    }).catch(res=> setUserError("Cannot connect to server"));
    },[]);

  const  onSubmit = async (data) => {
    try
    {
        let formData= new FormData();
        if(data.imageUrl.length==0)
        {
            delete data.imageUrl;
        }
        else
        {
            let file=data.imageUrl[0];
            formData.append('imageUrl',file);
        }
        if(data.address){formData.append('address',data.address)};
        if(data.firstName){formData.append('firstName',data.firstName)};
        if(data.lastName){formData.append('lastName',data.lastName)};
        if(data.mobile){formData.append('mobile',data.mobile)};
        if(data.nationalId){formData.append('nationalId',data.nationalId)};
        if(data.userType){formData.append('userType',data.userType)};
        formData.append('userId',id)
        const added=await axios({
            method: 'post',
            url: 'http://localhost:5000/user/edit-user',
            data: formData,
            headers: headers
        });        
        if(added.data.success==true)
        {
            navigate("/users/show");
        }
        else
        {
            setUserError("User already exists");
        }
    }
    catch(errors)
    {
        setUserError("Cannot Connect to server");
    }
  }


  return (
    <div className='user-edit'>
      <form className='user-edit__form' onSubmit={handleSubmit(onSubmit)}>

        <input className='user-edit__form__input' name="firstName" defaultValue={allUsers?allUsers.user.firstName:""} placeholder='First Name' {...register('firstName',  {  pattern:/[a-zA-Z]+/})} />
        {errors.firstName && errors.firstName.type=="pattern"&& <p className='errorShow'>Enter a valid First Name</p>}

        <input className='user-edit__form__input' name="lastName" defaultValue={allUsers?allUsers.user.lastName:""} placeholder='Last Name' {...register('lastName',  {  pattern:/[a-zA-Z]+/})} />
        {errors.lastName && errors.lastName.type=="pattern"&& <p className='errorShow'>Enter a valid Last Name</p>}

        <input className='user-edit__form__input' name="address" defaultValue={allUsers?allUsers.user.address:""} placeholder='Address' {...register('address',  )} />

        <input className='user-edit__form__input' name="mobile" defaultValue={allUsers?allUsers.user.mobile:""} placeholder='Phone Number' {...register('mobile',  {  pattern:/[0-9]+/})} />
        {errors.mobile && errors.mobile.type=="pattern"&& <p className='errorShow'>Enter a valid Phone Number</p>}

        <input className='user-edit__form__input' name="nationalId" defaultValue={allUsers?allUsers.user.nationalId:""} placeholder='National ID' {...register('nationalId',  {  pattern:/[0-9]+/})} />
        {errors.nationalId && errors.nationalId.type=="pattern"&& <p className='errorShow'>Enter a valid National ID</p>}

        <div className='user-edit__form__selector'>
          <input type="radio" className='user-edit__form__selector__radio'  name="user_type" value="trainee" defaultChecked={allUsers && allUsers.user.userType=="trainee"?true:false} {...register('userType')}/>
          <span className='user-edit__form__selector__label user-edit__form__selector__label--first'>Trainee</span>
          <input type="radio" className='user-edit__form__selector__radio'  name="user_type" value="trainer" defaultChecked={allUsers && allUsers.user.userType=="trainer"?true:false} {...register('userType')}/>
          <span className='user-edit__form__selector__label'>Trainer</span>
        </div>
        <div className="user-edit__form__image">
          <p className="user-edit__form__image__label">Image</p>
          <input  className="user-edit__form__image__file" type="file" {...register('imageUrl' )} />
        </div>
        <input className='user-create__form__submit' type="submit" value="Edit" />
      </form>
      <p className='login__error'>{userError}</p>
    </div>
  )
}

export default UserEdit;