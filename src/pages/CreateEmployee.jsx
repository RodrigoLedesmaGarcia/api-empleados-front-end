import { useEffect, useState } from "react";
import axios from "axios";

const initialEmployee = {
  firstName: "",
  lastName: "",
  birthDate: "",
  hireDate: "",
  gender: "",
  deptNo: "",
  fromDate: "",
  toDate: "",
};

function CreateEmployee() {
  const [employee, setEmployee] = useState(initialEmployee);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOffline = () => setOnline(false);
    const handleOnline = () => setOnline(true);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEmployee({
      ...employee,
      [name]: value,
    });
  };

  const limpiarFormulario = () => {
    setEmployee(initialEmployee);
    setError("");
    setSuccess("");
  };

  const guardarEmpleado = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const payload = {
        ...employee,
        toDate: employee.toDate || null,
      };

      const response = await axios.post(
        "http://localhost:8081/employee/nuevo",
        payload,
        {
          withCredentials: true,
        }
      );

      setSuccess(response.data.message || "Empleado creado correctamente");
      setShowSuccessModal(true);
      setEmployee(initialEmployee);
    } catch (err) {
      setError("Error al crear el empleado");
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

            <button className="border border-white rounded-md px-3 py-1 text-sm hover:bg-white hover:text-gray-900">
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Alta de empleados
        </h2>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="bg-blue-600 text-white px-5 py-3">
            <h5 className="font-semibold">Alta de Empleado</h5>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
                {success}
              </div>
            )}

            <form onSubmit={guardarEmpleado}>
              <Input
                label="Nombre"
                name="firstName"
                value={employee.firstName}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={100}
              />

              <Input
                label="Apellido"
                name="lastName"
                value={employee.lastName}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={100}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Fecha de Nacimiento"
                  name="birthDate"
                  type="date"
                  value={employee.birthDate}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Fecha de Contratación"
                  name="hireDate"
                  type="date"
                  value={employee.hireDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Género
                </label>
                <select
                  name="gender"
                  value={employee.gender}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">-- seleccione --</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Departamento
                </label>
                <select
                  name="deptNo"
                  value={employee.deptNo}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">-- seleccione --</option>
                  <option value="d001">Marketing</option>
                  <option value="d002">Finanzas</option>
                  <option value="d003">Recursos Humanos</option>
                  <option value="d004">Productos</option>
                  <option value="d005">Desarrollo</option>
                  <option value="d006">Calidad</option>
                  <option value="d007">Ventas</option>
                  <option value="d008">Investigación</option>
                  <option value="d009">Servicio al cliente</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  helper="Déjalo vacío si es actual"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Limpiar
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Guardar
                </button>

                <button
                  type="button"
                  className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-500"
                >
                  Volver al Inicio
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="bg-green-600 text-white px-5 py-3 flex justify-between items-center">
              <h5 className="font-semibold">Empleado creado</h5>
              <button onClick={() => setShowSuccessModal(false)}>✕</button>
            </div>

            <div className="p-5">
              <p className="mb-5">Empleado creado con éxito</p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="border border-green-600 text-green-700 px-4 py-2 rounded-lg"
                >
                  Regresar
                </button>

                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    limpiarFormulario();
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Crear otro
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
  required = false,
  minLength,
  maxLength,
  helper,
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>

      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        className="w-full border rounded-lg px-3 py-2"
      />

      {helper && <p className="text-sm text-gray-500 mt-1">{helper}</p>}
    </div>
  );
}

export default CreateEmployee;