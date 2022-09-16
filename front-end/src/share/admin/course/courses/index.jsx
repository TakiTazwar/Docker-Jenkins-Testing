import React from 'react';
import { Link } from 'react-router-dom';
import './style/course.css';

import createLogo from '../../../../assets/images/create-logo.png';
import ShowLogo from '../../../../assets/images/show-logo.png';

function Courses() {


  return (
    <div className='courses'>
        <Link className='courses__items' to={"/courses/create"}><img className='courses__items__picture' src={createLogo} /><span className='courses__items__text' >Create</span></Link>
        <Link className='courses__items' to={"/courses/show"}><img className='courses__items__picture' src={ShowLogo} /><span className='courses__items__text' >Show All</span></Link>
    </div>
  )
}

export default Courses;