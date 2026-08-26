import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import authService from "../services/authService";

function Sidebar() {
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

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClick
      );
    };
  }, []);

  function handleLogout() {
    authService.logout();

    navigate("/login", {
      replace: true,
    });
  }

  return (
    <aside className="sidebar">

      <h3>
        Menu
      </h3>

      <nav>

        <Link to="/">
          Dashboard
        </Link>

        <Link to="/vendors">
          Πωλητές
        </Link>

        {/* =================================
            MOBILE USER MENU
        ================================= */}

        <div
          className="mobile-user-menu"
          ref={menuRef}
        >

          <button
            className="mobile-user-button"
            onClick={() => setOpen(!open)}
          >

            <div className="mobile-avatar">
              {username.charAt(0).toUpperCase()}
            </div>

            <span className="mobile-arrow">
              {open ? "▲" : "▼"}
            </span>

          </button>


          {open && (
            <div className="mobile-user-dropdown">

              <div className="mobile-dropdown-user">

                <div className="mobile-dropdown-avatar">
                  {username.charAt(0).toUpperCase()}
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
                className="mobile-logout-btn"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>

            </div>
          )}

        </div>

      </nav>

    </aside>
  );
}

export default Sidebar;
