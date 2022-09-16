import React from 'react';
import { Link } from 'react-router-dom';
import './style/batchMenu.css';

import createLogo from '../../../../assets/images/create-logo.png';
import ShowLogo from '../../../../assets/images/show-logo.png';

function BatchMenu() {


  return (
    <div className='batch-menu'>
        <Link className='batch-menu__items' to={"/batch/create"}><img className='batch-menu__items__picture' src={createLogo} /><span className='batch-menu__items__text' >Create</span></Link>
        <Link className='batch-menu__items' to={"/batch/show"}><img className='batch-menu__items__picture' src={ShowLogo} /><span className='batch-menu__items__text' >Show All</span></Link>
    </div>
  )
}

export default BatchMenu;