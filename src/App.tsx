import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import GraphView from './components/GraphView';
import LoginModal from './components/LoginModal';
import { Note, Topic, ParentNode } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'graph' | 'notes' | 'list'>('graph');
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', title: 'Introduction to ML', content: 'Machine Learning is...', topic: 'ML', parentId: 'MY_notes' },
    { id: '2', title: 'SQL Basics', content: 'SQL stands for...', topic: 'SQL', parentId: 'MY_notes' },
    { id: '3', title: 'DP Concepts', content: 'Dynamic Programming is...', topic: 'DP', parentId: 'MY_notes' },
  ]);
  const [topics, setTopics] = useState<Topic[]>([
    { id: '1', name: 'ML', color: '#ff9999' },
    { id: '2', name: 'SQL', color: '#99ff99' },
    { id: '3', name: 'DP', color: '#9999ff' },
  ]);
  const [parentNodes, setParentNodes] = useState<ParentNode[]>([
    { id: 'MY_notes' },
  ]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const addNote = (note: Note) => {
    setNotes([...notes, note]);
  };

  const updateNote = (updatedNote: Note) => {
    setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const addParentNode = (parentNode: ParentNode) => {
    setParentNodes([...parentNodes, parentNode]);
  };

  const handleLogin = (username: string, password: string) => {
    // Here you would typically make an API call to verify credentials
    // For this example, we'll just simulate a successful login
    console.log('Login attempt:', username, password);
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Note</h1>
          {isLoggedIn ? (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              onClick={() => setIsLoginModalOpen(true)}
            >
              Login
            </button>
          )}
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {activeView === 'graph' ? (
            <GraphView notes={notes} topics={topics} parentNodes={parentNodes} />
          ) : (
            <MainContent
              notes={notes}
              topics={topics}
              parentNodes={parentNodes}
              addNote={addNote}
              updateNote={updateNote}
              deleteNote={deleteNote}
              addParentNode={addParentNode}
            />
          )}
        </main>
      </div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default App;