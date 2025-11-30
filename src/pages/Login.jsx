import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();
  const { login } = useAuth();

  const submit = async () => {
    setLoading(true);

    const form = new FormData();
    form.append("username", email);
    form.append("password", password);

    try {
      const res = await api.post("/auth/login", form);
      login(res.data.access_token);
      nav("/");
    } catch (err) {
      console.error(err);
      alert("Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="logo">⚡</div>
      <h1 className="title">SmartCards</h1>
      <p className="subtitle">Рады снова видеть вас</p>

      <div className="auth-card">
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Введите ваш email"
        />

        <label>Пароль</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Введите ваш пароль"
        />

        <button onClick={submit} disabled={loading}>
          {loading ? "Загрузка..." : "Войти"}
        </button>

        <div className="register-text">
          Ещё нет аккауната?{" "}
          <span onClick={() => nav("/register")}>Зарегистрироваться</span>
        </div>
      </div>
    </div>
  );
}
