import React, { useState } from 'react';
import { Note, Topic, ParentNode } from '../types';

interface MainContentProps {
  notes: Note[];
  topics: Topic[];
  parentNodes: ParentNode[];
  addNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  addParentNode: (parentNode: ParentNode) => void;
}

const MainContent: React.FC<MainContentProps> = ({ 
  notes, 
  topics, 
  parentNodes, 
  addNote, 
  updateNote, 
  deleteNote, 
  addParentNode 
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedParent, setSelectedParent] = useState<string>("MY_notes");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newParentName, setNewParentName] = useState<string>('');

  const filteredNotes = selectedTopic 
    ? notes.filter(note => note.topic === selectedTopic && note.parentId === selectedParent)
    : notes.filter(note => note.parentId === selectedParent);

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      topic: selectedTopic || topics[0].name,
      parentId: selectedParent,
    };
    addNote(newNote);
    setEditingNote(newNote);
  };

  const handleAddParentNode = () => {
    if (newParentName) {
      const newParent: ParentNode = {
        id: newParentName,
      };
      addParentNode(newParent);
      setNewParentName('');
      setSelectedParent(newParent.id);
    }
  };

  const handleUpdateNote = () => {
    if (editingNote) {
      updateNote(editingNote);
      setEditingNote(null);
    }
  };

  return (
    <div className="flex">
      <div className="w-1/4 pr-4">
        <h2 className="text-xl font-semibold mb-4">Parent Nodes</h2>
        <div className="space-y-2">
          {parentNodes.map(parent => (
            <button
              key={parent.id}
              className={`w-full text-left p-2 rounded ${selectedParent === parent.id ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'}`}
              onClick={() => setSelectedParent(parent.id)}
            >
              {parent.id}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <input
            type="text"
            placeholder="New parent node name"
            value={newParentName}
            onChange={(e) => setNewParentName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddParentNode}
          >
            Add Parent Node
          </button>
        </div>
        <h2 className="text-xl font-semibold my-4">Topics</h2>
        <div className="space-y-2">
          {topics.map(topic => (
            <button
              key={topic.id}
              className={`w-full text-left p-2 rounded ${selectedTopic === topic.name ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'}`}
              onClick={() => setSelectedTopic(topic.name)}
            >
              {topic.name}
            </button>
          ))}
        </div>
        <button
          className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleAddNote}
        >
          Add Note
        </button>
      </div>
      <div className="w-3/4">
        {editingNote ? (
          <div className="bg-white p-4 rounded shadow">
            <input
              className="w-full mb-2 p-2 border rounded"
              value={editingNote.title}
              onChange={e => setEditingNote({ ...editingNote, title: e.target.value })}
            />
            <textarea
              className="w-full h-40 p-2 border rounded"
              value={editingNote.content}
              onChange={e => setEditingNote({ ...editingNote, content: e.target.value })}
            />
            <div className="mt-2">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handleUpdateNote}
              >
                Save
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={() => setEditingNote(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredNotes.map(note => (
              <div key={note.id} className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
                <p className="text-gray-600 mb-4">{note.content.substring(0, 100)}...</p>
                <div>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded mr-2"
                    onClick={() => setEditingNote(note)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                    onClick={() => deleteNote(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;