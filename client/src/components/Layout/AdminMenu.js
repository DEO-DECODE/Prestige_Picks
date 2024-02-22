import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/AdminMenu.css";

const AdminMenu = () => {
  const [hoveredStates, setHoveredStates] = useState({
    createCategory: false,
    createProduct: false,
    products: false,
    orders: false,
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
    <div className="text-center">
      <div className="list-group dashboard-menu">
        <h4 className="logoText text-center">Admin Panel</h4>
        <Link
          to="/dashboard/admin/create-category"
          className="list-group-item list-group-item-action"
          style={linkStyles("createCategory")}
          onMouseEnter={() => handleMouseEnter("createCategory")}
          onMouseLeave={() => handleMouseLeave("createCategory")}
        >
          Create Category
        </Link>
        <Link
          to="/dashboard/admin/create-product"
          className="list-group-item list-group-item-action"
          activeClassName="active-link"
          style={linkStyles("createProduct")}
          onMouseEnter={() => handleMouseEnter("createProduct")}
          onMouseLeave={() => handleMouseLeave("createProduct")}
        >
          Create Product
        </Link>
        <Link
          to="/dashboard/admin/products"
          className="list-group-item list-group-item-action"
          activeClassName="active-link"
          style={linkStyles("products")}
          onMouseEnter={() => handleMouseEnter("products")}
          onMouseLeave={() => handleMouseLeave("products")}
        >
          Products
        </Link>
        <Link
          to="/dashboard/admin/orders"
          className="list-group-item list-group-item-action"
          activeClassName="active-link"
          style={linkStyles("orders")}
          onMouseEnter={() => handleMouseEnter("orders")}
          onMouseLeave={() => handleMouseLeave("orders")}
        >
          Orders
        </Link>
        {/* Add more links if needed */}
      </div>
    </div>
  );
};

export default AdminMenu;
