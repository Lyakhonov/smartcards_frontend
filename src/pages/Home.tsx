import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const nav = useNavigate();

  const uploadFile = (file: File) => nav("/loading", { state: { file } });

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Enter" && selectedFile) {
        e.preventDefault();
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
        <h1 className="upload-title">
          Загрузите ваш PDF для создания smartcards
        </h1>

        <p className="upload-subtitle">
          Превратите документ в обучающие материалы
        </p>

        <div
          className={`upload-dropzone ${isDragging ? "dragging" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);

            const f = e.dataTransfer.files[0];
            if (f?.type === "application/pdf") setSelectedFile(f);
          }}
          onClick={() => !selectedFile && fileInputRef.current?.click()}
        >
          <div className="upload-icon">☁️</div>
          <p className="upload-text">Drag & drop</p>
          <span className="upload-browse">или кликните</span>

          <button className="upload-btn">Загрузить файл</button>

          {selectedFile && (
            <p className="upload-hint">
              ENTER для загрузки: <b>{selectedFile.name}</b>
            </p>
          )}
        </div>

        <input
          type="file"
          accept="application/pdf"
          hidden
          ref={fileInputRef}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setSelectedFile(f);
          }}
        />
      </div>
    </>
  );
}
