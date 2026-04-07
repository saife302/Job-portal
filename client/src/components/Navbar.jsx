import { assets } from "../assets/assets.js";
import { useState, useContext, useRef, useEffect } from "react";
import LoginModal from "./LoginModal.jsx";
import { AppContext } from "../context/AppContext";
import { useNavigate, Link } from "react-router-dom";

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { user, logout, setShowRecruiterLogin, companyToken } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <>
      <div className="shadow-sm py-4 bg-white sticky top-0 z-40">
        <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">

         <Link to="/" className="flex items-center gap-3">
 
  <div className="relative bg-[#1a2e4c] h-10 w-10 rounded-full flex items-center justify-center">
    <span className="text-white font-bold text-xl">H</span>
    <div className="absolute top-1 right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#1a2e4c]"></div>
  </div>
  

  <span className="text-2xl font-bold text-gray-800 tracking-tight">
    Hire<span className="text-blue-600">Hub</span>
  </span>
</Link>

          <div className="flex gap-4 sm:gap-6 items-center">
            
       
            <Link 
              to="/about" 
              className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium max-sm:hidden"
            >
              About Us
            </Link>

            
            {companyToken ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium max-sm:hidden"
              >
                Recruiter
              </button>
            ) : (
              !user && (
                <button
                  onClick={() => setShowRecruiterLogin(true)}
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Recruiter Login
                </button>
              )
            )}

           
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/applications")}
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors max-sm:hidden font-medium"
                >
                  Applied Jobs
                </button>

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(prev => !prev)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                 
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        className="w-9 h-9 rounded-full object-cover border-2 border-blue-100"
                        alt={user.name}
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-blue-600 border-2 border-blue-100 flex items-center justify-center text-white text-sm font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm text-gray-700 max-sm:hidden font-medium">
                      Hi, {user.name?.split(' ')[0]}
                    </span>
                  
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 top-12 bg-white border border-gray-100 rounded-2xl shadow-xl w-48 py-2 z-50">

                
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>

                      <button
                        onClick={() => { navigate("/profile"); setShowDropdown(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </button>

                      <button
                        onClick={() => { navigate("/applications"); setShowDropdown(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        My Applications
                      </button>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              !companyToken && (
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full hover:bg-blue-700 hover:scale-105 transition duration-300 shadow-md text-sm"
                >
                  Login
                </button>
              )
            )}

          </div>
        </div>
      </div>

      {showLogin && <LoginModal setShowLogin={setShowLogin} />}
    </>
  );
}

export default Navbar;