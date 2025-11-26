import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

export default function Group() {
const { id } = useParams();
const [cards, setCards] = useState([]);
const [loading, setLoading] = useState(false);
const [editingIndex, setEditingIndex] = useState(null);
const [addButtonVisible, setAddButtonVisible] = useState(true); // видимость кнопки

const load = async () => {
setLoading(true);
try {
const res = await api.get(`/flashcards/group/${id}`);
setCards(res.data);
} catch (err) {
console.error(err);
alert("Ошибка загрузки карточек");
} finally {
setLoading(false);
}
};

const del = async (cid) => {
if (!confirm("Удалить карточку?")) return;
try {
await api.delete(`/flashcards/${cid}`);
await load();
} catch (err) {
console.error(err);
alert("Ошибка при удалении карточки");
}
};

const save = async (c) => {
try {
if (!c.id) {
// новая карточка — POST с query-параметром
await api.post(`/flashcards?group_id=${id}`, { question: c.question, answer: c.answer });
} else {
// существующая — PUT
await api.put(`/flashcards/${c.id}`, { question: c.question, answer: c.answer });
}
setEditingIndex(null);
setAddButtonVisible(true); // показать кнопку после сохранения
await load();
} catch (err) {
console.error(err);
alert("Ошибка при сохранении");
}
};

const addCard = () => {
const newCard = { question: "", answer: "" };
setCards(prev => [newCard, ...prev]);
setEditingIndex(0);
setAddButtonVisible(false); // скрываем кнопку при добавлении
};

const cancelEdit = () => {
setEditingIndex(null);
setAddButtonVisible(true); // показываем кнопку после отмены
load();
};

const onChangeField = (index, field, value) => {
setCards(prev => {
const copy = [...prev];
copy[index] = { ...copy[index], [field]: value };
return copy;
});
};

useEffect(() => { load(); }, [id]);

if (loading) return <div>Loading...</div>;

return ( <div className="group-page"> <Navbar /> <h2>Flashcards</h2>

  {addButtonVisible && (
    <button onClick={addCard} style={{ marginBottom: "15px" }}>Добавить карточку</button>
  )}

  {cards.map((c, idx) => {
    const isEditing = editingIndex === idx;

    const handleKeyDown = (e) => {
      if (e.key === "Enter") save(c);
    };

    return (
      <div key={c.id || idx} className="card-row" style={{ marginBottom: "10px" }}>
        {isEditing ? (
          <>
            <input
              value={c.question}
              onChange={(e) => onChangeField(idx, "question", e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Вопрос"
              style={{ marginRight: "5px" }}
            />
            <input
              value={c.answer}
              onChange={(e) => onChangeField(idx, "answer", e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ответ"
              style={{ marginRight: "5px" }}
            />
            <button onClick={() => save(c)}>Сохранить</button>
            <button onClick={cancelEdit}>Отмена</button>
          </>
        ) : (
          <>
            <div style={{ marginRight: "10px" }}><strong>Вопрос:</strong> {c.question}</div>
            <div style={{ marginRight: "10px" }}><strong>Ответ:</strong> {c.answer}</div>
            <button onClick={() => { setEditingIndex(idx); setAddButtonVisible(false); }}>Изменить</button>
            {c.id && <button onClick={() => del(c.id)}>Удалить</button>}
          </>
        )}
      </div>
    );
  })}
</div>

);
}
