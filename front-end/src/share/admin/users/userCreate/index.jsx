import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import "./style/usercreate.css";

function UserCreate() {
  const [userError,setUserError]=useState();
  const headers={"Content-Type":"multipart/form-data","Authorization":"Bearer "+localStorage.getItem("access_token")};
  const navigate=useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm( {
    mode: "onChange"
  });

  

  const  onSubmit = async (data) => {
    try
    {
        let formData= new FormData();
        console.log(data.imageUrl.length);
        if(data.imageUrl.length==0)
        {
            delete data.imageUrl;
        }
        else
        {
            let file=data.imageUrl[0];
            formData.append('imageUrl',file);
        }
        formData.append('email',data.email);
        formData.append('address',data.address);
        formData.append('firstName',data.firstName);
        formData.append('lastName',data.lastName);
        formData.append('mobile',data.mobile);
        formData.append('nationalId',data.nationalId);
        formData.append('userType',data.userType);
        const added=await axios({
            method: 'post',
            url: 'http://localhost:5000/user/add-user',
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
    <div className='user-create'>
      <form className='user-create__form' onSubmit={handleSubmit(onSubmit)}>
        <input className='user-create__form__input user-create__form__input--first' name="email" placeholder='Email' {...register('email',  { required: true , pattern:/[\w-]+@([\w-]+\.)+[\w-]+/})} />
        {errors.email && errors.email.type=="pattern"&& <p className='login__error'>Enter a valid Email</p>}
        {errors.email && errors.email.type=="required" && <p className='login__error'>Email cannot be empty</p>}

        <input className='user-create__form__input' name="firstName" placeholder='First Name' {...register('firstName',  { required: true , pattern:/[a-zA-Z]+/})} />
        {errors.firstName && errors.firstName.type=="pattern"&& <p className='login__error'>Enter a valid First Name</p>}
        {errors.firstName && errors.firstName.type=="required" && <p className='login__error'>First Name cannot be empty</p>}

        <input className='user-create__form__input' name="lastName" placeholder='Last Name' {...register('lastName',  { required: true , pattern:/[a-zA-Z]+/})} />
        {errors.lastName && errors.lastName.type=="pattern"&& <p className='login__error'>Enter a valid Last Name</p>}
        {errors.lastName && errors.lastName.type=="required" && <p className='login__error'>Last Name cannot be empty</p>}

        <input className='user-create__form__input' name="address" placeholder='Address' {...register('address',  { required: true })} />
        {errors.address && errors.address.type=="required" && <p className='login__error'>Address cannot be empty</p>}

        <input className='user-create__form__input' name="mobile" placeholder='Phone Number' {...register('mobile',  { required: true , pattern:/[0-9]+/})} />
        {errors.mobile && errors.mobile.type=="pattern"&& <p className='login__error'>Enter a valid Phone Number</p>}
        {errors.mobile && errors.mobile.type=="required" && <p className='login__error'>Phone Number cannot be empty</p>}

        <input className='user-create__form__input' name="nationalId" placeholder='National ID' {...register('nationalId',  { required: true , pattern:/[0-9]+/})} />
        {errors.nationalId && errors.nationalId.type=="pattern"&& <p className='login__error'>Enter a valid National ID</p>}
        {errors.nationalId && errors.nationalId.type=="required" && <p className='login__error'>National ID cannot be Phone Number</p>}

        <div className='user-create__form__selector'>
          <input type="radio" className='user-create__form__selector__radio' name="user_type" value="trainee" {...register('userType',  { required: true})}/>
          <span className='user-create__form__selector__label user-create__selector__label--first'>Trainee</span>
          <input type="radio"  name="user_type" value="trainer" {...register('userType',  { required: true})}/>
          <span className='user-create__form__selector__label'>Trainer</span>
          {errors.userType && errors.userType.type=="required" && <p className='errorShow'>User Type cannot be Empty</p>}
        </div>
        <div className="user-create__form__image">
          <p className="user-create__form__image__label">Image</p>
          <input  className="user-create__form__image__file" type="file" {...register('imageUrl' )} />
        </div>
        <input className='user-create__form__submit' type="submit" value="Create" />
      </form>
      <p className='user-create__error'>{userError}</p>
    </div>
  )
}

export default UserCreate;