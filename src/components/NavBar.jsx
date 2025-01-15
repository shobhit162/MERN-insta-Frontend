import { useContext, useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserProvider";
import M from "materialize-css";
import { isAuthenticated } from "../router/utils";
import { LoaderContext, useLoader } from "../context/LoaderProvider";
import Loader from "./Loader";

const NavBar = () => {
  const searchModal = useRef(null);
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const loader = useLoader();
  const { isLoading } = useContext(LoaderContext);

  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    if (debouncedQuery) {
      fetchUsers(debouncedQuery);
    } else {
      setUserDetails([]);
    }
  }, [debouncedQuery]);

  const renderList = () => {
    if (state) {
      return [
        <li key="1">
          <i
            data-target="modal1"
            className="large material-icons modal-trigger"
            style={{ color: "black" }}
          >
            search
          </i>
        </li>,
        <li key="2">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="3">
          <Link to="/create">Create Post</Link>
        </li>,
        <li key="4">
          <Link to="/myfollowingpost">My following Posts</Link>
        </li>,
        <li key="5">
          <button
            className="btn #9e2020 red darken-3"
            style={{ marginRight: "10px" }}
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              navigate("/login", { replace: true });
            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="6">
          <Link to="/login">Login</Link>
        </li>,
        <li key="7">
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };

  const fetchUsers = (query) => {
    setSearch(query);
    loader.start();
    fetch(`${import.meta.env.VITE_BACKEND_URL}/search-users`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        loader.stop();
        setUserDetails(results.user);
      });
  };

  return (
    <nav>
      <div className="nav-wrapper white">
        <Link
          to={state ? "/" : "/login"}
          style={{ marginLeft: "10px" }}
          className="brand-logo left"
        >
          Instagram
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
      {isAuthenticated() && (
        <div
          id="modal1"
          className="modal"
          ref={searchModal}
          style={{ color: "black" }}
        >
          <div className="modal-content">
            <input
              type="text"
              placeholder="Search Users"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {isLoading ? (
              <Loader />
            ) : (
              <ul className="collection">
                {userDetails.map((item) => {
                  return (
                    <Link
                      to={
                        item._id !== state._id
                          ? "/profile/" + item._id
                          : "/profile"
                      }
                      key={item._id}
                      onClick={() => {
                        M.Modal.getInstance(searchModal.current).close();
                        setSearch("");
                      }}
                    >
                      <li className="collection-item">{item.email}</li>
                    </Link>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="modal-footer">
            <button
              className="modal-close waves-effect waves-green btn-flat"
              onClick={() => setSearch("")}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
