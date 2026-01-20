import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const linkStyle = {
    padding: "8px 14px",
    borderRadius: "6px",
    textDecoration: "none",
    color: "#333",
    fontWeight: "500",
  };

  const activeStyle = {
    backgroundColor: "#007bff",
    color: "white",
  };

  return (
    <nav
      style={{
        display: "flex",
        gap: "12px",
        marginBottom: "20px",
        padding: "10px",
        borderBottom: "2px solid #ddd",
        background: "#f9f9f9",
      }}
    >
      <NavLink
        to="/"
        style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
      >
        Home
      </NavLink>

      <NavLink
        to="/expenses"
        style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
      >
        Expenses
      </NavLink>

      <NavLink
        to="/budgets"
        style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
      >
        Budgets
      </NavLink>

      <NavLink
        to="/summary"
        style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
      >
        Summary
      </NavLink>

      <NavLink
        to="/reports"
        style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
      >
        Reports
      </NavLink>
    </nav>
  );
};

export default Navbar;
