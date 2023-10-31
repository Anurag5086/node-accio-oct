import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function UserCard({ userData }) {
  const token = localStorage.getItem("token");

  const handleFollow = (userId) => {
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/follow/follow-user`,
        {
          followingUserId: userId,
        },
        {
          headers: {
            "X-Acciojob": token,
          },
        }
      )
      .then((res) => {
        if (res.data.status === 200) {
          alert(res.data.message);
          window.location.reload();
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleUnfollow = (userId) => {
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/follow/unfollow-user`,
        {
          followingUserId: userId,
        },
        {
          headers: {
            "X-Acciojob": token,
          },
        }
      )
      .then((res) => {
        if (res.data.status === 200) {
          alert(res.data.message);
          window.location.reload();
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <Card style={{ width: "18rem", marginRight: "20px" }}>
      <Card.Body>
        <Card.Title>{userData.name}</Card.Title>
        <Card.Text>{userData.username}</Card.Text>
        <Card.Text>{userData.email}</Card.Text>

        {userData.follow ? (
          <>
            <Button
              variant="danger"
              onClick={() => handleUnfollow(userData._id)}
            >
              Unfollow
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => handleFollow(userData._id)}>
            Follow
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default UserCard;
