import React from "react";
import Calculator from "./components/calculator";
import "./App.css";
import { Route, Routes } from 'react-router'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Calculator/>} />
      </Routes>
    </div>
  );
}

export default App;

