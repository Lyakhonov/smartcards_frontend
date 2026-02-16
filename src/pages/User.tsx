import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api";
import { useAuth } from "../AuthContext";

type User = {
  id: string;
  email: string;
  full_name?: string;
  role: "user" | "manager" | "admin";
};

export default function Users() {
  const { user } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<User["role"]>("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get<User[]>("/admin/users");

      const sorted = res.data.sort((a, b) =>
        a.email.toLowerCase().localeCompare(b.email.toLowerCase()),
      );

      setUsers(sorted);
    } finally {
      setLoading(false);
    }
  };

  const saveRole = async (id: string) => {
    await api.put(`/admin/users/${id}/role`, {
      role: newRole,
    });

    setEditingId(null);
    load();
  };

  return (
    <>
      <Navbar />

      <div className="history-container">
        <h1>Пользователи</h1>

        {loading && <p>Загрузка...</p>}

        <div className="history-list">
          {users.map((u) => (
            <div key={u.id} className="history-item">
              <div className="history-info">
                <div>
                  <b>{u.full_name || "Без имени"}</b>
                  <div>{u.email}</div>

                  {editingId === u.id ? (
                    <>
                      <select
                        value={newRole}
                        onChange={(e) =>
                          setNewRole(e.target.value as User["role"])
                        }
                        style={{ marginTop: 8 }}
                      >
                        <option value="user">user</option>
                        <option value="manager">manager</option>
                        <option value="admin">admin</option>
                      </select>

                      <div className="card-actions">
                        <button
                          className="btn save"
                          onClick={() => saveRole(u.id)}
                        >
                          Сохранить
                        </button>

                        <button
                          className="btn cancel"
                          onClick={() => setEditingId(null)}
                        >
                          Отмена
                        </button>
                      </div>
                    </>
                  ) : (
                    <div>
                      Роль: <b>{u.role}</b>
                      {user?.role === "admin" && (
                        <div className="card-actions">
                          <button
                            onClick={() => {
                              setEditingId(u.id);
                              setNewRole(u.role);
                            }}
                          >
                            ✏️ Изменить
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {!loading && users.length === 0 && <p>Нет пользователей</p>}
        </div>
      </div>
    </>
  );
}
