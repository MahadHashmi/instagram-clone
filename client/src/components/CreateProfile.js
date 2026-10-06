import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateProfile.css";

function CreateProfile({ onCreated }) {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) return setError("Username is required");
    if (username.length < 3) return setError("Username must be 3+ characters");

    try {
      const res = await axios.post("http://localhost:5000/users", {
        username: username.trim(),
        fullname: fullname.trim(),
        bio: bio.trim(),
      });
      onCreated(res.data);
      alert(`Profile "${res.data.username}" created!`);
      navigate(`/profile/${res.data.username}`);
    } catch (err) {
      setError(err.response?.data?.error || "Could not create profile");
    }
  };

  return (
    <div className="create-profile">
      <h2>Create New Profile</h2>
      <p className="subtitle">Make a new Instagram account</p>

      <form onSubmit={handleSubmit}>
        <label>Username *</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. mahad_dev"
        />

        <label>Full Name</label>
        <input
          type="text"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          placeholder="e.g. Mahad Ali"
        />

        <label>Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell the world about you..."
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Create Profile</button>
      </form>
    </div>
  );
}

export default CreateProfile;