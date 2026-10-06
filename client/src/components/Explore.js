import React from "react";
import { Link } from "react-router-dom";
import "./Explore.css";

function Explore({ posts }) {
  return (
    <div className="explore">
      <h2 className="explore-title">Explore</h2>

      {posts.length === 0 ? (
        <div className="empty-explore">
          <p>No posts to explore yet.</p>
        </div>
      ) : (
        <div className="explore-grid">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/profile/${post.username}`}
              className="explore-tile"
            >
              {post.mediaType === "video" ? (
                <video src={post.mediaUrl} className="tile-media" />
              ) : (
                <img src={post.mediaUrl} alt="post" className="tile-media" />
              )}
              <div className="tile-overlay">
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments.length}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Explore;