import { useEffect, useState, useRef } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Navbar from "../components/Navbar";

export default function Home() {
  const [groups, setGroups] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [lastUploadedGroupId, setLastUploadedGroupId] = useState(null);

  const nav = useNavigate();
  const fileInputRef = useRef();
  const { logout } = useAuth();

  const load = async () => {
    const res = await api.get("/groups");
    setGroups(res.data);
  };

const uploadFile = async (file) => {
  if (!file) return;

  if (file.type !== "application/pdf") {
    alert("Можно загружать только PDF файлы!");
    return;
  }

  const form = new FormData();
  form.append("file", file);

  await api.post("/groups/upload", form);

  // Загружаем все группы и берём последнюю
  const res = await api.get("/groups");
  const allGroups = res.data;
  if (allGroups.length > 0) {
    const lastGroup = allGroups[allGroups.length - 1];
    setLastUploadedGroupId(lastGroup.id);
  }

  setSelectedFile(null);
};


  const onFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Можно загружать только PDF файлы!");
      return;
    }

    setSelectedFile(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Можно загружать только PDF файлы!");
      return;
    }

    setSelectedFile(file);
  };

  // ENTER → uploadFile
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Enter" && selectedFile) {
        uploadFile(selectedFile);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedFile]);

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="home">
      <Navbar />
      <h2>Your cards</h2>

      <div
        className={`dropzone ${isDragging ? "dragging" : ""}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <p>Перетащи PDF сюда или кликни чтобы выбрать</p>
        {selectedFile && <p>Нажми ENTER чтобы загрузить "{selectedFile.name}"</p>}
      </div>

      <input
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={onFileSelect}
      />

      {/* Кнопка перейти к результату */}
      {lastUploadedGroupId && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={() => nav(`/group/${lastUploadedGroupId}`)}>
            Перейти к результату
          </button>
        </div>
      )}
    </div>
  );
}
