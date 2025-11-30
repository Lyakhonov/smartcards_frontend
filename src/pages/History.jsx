import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function History() {
  const [groups, setGroups] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const res = await api.get("/groups");
      // Сортировка от старых к новым
      const sorted = res.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setGroups(sorted);
    } catch {
      alert("Ошибка загрузки истории");
    }
  };

  const handleView = (id) => {
    nav(`/group/${id}`);
  };

  const deleteGroup = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту группу?")) return;

    try {
      await api.delete(`/groups/${id}`);
      loadGroups(); // обновляем список после удаления
    } catch (err) {
      console.error("Ошибка при удалении группы:", err);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <>
      <Navbar />
      <div className="history-container">
        <h1>История загрузок</h1>
        <p className="history-subtitle">
          Ваши предыдущие загрузки и сгенерированные карточки
        </p>

        <div className="history-list">
          {groups.length === 0 && <p>Нет загруженных файлов</p>}

          {groups.map((g) => (
            <div className="history-item" key={g.id}>
              <div className="history-info">
                <div className="file-icon">📄</div>

                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => handleView(g.id)}
                >
                  <div className="file-name">{g.filename}</div>
                  <div className="file-meta">
                    {g.flashcards_count || 0} сгенерировано
                  </div>
                  <div className="file-date" style={{ fontSize: "0.85em", color: "#555" }}>
                    Создано: {formatDate(g.created_at)}
                  </div>
                </div>
              </div>

              <div className="history-actions">
                <button
                  className="view-btn"
                  onClick={() => handleView(g.id)}
                >
                  Посмотреть
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteGroup(g.id)}
                >
                  Удалить
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </>
  );
}
