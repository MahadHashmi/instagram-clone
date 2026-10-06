import React from "react";
import Post from "./Post";
import Stories from "./Stories";
import "./Feed.css";

function Feed({ posts, refresh }) {
  return (
    <div className="feed">
      <Stories />
      {posts.length === 0 ? (
        <div className="empty">
          <h3>No posts yet</h3>
          <p>Be the first to share something!</p>
        </div>
      ) : (
        posts.map((post) => (
          <Post key={post.id} post={post} refresh={refresh} />
        ))
      )}
    </div>
  );
}

export default Feed;