import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { logout } = useAuth();
  const nav = useNavigate();

  return (
    <header className="navbar">
      {/* Левая часть: логотип + SmartCards */}
      <div
        className="nav-left"
        onClick={() => nav("/")}
        style={{ cursor: "pointer" }}
      >
        <div className="nav-logo">⚡</div>
        <span className="nav-title">SmartCards</span>
      </div>

      {/* Ссылки рядом с логотипом */}
      <div className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Главная
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          История
        </NavLink>
      </div>

      {/* Кнопка выхода справа */}
      <div className="nav-logout">
        <button className="logout-btn" onClick={logout}>
          Выйти
        </button>
      </div>
    </header>
  );
}
