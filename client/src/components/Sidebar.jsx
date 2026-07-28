import { Link } from "react-router-dom";

function Sidebar() {

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


      </nav>


    </aside>

  );

}

export default Sidebar;