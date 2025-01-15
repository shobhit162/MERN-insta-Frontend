import  { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserProvider";
import { Link, Navigate } from "react-router-dom";
import { isAuthenticated } from "../../router/utils";

const SubscribedUserPosts = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
 
  useEffect(() => {
    if (isAuthenticated()) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/getsubpost`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          // console.log(result)
          setData(result.posts);
        });
    }
  }, []);

  const likePost = (id) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/like`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result)
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return { ...item, likes: result.likes };
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const unlikePost = (id) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/unlike`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result)
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return { ...item, likes: result.likes };
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/comment`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return  { ...item, comments: result.comments };
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postid) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };

  const deleteComment = (postid, commentid) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/deletecomment/${postid}/${commentid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result)
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return { ...item, comments: result.comments };
          } else {
            return item;
          }
        });
        setData(newData);
      });
  };
  
  return (!isAuthenticated() ? <Navigate to="/login" replace /> :
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card home-card" style={{borderRadius: "10px"}}  key={item._id}>
            <h5 style={{ padding: "10px 8px 3px 8px" }}>
              <Link
                to={
                  item.postedBy._id !== state._id
                    ? "/profile/" + item.postedBy._id
                    : "/profile"
                }
              >
                <div>
                  <img
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "80px",
                      float: "left",
                      margin: "0 6px 0 0",
                    }}
                    src={item.postedBy.pic}
                  />
                </div>
                {item.postedBy.name}
              </Link>{" "}
              {item.postedBy._id == state._id && (
                <i
                  className="material-icons"
                  style={{
                    float: "right",
                  }}
                  onClick={() => deletePost(item._id)}
                >
                  delete
                </i>
              )}
            </h5>
            <div className="card-image">
              <img src={item.photo} />
            </div>
            <div className="card-content">
              <i className="material-icons" style={{ color: "red" }}>
                favorite
              </i>
              {item.likes.includes(state._id) ? (
                <i
                  className="material-icons"
                  onClick={() => {
                    unlikePost(item._id);
                  }}
                >
                  thumb_down
                </i>
              ) : (
                <i
                  className="material-icons"
                  onClick={() => {
                    likePost(item._id);
                  }}
                >
                  thumb_up
                </i>
              )}

              <h6>{item.likes.length} likes</h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              {item.comments.map((record) => {
                return (
                  <h6 key={record._id}>
                    <span style={{ fontWeight: "500" }}>
                      {record.postedBy.name}
                    </span>{" "}
                    {record.text}
                    {record.postedBy._id == state._id && (
                      <i
                        className="material-icons"
                        style={{
                          float: "right",
                        }}
                        onClick={() => deleteComment(item._id, record._id)}
                      >
                        delete
                      </i>
                    )}
                  </h6>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                  e.target[0].value = "";
                }}
              >
                <input type="text" placeholder="Add a comment" />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubscribedUserPosts;
