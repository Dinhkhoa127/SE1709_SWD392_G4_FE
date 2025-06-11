import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import AdminPage from './pages/AdminPage.jsx';
import SubjectsPage from "./pages/SubjectsPage";
import ChaptersPage from "./pages/ChaptersPage";
import ArtifactsPage from "./pages/ArtifactsPage";
import ArticlesPage from "./pages/ArticlesPage";
import SettingsPage from "./pages/SettingsPage";
import Login from './pages/Login.jsx';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <BrowserRouter>
      <Routes>
         <Route path="/" element={<AdminPage />} /> 
          <Route path="/login" element={<Login />} /> 
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/chapters" element={<ChaptersPage />} />
          <Route path="/artifacts" element={<ArtifactsPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
