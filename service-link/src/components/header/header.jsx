import React, { useState, useRef } from "react";
import logo from "../../assest/images.png"

const Header = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const servicesRef = useRef(null);
  const profileRef = useRef(null);

  const handleClickOutside = (event) => {
    if (servicesRef.current && !servicesRef.current.contains(event.target)) {
      setIsServicesOpen(false);
    }
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setIsProfileOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-indigo-500 text-white shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-10 w-10" />
          <span className="text-2xl font-bold">Task Manager</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6">
          <a href="/" className="hover:text-gray-300">
            Home
          </a>

          {/* Services Dropdown */}
          <div className="relative" ref={servicesRef}>
            <button
              className="hover:text-gray-300"
              onClick={() => setIsServicesOpen(!isServicesOpen)}
            >
              My Post
            </button>
            {isServicesOpen && (
              <div className="absolute bg-white text-black shadow-lg mt-2 rounded w-48 z-10">
                <a
                  href="/createpost"
                  className="flex gap-1 items-center justify-center px-4 py-2 hover:bg-gray-200 text-center truncate"
                >
                  Create Post
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="ml-2 w-5 h-5"
                  >
                    <defs>
                      <style>
                        {
                          ".cls-1{fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}"
                        }
                      </style>
                    </defs>
                    <title>78.add</title>
                    <g id="_78.add" data-name="78.add">
                      <rect
                        className="cls-1"
                        x="1"
                        y="1"
                        width="22"
                        height="22"
                        rx="3"
                        ry="3"
                      />
                      <line className="cls-1" x1="12" y1="6" x2="12" y2="18" />
                      <line className="cls-1" x1="18" y1="12" x2="6" y2="12" />
                    </g>
                  </svg>
                </a>

                <a
                  href="/viewpost"
                  className="block px-4 py-2 hover:bg-gray-200 text-center truncate"
                >
                  View Post
                </a>
                <a
                  href="/dashboard"
                  className="block px-4 py-2 hover:bg-gray-200 text-center truncate"
                >
                  Service 3
                </a>
              </div>
            )}
          </div>

          <a href="/dashboard" className="hover:text-gray-300">
            About Us
          </a>
          <a href="/dashboard" className="hover:text-gray-300">
            Contact Us
          </a>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              className="hover:text-gray-300"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                id="profile"
                height="32px"
                width="32px"
              >
                <path
                  d="M11.78,11.28A4.462,4.462,0,0,1,16,6.61a4.462,4.462,0,0,1,4.22,4.67A4.45912,4.45912,0,0,1,16,15.94,4.45912,4.45912,0,0,1,11.78,11.28ZM30.04,16a13.91894,13.91894,0,0,1-2.39,7.82,1.43134,1.43134,0,0,1-.14.2,14.01332,14.01332,0,0,1-23.02,0,1.43134,1.43134,0,0,1-.14-.2A14.03633,14.03633,0,1,1,30.04,16ZM3.46,16a12.51091,12.51091,0,0,0,1.57,6.09C7.2,19.24,11.36,17.46,16,17.46s8.8,1.78,10.97,4.63A12.543,12.543,0,1,0,3.46,16Z"
                  fill="white"
                />
              </svg>
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 bg-white text-black shadow-lg mt-2 rounded w-48 z-10">
                <a
                  href="/viewCompanyProfile"
                  className="block px-4 py-2 hover:bg-gray-200 text-center truncate"
                >
                  View Profile
                </a>
                <a
                  href="/dashboard"
                  className="block px-4 py-2 hover:bg-gray-200 text-center truncate"
                >
                  Change Password
                </a>
                <a
                  href="/dashboard"
                  className="block px-4 py-2 hover:bg-gray-200 text-center truncate"
                >
                  Logout
                </a>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
