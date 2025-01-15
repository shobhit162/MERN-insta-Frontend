import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import M from "materialize-css";
import { LoaderContext, useLoader } from "../../context/LoaderProvider";
import Loader from "../Loader";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const { token } = useParams();
  const loader = useLoader();
  const { isLoading } = useContext(LoaderContext);

  const PostData = () => {
    loader.start();
    fetch(`${import.meta.env.VITE_BACKEND_URL}/new-password`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        token,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
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
          type="password"
          placeholder="Enter a new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isLoading ? (
          <Loader />
        ) : (
          <button
            className="btn waves-effect waves-light #08528d blue darken-1
         "
            onClick={() => PostData()}
          >
            Update Password
          </button>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
