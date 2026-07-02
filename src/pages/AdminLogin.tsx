import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/adminService";
import logo from "../assets/logo.png";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const data = await loginAdmin(
        username,
        password
      );

      localStorage.setItem(
        "token",
        data.token
      );

      navigate("/admin");
    } catch (err: any) {
      setError(
        err.message ||
          "Error al iniciar sesión"
      );
    }
  };

  return (
    <div className="admin-login-page">
      <form
        className="admin-login-card"
        onSubmit={handleSubmit}
      >
        <img
          src={logo}
          alt="Harmonia Aromas" 
          className="admin-login-logo"
        />

        <h1>Panel de Administración</h1>

        <p>
          Iniciá sesión para gestionar
          Harmonia Aromas
        </p>

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button type="submit">
          Ingresar
        </button>
      </form>
    </div>
  );
}

export default AdminLogin; 