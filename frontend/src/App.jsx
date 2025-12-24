import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import ArticleDetails from "./pages/ArticleDetails";
import { useState } from "react";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:id" element={<ArticleDetails />} />
            <Route path="/articles/:id" element={<ArticleDetails />} />
          </Routes>
        </div>
      </main>
    </>
  );
}


/* ================= NAVBAR ================= */
function Navbar() {
  const [open, setOpen] = useState(false);

  function toggleDark() {
    document.documentElement.classList.toggle("dark");
  }

  return (
    <header className="sticky top-0 z-50 border-b dark:border-gray-800 bg-white dark:bg-gray-900">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4">
        
        {/* Logo */}
        <NavLink to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          BeyondChats
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-medium ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-700 dark:text-gray-300 hover:text-indigo-500"
              }`
            }
          >
            Home
          </NavLink>

          <button
            onClick={toggleDark}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm"
          >
            Toggle Dark
          </button>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-900 dark:text-white"
        >
          {open ? "✖" : "☰"}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="px-4 py-3 space-y-3">
            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block font-medium ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-700 dark:text-gray-300"
                }`
              }
            >
              Home
            </NavLink>

            <button
              onClick={() => {
                toggleDark();
                setOpen(false);
              }}
              className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-sm"
            >
              Toggle Dark
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
