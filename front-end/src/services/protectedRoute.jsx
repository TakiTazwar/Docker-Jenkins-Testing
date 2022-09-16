import React, { useEffect, useRef, useState } from 'react';
import jwt from 'jwt-decode';

import './style/protectedRoute.css';
function ProtectedRoute({children}) {
  const [userType,setUserType]=useState("none");
  const firstUpdate = useRef(true);
  
  useEffect(_=>{
      if (firstUpdate.current) 
      {
          firstUpdate.current = false;
          return;
      }
      let token=localStorage.getItem("access_token");
      if(token)
      {
        token=jwt(token);
        setUserType(token.userType);
      }

    },[]);
  return (
    <div>
        {userType=="admin"?children:<div className="unauthorized"><h1 className="unauthorized__title">You are not authorized here</h1></div>}
    </div>
  )
}

export default ProtectedRoute;