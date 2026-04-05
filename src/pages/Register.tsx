import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useSEOHead, useJsonLd } from "../seo/head";

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

  // SEO: Установка мета-тегов
  useSEOHead({
    title: "Регистрация - SmartCards",
    description:
      "Создайте аккаунт SmartCards и начните создавать умные флеш-карточки прямо сейчас.",
  });

  // SEO: JSON-LD Schema
  useJsonLd({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Регистрация в SmartCards",
    description: "Страница регистрации новых пользователей SmartCards",
  });

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
      <div className="logo" aria-hidden="true">
        👤
      </div>

      <h1 className="title">Создайте аккаунт</h1>
      <p className="subtitle">Присоединитесь к нам</p>

      <div className="auth-card">
        <label htmlFor="fullname-input">Полное имя</label>
        <input
          id="fullname-input"
          value={form.full_name}
          onChange={(e) =>
            setForm({
              ...form,
              full_name: e.target.value,
            })
          }
          required
          aria-label="Полное имя"
        />

        <label htmlFor="email-input">Email</label>
        <input
          id="email-input"
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
          required
          aria-label="Email адрес"
        />

        <label htmlFor="password-input">Пароль</label>
        <input
          id="password-input"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
          required
          aria-label="Пароль"
        />

        <label htmlFor="password-confirm-input">Подтвердите пароль</label>
        <input
          id="password-confirm-input"
          type="password"
          placeholder="Повторите пароль"
          value={form.password2}
          onChange={(e) =>
            setForm({
              ...form,
              password2: e.target.value,
            })
          }
          required
          aria-label="Подтверждение пароля"
        />

        <button onClick={submit} type="submit">
          Зарегистрироваться
        </button>

        <div className="register-text">
          Уже есть аккаунт?{" "}
          <span
            onClick={() => nav("/login")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") nav("/login");
            }}
          >
            Войти
          </span>
        </div>
      </div>
    </div>
  );
}
