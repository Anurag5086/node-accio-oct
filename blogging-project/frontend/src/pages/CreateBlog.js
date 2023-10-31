import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

function CreateBlog() {
  const [title, setTitle] = useState();
  const [textBody, setTextBody] = useState();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    }
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const blogObj = {
      title,
      textBody,
    };

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/blog/create-blog`, blogObj, {
        headers: {
          "X-Acciojob": token,
        },
      })
      .then((res) => {
        if (res.data.status === 201) {
          window.location.href = "/my-blogs";
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div style={{ margin: "50px" }}>
      <h1 style={{ marginBottom: "20px" }}>Create Blog</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="textbody">
          <Form.Label>TextBody</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Enter Text Body"
            onChange={(e) => setTextBody(e.target.value)}
          />
        </Form.Group>
        <Button type="submit">Create Blog</Button>
      </Form>
    </div>
  );
}

export default CreateBlog;
