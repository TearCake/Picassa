import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import "./index.css";
{/*import HomePage from "./routes/homepage/homepage.jsx";
import CreatePage from "./routes/createPage/createPage.jsx";
import PostPage from "./routes/postpage/postpage.jsx";
import AuthPage from "./routes/authPage/authPage.jsx";
import ProfilePage from "./routes/profilePage/profilePage.jsx";
import SearchPage from "./routes/searchPage/searchPage.jsx";*/}
const HomePage = React.lazy(() => import("./routes/homepage/homepage.jsx"));
const CreatePage = React.lazy(() => import("./routes/createPage/createPage.jsx"));
const PostPage = React.lazy(() => import("./routes/postpage/postpage.jsx"));
const AuthPage = React.lazy(() => import("./routes/authPage/authPage.jsx"));
const ProfilePage = React.lazy(() => import("./routes/profilePage/profilePage.jsx"));
const SearchPage = React.lazy(() => import("./routes/searchPage/searchPage.jsx"));

import MainLayout from "./routes/layouts/mainLayout.jsx";



TimeAgo.addDefaultLocale(en);

const queryClient = new QueryClient()

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/pin/:id" element={<PostPage />} />
            <Route path="/:username" element={<ProfilePage />} />
            <Route path="/search" element={<SearchPage />} />
          </Route>
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
