import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import SubjectsPage from "./pages/SubjectsPage";
import TopicsPage from "./pages/TopicsPage.jsx";
import ChaptersPage from "./pages/ChaptersPage";
import ArtifactsPage from "./pages/ArtifactsPage";
import ArtifactTypesPage from "./pages/ArtifactTypesPage.jsx";
import ArtifactMediasPage from "./pages/ArtifactMediasPage.jsx";
import ArticlesPage from "./pages/ArticlesPage";
import RecognitionsPage from "./pages/RecognitionsPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage.jsx";
import Login from "./pages/Login.jsx";
import GoogleCallback from "./pages/GoogleCallback.jsx";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter basename={import.meta.env.VITE_BASE_PATH}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="/subjects" element={
            <ProtectedRoute>
              <SubjectsPage />
            </ProtectedRoute>
          } />
          <Route path="/topics" element={
            <ProtectedRoute>
              <TopicsPage />
            </ProtectedRoute>
          } />
          <Route path="/chapters" element={
            <ProtectedRoute>
              <ChaptersPage />
            </ProtectedRoute>
          } />
          <Route path="/artifacts" element={
            <ProtectedRoute>
              <ArtifactsPage />
            </ProtectedRoute>
          } />
          <Route path="/artifact-types" element={
            <ProtectedRoute>
              <ArtifactTypesPage />
            </ProtectedRoute>
          } />
          <Route path="/artifact-medias" element={
            <ProtectedRoute>
              <ArtifactMediasPage />
            </ProtectedRoute>
          } />
          <Route path="/articles" element={
            <ProtectedRoute>
              <ArticlesPage />
            </ProtectedRoute>
          } />
          <Route path="/recognitions" element={
            <ProtectedRoute>
              <RecognitionsPage />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          } />
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
