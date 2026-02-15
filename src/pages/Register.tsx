import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

type Form = {
  full_name: string;
  email: string;
  password: string;
  password2: string;
};

export default function Register() {
  const [form, setForm] = useState<Form>({
    full_name: "",
    email: "",
    password: "",
    password2: "",
  });

  const nav = useNavigate();

  const submit = async () => {
    if (form.password !== form.password2) {
      alert("Пароли не совпадают");
      return;
    }

    await api.post("/auth/register", {
      full_name: form.full_name,
      email: form.email,
      password: form.password,
    });

    nav("/login");
  };

  return (
    <div className="login-page">
      <div className="logo">👤</div>

      <h1 className="title">Создайте аккаунт</h1>
      <p className="subtitle">Присоединитесь к нам</p>

      <div className="auth-card">
        <label>Полное имя</label>
        <input
          value={form.full_name}
          onChange={(e) =>
            setForm({
              ...form,
              full_name: e.target.value,
            })
          }
        />

        <label>Email</label>
        <input
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <label>Пароль</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Повторите пароль"
          value={form.password2}
          onChange={(e) =>
            setForm({
              ...form,
              password2: e.target.value,
            })
          }
        />

        <button onClick={submit}>Зарегистрироваться</button>

        <div className="register-text">
          Уже есть аккаунт? <span onClick={() => nav("/login")}>Войти</span>
        </div>
      </div>
    </div>
  );
}
