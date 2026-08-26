import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import authService from "../services/authService";

function Navbar() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  const user = authService.getUser();

  const username = user?.username || "Χρήστης";
  const role = user?.role || "";

  useEffect(() => {
    function handleClick(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClick
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
  }, []);

  function handleLogout() {
    authService.logout();

    navigate("/login", {
      replace: true,
    });
  }

  return (
    <header className="navbar">

      <h2>
        Festival Manager
      </h2>

      <div
        className="user-menu"
        ref={menuRef}
      >

        <button
          className="user-button"
          onClick={() => setOpen(!open)}
        >

          <div className="avatar">
            {username
              .charAt(0)
              .toUpperCase()}
          </div>

          <span>
            {username}
          </span>

          <span className="arrow">
            {open ? "▲" : "▼"}
          </span>

        </button>

        {open && (
          <div className="dropdown">

            <div className="dropdown-user">

              <div className="avatar big">
                {username
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>

                <strong>
                  {username}
                </strong>

                <p>
                  {role}
                </p>

              </div>

            </div>

            <hr />

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>

          </div>
        )}

      </div>

    </header>
  );
}

export default Navbar;
