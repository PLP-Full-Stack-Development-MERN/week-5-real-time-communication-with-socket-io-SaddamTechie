import React from "react";

export const UsersList = ({ users }) => {
  return (
    <div className="users-list">
      <h3>Online Users ({users.length})</h3>
      <ul>
        {users.map((userId) => (
          <li key={userId}>{userId}</li>
        ))}
      </ul>
    </div>
  );
};