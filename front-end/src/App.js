import React,{ useState } from 'react';
import './App.css';
import Main from './views/main/index';
import UserTypeValue from "./services/contextApi/ThemeContext";

function App() {
  const [userHeader,setUserHeader]=useState("none");
  return (
    <main className="App">
      <UserTypeValue.Provider value={{userHeader,setUserHeader}}>
        <Main />
      </UserTypeValue.Provider>
    </main>
  );
}

export default App;
