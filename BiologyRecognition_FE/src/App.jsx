import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminPage from "./pages/AdminPage.jsx";
import SubjectsPage from "./pages/SubjectsPage";
import TopicsPage from "./pages/TopicsPage.jsx";
import ChaptersPage from "./pages/ChaptersPage";
import ArtifactsPage from "./pages/ArtifactsPage";
import ArtifactTypesPage from "./pages/ArtifactTypesPage.jsx";
import ArtifactImagesPage from "./pages/ArtifactImagesPage.jsx";
import ArticlesPage from "./pages/ArticlesPage";
import UsersPage from "./pages/UsersPage.jsx";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login.jsx";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter basename={import.meta.env.VITE_BASE_PATH}>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/chapters" element={<ChaptersPage />} />
          <Route path="/artifacts" element={<ArtifactsPage />} />
          <Route path="/artifact-types" element={<ArtifactTypesPage />} />
          <Route path="/artifact-images" element={<ArtifactImagesPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
