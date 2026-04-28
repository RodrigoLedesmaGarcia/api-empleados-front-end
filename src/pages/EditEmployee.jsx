import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";


  function EditEmployee() {
  const { empNo } = useParams();
  const navigate = useNavigate();

    const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const [employee, setEmployee] = useState({
    empNo: "",
    firstName: "",
    lastName: "",
    gender: "M",
    birthDate: "",
    hireDate: "",
    deptNo: "",
    fromDate: "",
    toDate: "",
  });

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [online, setOnline] = useState(navigator.onLine);

    useEffect(() => {
    if (empNo) {
      cargarEmpleado();
    }

    const handleOffline = () => setOnline(false);
    const handleOnline = () => setOnline(true);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [empNo]);

  const cargarEmpleado = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/employee/editar/${empNo}`,
        {
          //withCredentials: true,
        }
      );

      setEmployee(response.data);
    } catch (err) {
  console.error("Error cargando empleado:", err);
  console.error("Status:", err.response?.status);
  console.error("Data:", err.response?.data);

  setError("No se pudo cargar el empleado");
}
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEmployee({
      ...employee,
      [name]: value,
    });
  };

  
   const guardarCambios = async (e) => {
  e.preventDefault();

  setError("");
  setMensaje("");

  const token = localStorage.getItem("token");

  try {
    const response = await axios.put(
      "http://localhost:8081/employee/editar",
      employee,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    setMensaje(response.data.message || "Empleado editado correctamente ");
  } catch (err) {
    console.error("Status:", err.response?.status);
    console.error("Data:", err.response?.data);

    if (err.response?.status === 401) {
      setError("No autorizado. Inicia sesión nuevamente.");
    } else if (err.response?.status === 403) {
      setError("No tienes permisos de administrador para editar.");
    } else {
      setError("No se pudo editar el empleado");
    }
  }

};

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white shadow">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/images/icono.ico"
              alt="Logo"
              className="w-10 h-10 rounded"
            />
            <span className="font-semibold text-lg">
              Sistema de empleados
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm">👤 Usuario</span>

          <button
            type="button"
            onClick={cerrarSesion}
            className="border border-white rounded-md px-3 py-1 text-sm hover:bg-white hover:text-gray-900"
          >
            Cerrar sesión
          </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow p-6">
                <button
                  type="button"
                  onClick={() => navigate("/employee")}
                  className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-500"
                >
                  Volver al Inicio
                </button>

          <hr className="my-6" />

          <h2 className="text-2xl font-semibold text-center mb-6">
            Editar empleado
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {mensaje && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
              {mensaje}
            </div>
          )}

          <form onSubmit={guardarCambios}>
            <input type="hidden" name="empNo" value={employee.empNo} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Input
                label="Número de empleado"
                name="empNo"
                value={employee.empNo}
                onChange={handleChange}
                readOnly
              />

              <Input
                label="Nombre"
                name="firstName"
                value={employee.firstName}
                onChange={handleChange}
              />

              <Input
                label="Apellido"
                name="lastName"
                value={employee.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Género
                </label>
                <select
                  name="gender"
                  value={employee.gender}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>

              <Input
                label="Nacimiento"
                name="birthDate"
                type="date"
                value={employee.birthDate}
                onChange={handleChange}
              />

              <Input
                label="Contratación"
                name="hireDate"
                type="date"
                value={employee.hireDate}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Input
                label="Departamento"
                name="deptNo"
                value={employee.deptNo}
                onChange={handleChange}
              />

              <Input
                label="Desde"
                name="fromDate"
                type="date"
                value={employee.fromDate}
                onChange={handleChange}
              />

              <Input
                label="Hasta"
                name="toDate"
                type="date"
                value={employee.toDate}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Guardar cambios
              </button>
                              <button
                  type="button"
                  onClick={() => navigate("/employee")}
                  className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-500"
                >
                  Volver al Inicio
                </button>
            </div>
          </form>
        </div>
      </main>

      {!online && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="bg-red-600 text-white px-5 py-3 font-semibold">
              Sin conexión
            </div>
            <div className="p-5">
              Parece que no tienes conexión a internet.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  readOnly = false,
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full border rounded-lg px-3 py-2 ${
          readOnly ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      />
    </div>
  );
}

export default EditEmployee;