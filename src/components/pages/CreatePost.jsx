import { useState, useEffect, useContext } from "react";
import M from "materialize-css";
import { useNavigate } from "react-router-dom";
import { LoaderContext, useLoader } from "../../context/LoaderProvider";
import Loader from "../Loader";

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const loader = useLoader();
  const { isLoading } = useContext(LoaderContext);

  useEffect(() => {
    if (url) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/createpost`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            loader.stop();
            M.toast({ html: data.error, classes: "#9e2020 red darken-3" });
          } else {
            loader.stop();
            M.toast({
              html: "Created post successfully",
              classes: "#368039 green darken-1",
            });
            navigate("/");
          }
        })
        .catch((err) => {
          loader.stop();
          console.log(err);
        });
    }
  }, [url]);

  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "meracloud16");
    loader.start();
    fetch("	https://api.cloudinary.com/v1_1/meracloud16/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => {
        loader.stop();
        console.log(err);
      });
  };

  return (
    <div
      className="card input-filed"
      style={{
        margin: "30px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn #08528d blue darken-1">
          <span>Upload Image</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <button
          className="btn waves-effect waves-light #08528d blue darken-1
         "
          onClick={() => postDetails()}
        >
          Submit Post
        </button>
      )}
    </div>
  );
};

export default CreatePost;
