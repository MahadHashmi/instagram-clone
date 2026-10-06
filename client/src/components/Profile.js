import React from "react";
import { useParams, Link } from "react-router-dom";
import "./Profile.css";

function Profile({ posts, users, currentUser }) {
  const { username } = useParams();
  const user = users.find((u) => u.username === username);

  const userPosts = posts.filter((p) => p.username === username);
  const totalLikes = userPosts.reduce((sum, p) => sum + p.likes, 0);
  const isOwn = username === currentUser;

  if (!user) {
    return (
      <div className="profile-page">
        <div className="not-found">
          <h2>User not found</h2>
          <Link to="/create-profile">Create this profile</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar-big">
          {username[0].toUpperCase()}
        </div>

        <div className="profile-info">
          <div className="username-row">
            <h2 className="profile-username">{username}</h2>
            {isOwn && <span className="you-badge">You</span>}
          </div>

          <div className="profile-stats">
            <span><b>{userPosts.length}</b> posts</span>
            <span><b>0</b> followers</span>
            <span><b>0</b> following</span>
          </div>

          <p className="profile-fullname">{user.fullname}</p>
          <p className="profile-bio">{user.bio || "No bio yet"}</p>
          <p className="profile-likes">❤️ {totalLikes} total likes</p>
        </div>
      </div>

      <div className="profile-tabs">
        <div className="tab active">POSTS</div>
      </div>

      {userPosts.length === 0 ? (
        <div className="empty-profile">
          <p>No posts yet</p>
        </div>
      ) : (
        <div className="profile-grid">
          {userPosts.map((post) => (
            <div key={post.id} className="profile-tile">
              {post.mediaType === "video" ? (
                <video src={post.mediaUrl} className="tile-media" />
              ) : (
                <img src={post.mediaUrl} alt="post" className="tile-media" />
              )}
              <div className="tile-overlay">
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments.length}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;