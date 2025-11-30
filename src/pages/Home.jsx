import { useEffect, useState, useRef } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../AuthContext";

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();
  const nav = useNavigate();

  const onFileSelect = (e) => {
    let file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Можно загружать только PDF");
      return;
    }
    setSelectedFile(file);
  };

const uploadFile = (file) => {
  nav("/loading", { state: { file } });
};



useEffect(() => {
  const key = (e) => {
    if (e.key === "Enter" && selectedFile) {
      e.preventDefault();     // ❗ запрещаем стандартную реакцию браузера
      uploadFile(selectedFile);
    }
  };

  window.addEventListener("keydown", key);
  return () => window.removeEventListener("keydown", key);
}, [selectedFile]);

  return (
    <>
      <Navbar />

      <div className="upload-container">
        <h1 className="upload-title">Загрузите ваш PDF для создания smartcards</h1>
        <p className="upload-subtitle">
          Превартите ваш документ в интерактивные обучающие материалы
        </p>

        <div
          className={`upload-dropzone ${isDragging ? "dragging" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file.type === "application/pdf") setSelectedFile(file);
          }}
          onClick={() => {
  if (!selectedFile) fileInputRef.current.click();
}}

        >
          <div className="upload-icon">☁️</div>
          <p className="upload-text">Drag & drop</p>
          <span className="upload-browse">или кликните для выбора файла</span>

          <button className="upload-btn">
            Загрузить файл
          </button>

          {selectedFile && (
            <p className="upload-hint">
              Нажмите ENTER для загрузки: <b>{selectedFile.name}</b>
            </p>
          )}
        </div>

        <input
          type="file"
          accept="application/pdf"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={onFileSelect}
        />

        {/* нижние три иконки */}
        <div className="upload-features">
          <div className="feature">
            <div className="feature-icon">📄</div>
            <h3>Поддержка PDF</h3>
            <p>Извлекает текст из любого PDF-файла</p>
          </div>

          <div className="feature">
            <div className="feature-icon">✨</div>
            <h3>Используется ИИ</h3>
            <p>Генерация smartcards</p>
          </div>

          <div className="feature">
            <div className="feature-icon">⚡</div>
            <h3>Быстрый Результат</h3>
            <p>Получите smartcards быстро</p>
          </div>
        </div>
      </div>
    </>
  );
}
