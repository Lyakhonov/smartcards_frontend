import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";

export default function Loading() {
  const nav = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (!state?.file) {
      nav("/");
      return;
    }

    const upload = async () => {
      try {
        const form = new FormData();
        form.append("file", state.file);

        const res = await api.post("/groups/upload", form);

        const groupId = res.data?.group_id;
        if (!groupId) throw new Error("No group_id");

        nav(`/group/${groupId}`);
      } catch (err) {
        alert("Ошибка загрузки файла");
        nav("/");
      }
    };

    upload();
  }, [state, nav]);

  return (
    <>
        <Navbar />
        
        <div className="loading-page">
        <div className="loading-card">
            <div className="loading-logo">⚡</div>
            <div className="loading-dots">
            <span />
            <span />
            <span />
            </div>
            <h3>Анализируем ваши записи...</h3>
            <p>Это может занять некоторое время</p>
        </div>
        </div>
    </>
  );
}
