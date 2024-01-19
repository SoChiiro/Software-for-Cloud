// Créer le comonent UserCard

import React from 'react';
import { useState } from 'react';

function UserCard() {
  
  const [count, setCount] = useState(0);

  return (
    <div className="card" style={{width:'25%', margin:'2%', padding:'20px', backgroundColor:'lightgray' }}>
      <div className="card-body">
        <div style={{width:'100px', height:'100px', borderRadius:'50%', backgroundColor:'grey', margin:'0 auto'}}></div>
        <h5 className="card-title">User Name</h5>
        <h6 className="card-subtitle mb-2 text-muted">User Email</h6>
      </div>
    </div>
  );
}

export default UserCard;