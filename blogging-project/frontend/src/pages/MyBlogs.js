import axios from "axios";
import React, { useEffect, useState } from "react";
import BlogCard from "../components/Blogs/BlogCard";

function MyBlogs() {
  const [myBlogs, setMyBlogs] = useState();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    } else {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/blog/get-user-blogs`, {
          headers: {
            "X-Acciojob": token,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            console.log(res);
            setMyBlogs(res.data.data);
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
  }, [token]);

  return (
    <div>
      <h1 style={{ margin: "30px" }}>My Blogs</h1>
      {myBlogs?.map((blog) => (
        <BlogCard blogData={blog} />
      ))}
    </div>
  );
}

export default MyBlogs;
