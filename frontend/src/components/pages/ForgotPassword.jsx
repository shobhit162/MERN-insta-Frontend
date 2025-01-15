import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import M from "materialize-css";
import { LoaderContext, useLoader } from "../../context/LoaderProvider";
import Loader from "../Loader";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const loader = useLoader();
  const { isLoading } = useContext(LoaderContext);

  const PostData = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "invalid email", classes: "#9e2020 red darken-3" });
      return;
    }
    loader.start();
    fetch(`${import.meta.env.VITE_BACKEND_URL}/reset-password`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          loader.stop();
          M.toast({ html: data.error, classes: "#9e2020 red darken-3" });
        } else {
          loader.stop();
          M.toast({ html: data.message, classes: "#368039 green darken-1" });
          navigate("/login");
        }
      })
      .catch((err) => {
        loader.stop();
        console.log(err);
      });
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {isLoading ? (
          <Loader />
        ) : (
          <button
            className="btn waves-effect waves-light #08528d blue darken-1"
            onClick={() => PostData()}
          >
            Reset Password
          </button>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
