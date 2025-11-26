import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function History() {
const [groups, setGroups] = useState([]);
const nav = useNavigate();

const loadGroups = async () => {
try {
const res = await api.get("/groups");
// сортировка по created_at, новые сверху
const sorted = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
setGroups(sorted);
} catch (err) {
console.error("Ошибка при загрузке групп:", err);
}
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

useEffect(() => {
loadGroups();
}, []);

const formatDate = (dateStr) => {
const date = new Date(dateStr);
return date.toLocaleString();
};

return ( <div className="history"> <Navbar />

  <h2>История загрузок</h2>

  {groups.length === 0 && <p>Нет загруженных групп</p>}

  {groups.map((g) => (
    <div
      key={g.id}
      className="group"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
        padding: "5px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        cursor: "pointer",
      }}
      onClick={() => nav(`/group/${g.id}`)}
    >
      <div>
        <div style={{ fontWeight: "bold" }}>{g.filename}</div>
        <div style={{ fontSize: "0.9em", color: "#555" }}>Создано: {formatDate(g.created_at)}</div>
        <div style={{ fontSize: "0.9em", color: "#555" }}>Карточек: {g.flashcards_count || 0}</div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteGroup(g.id);
        }}
        style={{
          marginLeft: "10px",
          padding: "2px 6px",
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Удалить
      </button>
    </div>
  ))}
</div>
);
}
