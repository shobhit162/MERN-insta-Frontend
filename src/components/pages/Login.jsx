import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserProvider";
import M from "materialize-css";
import { useLoader, LoaderContext } from "../../context/LoaderProvider";
import Loader from "../Loader";

const Login = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const loader = useLoader();
  const { isLoading } = useContext(LoaderContext);

  const PostData = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "Invalid Email", classes: "#9e2020 red darken-3" });
      return;
    }
    loader.start();
    fetch(`${import.meta.env.VITE_BACKEND_URL}/signin`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          loader.stop();
          M.toast({ html: data.error, classes: "#9e2020 red darken-3" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          loader.stop();
          M.toast({
            html: "Signed in successfully",
            classes: "#368039 green darken-1",
          });
          navigate("/", { replace: true });
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
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
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
            Login
          </button>
        )}
        <h5>
          <Link to="/signup">Don't have an account?</Link>
        </h5>
        <h6>
          <Link to="/password/forgot">Forgot Password?</Link>
        </h6>
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#e8f5e9",
            borderRadius: "4px",
            color: "#2e7d32", 
            textAlign: "center",
          }}
        >
          <p style={{ margin: "0", fontWeight: "bold" }}>
            For quick login, here is the sample id and password:
          </p>
          <p style={{ margin: "0" }}>Id - ramesh@gmail.com</p>
          <p style={{ margin: "0" }}>Password - 1234</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
