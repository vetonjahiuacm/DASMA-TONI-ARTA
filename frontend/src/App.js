import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Admin from "./pages/Admin";

import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App paper-bg">
      <BrowserRouter basename="/DASMA-TONI-ARTA">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>

      <Toaster position="top-center" />
    </div>
  );
}

export default App;
