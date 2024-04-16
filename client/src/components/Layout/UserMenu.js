import React , { useState } from "react";
import { Link } from "react-router-dom";
const UserMenu = () => {
  const [hoveredStates, setHoveredStates] = useState({
    Profile: false,
    Orders: false,
  });

  const handleMouseEnter = (linkName) => {
    setHoveredStates((prevState) => ({
      ...prevState,
      [linkName]: true,
    }));
  };
  const handleMouseLeave = (linkName) => {
    setHoveredStates((prevState) => ({
      ...prevState,
      [linkName]: false,
    }));
  };
  const linkStyles = (linkName) => ({
    textDecoration: "none",
    color: hoveredStates[linkName] ? "black" : "black",
    backgroundColor: hoveredStates[linkName] ? "#fbb72c" : "#fff",
    fontWeight: hoveredStates[linkName] ? "bold" : "normal",
  });
  return (
    <div>
      <div className="text-center dashboard-menu">
        <div className="list-group">
          <h4 className="logoText">Dashboard</h4>
          <Link
            to="/dashboard/user/profile"
            className="list-group-item list-group-item-action"
            style={linkStyles("Profile")}
            onMouseEnter={() => handleMouseEnter("Profile")}
            onMouseLeave={() => handleMouseLeave("Profile")}
          >
            Profile
          </Link>
          <Link
            to="/dashboard/user/orders"
            className="list-group-item list-group-item-action"
            style={linkStyles("Orders")}
            onMouseEnter={() => handleMouseEnter("Orders")}
            onMouseLeave={() => handleMouseLeave("Orders")}
          >
            Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
