import React from "react";
import { Link } from "react-router-dom";
import "./Stories.css";

const fakeUsers = ["alex", "sara", "john", "mia", "you"];

function Stories() {
  return (
    <div className="stories">
      {fakeUsers.map((user, i) => (
        <Link key={i} to={`/profile/${user}`} className="story">
          <div className="story-ring">
            <div className="story-inner">{user[0].toUpperCase()}</div>
          </div>
          <p>{user}</p>
        </Link>
      ))}
    </div>
  );
}

export default Stories;