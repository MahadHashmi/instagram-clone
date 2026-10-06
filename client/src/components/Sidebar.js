import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ currentUser, onUpload }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setPreviewType(f.type.startsWith("video") ? "video" : "image");
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image or video!");

    setUploading(true);
    const formData = new FormData();
    formData.append("media", file);
    formData.append("caption", caption);
    formData.append("username", currentUser);

    try {
      await axios.post("http://localhost:5000/upload", formData);
      setFile(null);
      setCaption("");
      setPreview(null);
      setPreviewType(null);
      onUpload();
    } catch (err) {
      alert("Upload failed: " + err.message);
    }
    setUploading(false);
  };

  return (
    <div className="sidebar">
      <Link to={`/profile/${currentUser}`} className="profile-link">
        <div className="profile">
          <div className="profile-pic">
            {currentUser[0].toUpperCase()}
          </div>
          <div>
            <p className="username">{currentUser}</p>
            <p className="fullname">View profile →</p>
          </div>
        </div>
      </Link>

      <div className="upload-box">
        <h3>📤 Create Post</h3>

        <label className="file-label">
          {file ? "Change file" : "Choose photo or video"}
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFile}
            style={{ display: "none" }}
          />
        </label>

        {preview && previewType === "image" && (
          <img src={preview} alt="preview" className="preview" />
        )}
        {preview && previewType === "video" && (
          <video src={preview} controls className="preview" />
        )}

        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Share"}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;