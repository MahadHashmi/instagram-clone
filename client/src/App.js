import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Feed from "./components/Feed";
import Explore from "./components/Explore";
import Profile from "./components/Profile";
import CreateProfile from "./components/CreateProfile";

function App() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem("currentUser") || "you"
  );

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:5000/posts");
    setPosts(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);

  useEffect(() => {
    localStorage.setItem("currentUser", currentUser);
  }, [currentUser]);

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar
          currentUser={currentUser}
          users={users}
          onSwitchUser={setCurrentUser}
        />
        <div className="main-layout">
          <Sidebar
            currentUser={currentUser}
            onUpload={fetchPosts}
          />
          <Routes>
            <Route
              path="/"
              element={<Feed posts={posts} refresh={fetchPosts} />}
            />
            <Route
              path="/explore"
              element={<Explore posts={posts} refresh={fetchPosts} />}
            />
            <Route
              path="/profile/:username"
              element={
                <Profile
                  posts={posts}
                  users={users}
                  currentUser={currentUser}
                  refresh={fetchPosts}
                />
              }
            />
            <Route
              path="/create-profile"
              element={
                <CreateProfile
                  onCreated={(newUser) => {
                    fetchUsers();
                    setCurrentUser(newUser.username);
                  }}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;