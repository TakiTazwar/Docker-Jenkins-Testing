import React, { useEffect, useRef, useState,useContext } from 'react';
import {Link,useNavigate} from 'react-router-dom';

import './style/header.css';
import navLogo from '../../assets/images/nav_logo.png';
import UserTypeValue from "../../services/contextApi/ThemeContext";
function Header() {

  const value=useContext(UserTypeValue);
  const [token,setToken]=useState("none");
  const firstUpdate = useRef(true);
  const navigate=useNavigate();
  useEffect(_=>{
      if (firstUpdate.current) 
      {
          firstUpdate.current = false;
          return;
      }
      console.log(value);
      setToken(localStorage.getItem("access_token"));
    },[]);

  const logout=()=>
  {
    localStorage.clear();
    value.setUserHeader("none");
    navigate("/login");
  }
  return (
    <div className='header'>
      <img className='header__logo' src={navLogo}></img>
      <h1 className='header__title'>BJIT ACADEMY</h1>
      {value.userHeader!="none"?<Link className="header__link" to={"/"+value.userHeader}> Home</Link>:""}
      <p>{}</p>
      {value.userHeader!="none"?<button className='header__logout' onClick={logout}>Logout</button>:<Link className="header__link" to={"/login"}>  Login </Link>}
    </div>
  )
}

export default Header;