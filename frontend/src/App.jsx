import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ArticleDetails from "./pages/ArticleDetails";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles/:id" element={<ArticleDetails />} />
      </Routes>
    </>
  );
}

function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-900 shadow py-4 px-6 flex justify-between">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        BeyondChats
      </h1>

      <DarkModeToggle />
    </nav>
  );
}

function DarkModeToggle() {
  function toggle() {
    document.documentElement.classList.toggle("dark");
  }

  return (
    <button 
      onClick={toggle}
      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm"
    >
      Dark Mode
    </button>
  );
}
