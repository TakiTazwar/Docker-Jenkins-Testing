import React from 'react';
import './style/home.css';
import { Link } from 'react-router-dom';
import batchLogo from '../../../assets/images/batchIcon.png';
import userLogo from '../../../assets/images/userIcon.png';
import courseLogo from '../../../assets/images/courseIcon.png';
import termLogo from '../../../assets/images/termIcon.png';

function AdminHome() {
  return (
    <div className='admin-home'>
        <Link className='admin-home__items' to={"/users"}><img className='admin-home__items__picture' src={userLogo} /><span className='admin-home__items__text' >Users</span></Link>
        <Link className='admin-home__items' to={"/batch"}><img className='admin-home__items__picture' src={batchLogo} /><span className='admin-home__items__text' >Batches</span></Link>
        <Link className='admin-home__items' to={"/courses"}><img className='admin-home__items__picture' src={courseLogo} /><span className='admin-home__items__text' >Courses</span></Link>
        <Link className='admin-home__items' to={"/term"}><img className='admin-home__items__picture' src={termLogo} /><span className='admin-home__items__text' >Term</span></Link>
    </div>
  )
}   

export default AdminHome;