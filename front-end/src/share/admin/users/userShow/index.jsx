import React from 'react';
import { Link } from 'react-router-dom';

import createLogo from '../../../../assets/images/trainer-logo.png';
import ShowLogo from '../../../../assets/images/trainee-logo.png';

import './style/usershow.css';

function UsersShow() {

  return (
    <div className='users'>
        <Link className='users__items' to={"/users/show/trainer"}><img className='users__items__picture' src={createLogo} /><span className='users__items__text' >Trainer</span></Link>
        <Link className='users__items' to={"/users/show/trainee"}><img className='users__items__picture' src={ShowLogo} /><span className='users__items__text' >Trainee</span></Link>
    </div>
  )
}

export default UsersShow;