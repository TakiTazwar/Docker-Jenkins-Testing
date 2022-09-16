import React from 'react';
import { Link } from 'react-router-dom';

import createLogo from '../../../../assets/images/create-logo.png';
import ShowLogo from '../../../../assets/images/show-logo.png';

import './style/userhome.css';

function UsersHome() {


  return (
    <div className='user-home'>
        <Link className='user-home__items' to={"/users/create"}><img className='user-home__items__picture' src={createLogo} /><span className='user-home__items__text' >Create</span></Link>
        <Link className='user-home__items' to={"/users/show"}><img className='user-home__items__picture' src={ShowLogo} /><span className='user-home__items__text' >Show All</span></Link>
    </div>
  )
}

export default UsersHome;