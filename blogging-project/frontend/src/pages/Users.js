import axios from "axios";
import React, { useEffect, useState } from "react";
import UserCard from "../components/Users/UserCard";

function Users() {
  const [users, setUsers] = useState();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    } else {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/user/get-all-users`, {
          headers: {
            "X-Acciojob": token,
          },
        })
        .then((res) => {
          if (res.data.status === 200) {
            setUsers(res.data.data);
          }
        });
    }
  }, [token]);

  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "20px" }}>Users</h1>
      <div style={{ padding: "20px", display: "flex" }}>
        {users?.map((user) => (
          <UserCard userData={user} />
        ))}
      </div>
    </div>
  );
}

export default Users;
