import React from 'react';
import './style/home.css';
import { Link } from 'react-router-dom';
import batchLogo from '../../../assets/images/batchIcon.png';
import userLogo from '../../../assets/images/userIcon.png';
import courseLogo from '../../../assets/images/courseIcon.png';
import termLogo from '../../../assets/images/termIcon.png';
import './style/home.css'
function TrainerHome() {
  return (
    <div className='trainer-home'>
        <Link className='trainer-home__items' to={"/trainer-term"}><img className='admin-home__items__picture' src={termLogo} /><span className='admin-home__items__text' >Term</span></Link>
    </div>
  )
}   

export default TrainerHome;