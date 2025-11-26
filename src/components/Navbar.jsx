import { NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./Navbar.css"; // создадим CSS для подсветки

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="navbar">
      <NavLink 
        to="/" 
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      >
        Главная
      </NavLink>

      <NavLink 
        to="/history" 
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      >
        История
      </NavLink>

      <button className="nav-item logout" onClick={logout}>Выйти</button>
    </nav>
  );
}
