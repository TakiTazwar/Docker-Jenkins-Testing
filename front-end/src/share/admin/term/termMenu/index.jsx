import React from 'react';
import { Link } from 'react-router-dom';

import createLogo from '../../../../assets/images/create-logo.png';
import ShowLogo from '../../../../assets/images/show-logo.png';

import './style/termmenu.css'

function TermMenu() {


  return (
    <div className='term-menu'>
        <Link className='term-menu__items' to={"/term/create"}><img className='term-menu__items__picture' src={createLogo} /><span className='term-menu__items__text' >Create</span></Link>
        <Link className='term-menu__items' to={"/term/show"}><img className='term-menu__items__picture' src={ShowLogo} /><span className='term-menu__items__text' >Show All</span></Link>
    </div>
  )
}

export default TermMenu;