import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {
    const [notesList, setNotesList] = useState([]);

    function addNote(newNote) {
        setNotesList((prevNotes) => {
            return [...prevNotes, newNote];
        });
    }

    function deleteNote(id) {
        setNotesList((prevNotes) => {
            return prevNotes.filter((item, index) => {
                return index !== id;
            });
        });
    }


    return (
        <div>
            <Header></Header>
            <CreateArea onAdd={addNote}></CreateArea>

            {notesList.map((noteItem, index) => {
                return <Note
                    key={index}
                    id={index}
                    title={noteItem.title}
                    content={noteItem.content}
                    onDelete={deleteNote}
                />
            })}

            <Footer></Footer>
        </div>
    );
}

export default App;



{/* {notes.map((note) => (
        <Note
        key={note.key}
        title={note.title}
        content={(note.content).substring(0, 50) + "..."}
        ></Note>
    ))} */}