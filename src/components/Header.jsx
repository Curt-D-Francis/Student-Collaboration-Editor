import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <nav>
      <ul className="web-header">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/document">Document</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
