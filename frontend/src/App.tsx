import React from 'react';
import logo from './logo.svg';
import './App.css';
import UserCard from './component/UserCard';

function App() {
  return (
    <div style={{width:"100%", height:'100%', alignContent:'center'}}>
      <h1 style={{textAlign:'center'}}>User List</h1>
    
      <div style={{display:'flex', flexDirection:'row', width:'100%', flexWrap:'wrap'}}>
        < UserCard />
        < UserCard />
        < UserCard />
        < UserCard />
        < UserCard />
        < UserCard />
      </div>
    </div>
  );
}

export default App;
