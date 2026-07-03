import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://harmonia-backend-4uu0.onrender.com/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Credenciales incorrectas");
        return;
      }

      localStorage.setItem("token", data.token);

      navigate("/admin");
    } catch (error) {
      setError("Error al iniciar sesión");
    }
  };

  return (
    <div className="admin-login-container">
      <form
        className="admin-login-form"
        onSubmit={handleSubmit}
      >
        <h1>Panel de Administración</h1>

        {error && (
          <p className="admin-error">
            {error}
          </p>
        )}

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />

        <button type="submit">
          Ingresar
        </button>
      </form>
    </div>
  );
}

export default AdminLogin; 