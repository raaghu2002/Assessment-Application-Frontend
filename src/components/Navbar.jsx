import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  
  const links = [
    { name: "Why WizzyBox", href: "#why" },
    { name: "Career", href: "#career" },
    { name: "Contact Us", href: "#contact" },
    { name: "About Us", href: "#about" },
  ];

  return (
    <header className="w-full bg-[#0f2027] text-white font-poppins shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/images/wizzybox-logo.png" alt="WizzyBox" className="h-10 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-200 hover:text-white transition"
            >
              {link.name}
            </a>
          ))}
         {isLoggedIn && profileImage ? (
  <Link to="/profile" className="ml-4">
    <img
      src={profileImage}
      alt="Profile"
      className="h-8 w-8 rounded-full object-cover border-2 border-white"
    />
  </Link>
) : (
  <Link
    to="/login"
    className="ml-4 px-4 py-2 bg-white text-[#0f2027] rounded-md text-sm font-semibold hover:bg-gray-100 transition"
  >
    Login
  </Link>
)}

        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white p-1 rounded-md focus:outline-none"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 pt-2 space-y-2 bg-[#0f2027] border-t border-gray-700">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-medium text-gray-200 hover:text-white transition"
            >
              {link.name}
            </a>
          ))}
          {isLoggedIn ? (
  <button
    onClick={() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setProfileImage(null);
      setMenuOpen(false);
      window.location.href = "/login"; // or use navigate if using react-router
    }}
    className="inline-block mt-2 px-4 py-2 bg-white text-[#0f2027] rounded-md text-sm font-semibold hover:bg-gray-100 transition"
  >
    Logout
  </button>
) : (
  <Link
    to="/login"
    onClick={() => setMenuOpen(false)}
    className="inline-block mt-2 px-4 py-2 bg-white text-[#0f2027] rounded-md text-sm font-semibold hover:bg-gray-100 transition"
  >
    Login
  </Link>
)}

        </div>
      )}
    </header>
  );
};

export default Navbar;
