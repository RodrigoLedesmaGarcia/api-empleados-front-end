import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:8081/auth/login",
        {
          username,
          password,
        },
        {
          withCredentials: true, // 🔴 CRÍTICO para sesión
        }
      );

      setSuccess("Login correcto");

      // pequeña pausa UX
      setTimeout(() => {
        navigate("/employees");
      }, 600);

    } catch (err) {
      console.error(err.response?.status, err.response?.data);
      setError("Usuario o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/globo.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative w-full max-w-md rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 shadow-2xl">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center text-3xl text-white">
              👤
            </div>

            <h2 className="text-3xl font-bold text-white">Bienvenido</h2>
            <p className="text-gray-200 mt-1">
              Ingrese sus credenciales para continuar
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/90 text-white text-center p-3">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg bg-green-500/90 text-white text-center p-3">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-white font-semibold mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-xl px-4 py-3 bg-white/20 border border-white/30 text-white outline-none"
              />
            </div>

            <div className="mb-5">
              <label className="block text-white font-semibold mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl px-4 py-3 bg-white/20 border border-white/30 text-white outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition disabled:opacity-50"
            >
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;