import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();
  const { login } = useAuth();       // ← ПРОПИСЫВАЕМ ГЛАВНОЕ

  const submit = async () => {
    setLoading(true);

    const form = new FormData();
    form.append("username", email);
    form.append("password", password);

    try {
      const res = await api.post("/auth/login", form);
      login(res.data.access_token);   // ← обновляет контекст
      nav("/");                       // ← работает без перезагрузки
    } catch (err) {
      console.error(err);
      alert("Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <h2>Вход</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={submit} disabled={loading}>{loading ? "Loading..." : "Войти"}</button>
      <p onClick={() => nav("/register")}>Зарегистрироваться</p>
    </div>
  );
}
