import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Dummy user data
  const user = {
    name: "Jane Doe",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Claims", path: "/claims" },
    { name: "DataUpload", path: "/dataupload" },
    { name: "AssetMap", path: "/assetmap" },
  ];

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isLinkActive = (linkPath) => {
    if (linkPath === "/") return location.pathname === "/";
    return (
      location.pathname === linkPath ||
      location.pathname.startsWith(linkPath + "/")
    );
  };

  return (
    <nav className="bg-white text-gray-800 px-4 sm:px-6 py-3 shadow-md fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Globe
            size={24}
            className="text-green-600 transform transition-transform duration-300 group-hover:rotate-12"
          />
          <span className="text-lg font-bold text-gray-900">ARANYA</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-6">
          {navLinks.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-2 py-1 text-sm font-medium transition-colors duration-300 ${
                  active
                    ? "text-green-700"
                    : "text-gray-700 hover:text-green-600"
                }`}
              >
                {link.name}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-green-600 w-full origin-left transform transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Right: Profile & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full border-2 border-green-500 transition-transform duration-300 hover:scale-105"
            />
            <span className="text-gray-800 font-medium">{user.name}</span>
          </div>

          <button
            className="sm:hidden p-2 rounded-md text-green-700 hover:bg-gray-100 transition-transform duration-200"
            onClick={() => setIsMobileMenuOpen((s) => !s)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="sm:hidden bg-white shadow-md mt-2"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map((link) => {
                const active = isLinkActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      active
                        ? "text-green-700 bg-green-50"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {link.name}
                    <span
                      className={`absolute left-3 -bottom-2 h-[2px] bg-green-600 w-[calc(100%-1.5rem)] origin-left transform transition-transform duration-300 ${
                        active ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
