import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Settings, LogOut, FolderHeart, Clock, Plus, Box, Trash2 } from 'lucide-react';
import { googleLogout } from '@react-oauth/google';
import useDesignStore from './store/useDesignStore';
import { getUserProjects } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useDesignStore();
  const [designs, setDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If user is not logged in, they shouldn't be here
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    const fetchMyProjects = async () => {
      try {
        const result = await getUserProjects(user.email);
        if (result.status === "success") {
          setDesigns(result.projects);
        }
      } catch (error) {
        console.error("Failed to load user projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyProjects();
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    googleLogout();
    logout();
    navigate('/');
  };

  // --- DELETE FUNCTIONALITY ---
  const handleDelete = async (projectId, e) => {
    e.stopPropagation(); // Prevents the editor from opening when you click delete

    if (!window.confirm("Are you sure you want to delete this blueprint? This cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/projects/${projectId}?user_email=${user.email}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the project from the screen immediately
        setDesigns((prev) => prev.filter((d) => d.project_id !== projectId));
      } else {
        alert("Failed to delete the project.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Network error while deleting.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col">
      
      {/* Top Navigation */}
      <div className="h-16 bg-[#121212] border-b border-gray-800 flex items-center px-6 justify-between z-10 sticky top-0">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold tracking-wider text-xs md:text-sm">BACK TO HOME</span>
        </button>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button 
            onClick={handleLogout}
            className="p-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Left Sidebar - User Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="relative group">
              <img 
                src={user?.picture} 
                alt="Profile" 
                className="w-24 h-24 rounded-full border-2 border-orange-500/50 shadow-lg shadow-orange-900/20 mb-4"
              />
              <div className="absolute inset-0 rounded-full bg-orange-500/10 animate-pulse group-hover:hidden"></div>
            </div>
            <h2 className="text-xl font-bold tracking-widest text-gray-100 mb-1">
              {user?.name?.toUpperCase() || "DESIGNER"}
            </h2>
            <p className="text-sm text-orange-400 mb-6">{user?.email}</p>
            
            <div className="w-full border-t border-gray-800 pt-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 flex items-center"><FolderHeart className="w-4 h-4 mr-2 text-orange-500"/> Saved Projects</span>
                <span className="font-bold text-gray-300">{designs.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 flex items-center"><Clock className="w-4 h-4 mr-2 text-orange-500"/> Account Status</span>
                <span className="font-bold text-green-400 text-xs tracking-tighter uppercase">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Saved Designs Grid */}
        <div className="md:col-span-3">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold tracking-widest text-gray-200">MY BLUEPRINTS</h3>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold tracking-wider transition-colors text-sm shadow-lg shadow-orange-900/30"
            >
              <Plus className="w-4 h-4" />
              <span>NEW DESIGN</span>
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((skeleton) => (
                <div key={skeleton} className="h-64 bg-[#121212] border border-gray-800 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : designs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {designs.map((design, index) => (
                <div 
                  key={design._id || index} 
                  onClick={() => navigate('/editor', { state: { initialWalls: design.walls } })}
                  className="group h-64 bg-[#121212] border border-gray-800 rounded-2xl overflow-hidden hover:border-orange-500 transition-all cursor-pointer relative shadow-xl"
                >
                  
                  {/* --- DELETE BUTTON ADDED HERE --- */}
                  <button 
                    onClick={(e) => handleDelete(design.project_id, e)}
                    className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all z-20"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center group-hover:bg-gray-800 transition-colors z-0">
                    <Box className="w-12 h-12 text-gray-700 group-hover:text-orange-500 transition-colors mb-2" />
                    <span className="text-xs text-gray-500 font-mono tracking-tighter">{design.wall_count} WALLS DETECTED</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent z-10">
                    <p className="font-bold text-white text-sm tracking-widest uppercase">
                      {design.project_name || `DESIGN-${(index+1).toString().padStart(3, '0')}`}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(design.timestamp).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-[#121212] border border-dashed border-gray-800 rounded-2xl text-center">
              <FolderHeart className="w-16 h-16 text-gray-700 mb-4" />
              <p className="text-xl font-bold text-gray-400 mb-2">No designs saved yet</p>
              <p className="text-gray-600 max-w-sm px-6">
                Upload a floor plan in the editor to start building your automated 3D portfolio.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;