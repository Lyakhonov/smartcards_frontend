import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../AuthContext";
import { Group } from "../types";

export default function History() {
  const [groups, setGroups] = useState<Group[]>([]);
  const nav = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    const res = await api.get<Group[]>("/groups");

    const sorted = res.data.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    setGroups(sorted);
  };

  const deleteGroup = async (id: number) => {
    if (!window.confirm("Удалить группу?")) return;
    await api.delete(`/groups/${id}`);
    loadGroups();
  };

  const formatDate = (d: string) => new Date(d).toLocaleString();

  return (
    <>
      <Navbar />

      <div className="history-container">
        <h1>История загрузок</h1>
        <p className="history-subtitle">Ваши предыдущие загрузки</p>

        <div className="history-list">
          {groups.map((g) => (
            <div key={g.id} className="history-item">
              <div
                className="history-info"
                onClick={() => nav(`/group/${g.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="file-icon">📄</div>

                <div>
                  <div className="file-name">{g.filename}</div>

                  <div className="file-meta">{g.flashcards_count} карточек</div>

                  <div className="file-date">{formatDate(g.created_at)}</div>
                </div>
              </div>

              <div className="history-actions">
                <button
                  className="view-btn"
                  onClick={() => nav(`/group/${g.id}`)}
                >
                  Открыть
                </button>

                {(user?.role === "manager" || user?.role === "admin") && (
                  <button
                    className="delete-btn"
                    onClick={() => deleteGroup(g.id)}
                  >
                    Удалить
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
