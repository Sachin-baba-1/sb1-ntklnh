import React from 'react';
import { Network, FileText, List } from 'lucide-react';

interface SidebarProps {
  activeView: 'graph' | 'notes' | 'list';
  setActiveView: (view: 'graph' | 'notes' | 'list') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const menuItems = [
    { icon: Network, label: 'Graph', view: 'graph' },
    { icon: FileText, label: 'Notes', view: 'notes' },
    { icon: List, label: 'List Note', view: 'list' },
  ] as const;

  return (
    <div className="bg-gray-900 text-white w-16 flex flex-col items-center py-4">
      {menuItems.map(({ icon: Icon, label, view }) => (
        <button
          key={view}
          className={`p-2 mb-4 rounded-full ${activeView === view ? 'bg-blue-500' : 'hover:bg-gray-700'}`}
          onClick={() => setActiveView(view)}
          title={label}
        >
          <Icon size={24} />
        </button>
      ))}
    </div>
  );
};

export default Sidebar;