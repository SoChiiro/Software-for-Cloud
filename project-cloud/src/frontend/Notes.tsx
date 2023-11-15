import { useState, useEffect } from 'react';

function Notes() {

  const [notes, setNotes] = useState([
    { id: 1, title: 'Note 1', body: 'Contenu note 1...' },
    { id: 2, title: 'Note 2', body: 'Contenu note 2...' }
  ]);

  return (
    <div style={{maxWidth: '600px', margin:'0 auto', padding:'20px'}}>
      <h1 style={{backgroundColor:'pink', textAlign:'center'}}>Mes notes</h1>
      
      <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)'}}>
        {notes.map(note => (
          <div key={note.id} style={{backgroundColor:'#f5f5f5', borderRadius:'4px', padding:'10px', margin:'5px'}}>
            <h3>{note.title}</h3> 
            <p>{note.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;