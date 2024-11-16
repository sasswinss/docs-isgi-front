import React, { useState, createContext } from 'react';
import { LogIn, LogOut, ChevronFirst, ChevronLast, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const SidebarContext = createContext();

export default function NavbarRight({ isLoggedIn }) {
  const [expanded, setExpanded] = useState(true); // Start expanded for easier UX

  // Function to toggle collapse/expand
  const toggleSidebar = () => setExpanded((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ expanded }}>
      <aside className={`h-screen fixed right-0 top-0 z-20 transition-all duration-300 ${expanded ? 'w-64' : 'w-16'}`}>
        <nav className="h-full flex flex-col bg-white border-l shadow-lg">
          <div className="p-4 pb-2 flex justify-between items-center">
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              {expanded ? <ChevronLast /> : <ChevronFirst />}
            </button>
          </div>

          {/* Border under the collapse button */}
          <div className="border-b border-gray-200" />

          {isLoggedIn ? (
            <>
              {/* Profile Section */}
              <Link to="/profile">
                <div className="flex items-center p-3 hover:bg-[#A7F3D0] transition duration-200 ease-in-out cursor-pointer">
                  <img
                    src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  {expanded && (
                    <div className="ml-3">
                      <h4 className="font-semibold text-gray-900">John Doe</h4>
                      <span className="text-sm text-gray-600">johndoe@gmail.com</span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Friend Section */}
              <Link to="/friends">
                <SidebarItem
                  icon={<Users size={20} />}
                  text="Friends"
                  expanded={expanded}
                />
              </Link>

              {/* Logout Section */}
              <SidebarItem
                icon={<LogOut size={20} />}
                text="Logout"
                expanded={expanded}
                onClick={() => console.log('Logging out...')}
              />
            </>
          ) : (
            <Link to="/login">
              <SidebarItem
                icon={<LogIn size={20} />}
                text="Login"
                expanded={expanded}
              />
            </Link>
          )}
        </nav>
      </aside>
    </SidebarContext.Provider>
  );
}

function SidebarItem({ icon, text, expanded, onClick }) {
  return (
    <div
      className={`w-full flex items-center p-3 hover:bg-[#A7F3D0] transition duration-200 ease-in-out cursor-pointer ${expanded ? '' : 'justify-center'}`}
      onClick={onClick}
    >
      <span className="mr-2">{icon}</span>
      {expanded && <span className="flex-1">{text}</span>}
    </div>
  );
}
