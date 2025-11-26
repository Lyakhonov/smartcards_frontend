import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", full_name: "" });
  const nav = useNavigate();

  const submit = async () => {
    await api.post("/auth/register", form);
    nav("/login");
  };

  return (
    <div className="auth">
      <h2>Регистрация</h2>
      <input placeholder="Имя" onChange={e => setForm({...form, full_name: e.target.value})} />
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
      <input type="password" placeholder="Пароль" onChange={e => setForm({...form, password: e.target.value})} />
      <button onClick={submit}>Создать</button>
      <p onClick={() => nav("/login")}>Войти</p>
    </div>
  );
}
