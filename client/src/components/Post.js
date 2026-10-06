import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Post.css";

function Post({ post, refresh }) {
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(post.saved);
  const [showAllComments, setShowAllComments] = useState(false);

  const handleLike = async () => {
    await axios.post(`http://localhost:5000/like/${post.id}`);
    setLiked(true);
    refresh();
  };

  const handleSave = async () => {
    await axios.post(`http://localhost:5000/save/${post.id}`);
    setSaved(!saved);
    refresh();
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await axios.post(`http://localhost:5000/comment/${post.id}`, {
      text: comment,
    });
    setComment("");
    refresh();
  };

  const shownComments = showAllComments
    ? post.comments
    : post.comments.slice(-2);

  return (
    <div className="post">
      <div className="post-header">
        <Link to={`/profile/${post.username}`} className="post-header-link">
          <div className="avatar">
            {post.username[0].toUpperCase()}
          </div>
          <p className="post-user">{post.username}</p>
        </Link>
      </div>

      {post.mediaType === "video" ? (
        <video
          src={post.mediaUrl}
          controls
          className="post-media"
          onPlay={() => axios.post(`http://localhost:5000/view/${post.id}`)}
        />
      ) : (
        <img src={post.mediaUrl} alt="post" className="post-media" />
      )}

      <div className="post-actions">
        <span onClick={handleLike} className={liked ? "liked" : ""}>
          {liked ? "❤️" : "🤍"}
        </span>
        <span>💬</span>
        <span>📤</span>
        <span
          className="save-btn"
          onClick={handleSave}
          title={saved ? "Unsave" : "Save"}
        >
          {saved ? "🔖" : "📑"}
        </span>
      </div>

      <div className="post-body">
        <p className="likes">
          {post.likes} likes • {post.views} views
        </p>
        <p className="caption">
          <Link to={`/profile/${post.username}`} className="caption-user">
            {post.username}
          </Link>{" "}
          {post.caption}
        </p>

        {post.comments.length > 2 && !showAllComments && (
          <button
            className="view-all"
            onClick={() => setShowAllComments(true)}
          >
            View all {post.comments.length} comments
          </button>
        )}

        {shownComments.map((c, i) => (
          <p key={i} className="comment">
            <b>{c.user}</b> {c.text}
          </p>
        ))}
      </div>

      <form className="comment-form" onSubmit={handleComment}>
        <input
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit" disabled={!comment.trim()}>
          Post
        </button>
      </form>
    </div>
  );
}

export default Post;