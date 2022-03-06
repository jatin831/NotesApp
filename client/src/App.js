import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import NotesList from './components/NotesList';
import Search from './components/Search';
import Header from './components/Header';
import axios from 'axios';

const App = () => {
	const [notes, setNotes] = useState([]);

	const [searchText, setSearchText] = useState('');

	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		// const savedNotes = JSON.parse(
		// 	localStorage.getItem('react-notes-app-data')
		// );

		// if (savedNotes) {
		// 	setNotes(savedNotes);
		// }

		axios.get('http://localhost:5000/notes')
		.then(res => {
			setNotes(res.data);
		})
		.catch(err => {
			console.log(err);
		})
	}, []);

	useEffect(() => {
		localStorage.setItem(
			'react-notes-app-data',
			JSON.stringify(notes)
		);
	}, [notes]);

	const addNote = (text) => {
		axios.post('http://localhost:5000/notes', {
			text: text,
			date: new Date().toLocaleDateString()
		})
		.then(res => {
			setNotes(res.data);
		})
		.catch(err => {
			console.log(err);
		})
	};

	const deleteNote = (id) => {
		axios.delete('http://localhost:5000/notes', {
			data: {
				id: id
			}
		})
		.then(res => {
			setNotes(res.data);
		})
		.catch(err => {
			console.log(err);
		})
	};

	return (
		<div className={`${darkMode && 'dark-mode'}`}>
			<div className='container'>
				<Header handleToggleDarkMode={setDarkMode} />
				<Search handleSearchNote={setSearchText} />
				<NotesList
					notes={notes.filter((note) =>
						note.text.toLowerCase().includes(searchText.toLowerCase())
					)}
					handleAddNote={addNote}
					handleDeleteNote={deleteNote}
				/>
			</div>
		</div>
	);
};

export default App;
