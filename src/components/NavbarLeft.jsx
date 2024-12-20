import React, { useState, createContext, useContext } from 'react';
import { ChevronFirst, ChevronLast, Home, Search, File, Bell, Settings, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom'; // Importer Link pour la navigation
import logos from '../assets/logos.png';

const SidebarContext = createContext();

export default function NavbarLeft({ isLoggedIn }) {
  const [expanded, setExpanded] = useState(true); // Start expanded for easier UX
  const [activeItem, setActiveItem] = useState(null); // Track active item

  const handleItemClick = (item) => {
    setActiveItem(item); // Set the clicked item as active
  };

  return (
    <SidebarContext.Provider value={{ expanded, activeItem, handleItemClick }}>
      <aside className={`h-screen fixed left-0 top-0 z-20 transition-all duration-300 ${expanded ? 'w-64' : 'w-16'}`}>
        <nav className="h-full flex flex-col bg-white border-r shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center">
            {/* Logo that shows/expands when sidebar is expanded */}
            <img
              src={logos}
              className={`transition-all duration-300 ${expanded ? 'w-32' : 'w-0'}`}
              alt="Logo"
            />
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          {/* Border under the collapse button */}
          
          <div className="border-b border-gray-200" />

          {/* Sidebar Items */}
          <ul className="flex-1 px-3">
            <SidebarItem icon={<Home />} text="Acueil" item="home" to="/" />
            <SidebarItem icon={<Search />} text="Recherche" item="search" to="/search" />
            <SidebarItem icon={<File />} text="Fichiers" item="files" to="/files" />
            <SidebarItem icon={<MessageSquare />} text="Messages" item="messages" to="/inbox" />
            <SidebarItem icon={<Bell />} text="Notifications" item="notifications" to="/notifications" />
            <SidebarItem icon={<Settings />} text="Paramètres" item="settings" to="/settings" />
          </ul>
        </nav>
      </aside>
    </SidebarContext.Provider>
  );
}

export function SidebarItem({ icon, text, item, to }) {
  const { expanded } = useContext(SidebarContext);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    // Reset active state after a delay for a smooth fade-out effect
    setTimeout(() => {
      setIsClicked(false);
    }, 850); // Adjust this duration for longer fading
  };

  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors duration-[2000ms] ease-in-out ${
        isClicked ? 'bg-indigo-200 text-indigo-800' : 'bg-transparent hover:bg-indigo-200 text-gray-600'
      }`}
      onClick={handleClick} // Handle click to set active state temporarily
    >
      <Link to={to} className="flex items-center w-full">
        <span className={`mr-2 transition-transform duration-500 ${isClicked ? 'transform translate-y-1 animate-jiggle' : ''}`}>
          {icon}
        </span>
        <span className={`overflow-hidden transition-all duration-300 ${expanded ? 'w-52 ml-3' : 'w-0'}`}>
          {text}
        </span>
      </Link>
    </li>
  );
}
