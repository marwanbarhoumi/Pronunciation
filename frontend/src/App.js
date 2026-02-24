import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PronunciationExercise from "./pages/PronunciationExercise"; 
// ❗ إذا الملف موش في components بدّلها: "./pages/PronunciationExercise"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PronunciationExercise />} />
        <Route path="/pronunciation" element={<PronunciationExercise />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;