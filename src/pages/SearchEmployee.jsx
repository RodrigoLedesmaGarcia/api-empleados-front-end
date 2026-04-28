import { useEffect, useState } from "react";
import axios from "axios";

function SearchEmployee() {
  const [empNo, setEmpNo] = useState("");
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [online, setOnline] = useState(navigator.onLine);

  const username = "Usuario";

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

  const buscarEmpleado = async (e) => {
    e.preventDefault();

    setError("");
    setMensaje("");
    setEmployee(null);

    try {
      const response = await axios.get("http://localhost:8081/employee/buscar", {
        params: {
          empNo,
        },
        withCredentials: true,
      });

      const data = response.data;

      if (data.content && data.content.length > 0) {
        setEmployee(data.content[0]);
      } else if (data.empNo) {
        setEmployee(data);
      } else {
        setMensaje("No se encontró el empleado");
      }
    } catch (err) {
      setError("Error al buscar empleado");
    }
  };

  const eliminarEmpleado = async () => {
    const confirmar = window.confirm(
      "¿Seguro que quiere eliminar este empleado?"
    );

    if (!confirmar) return;

    try {
      await axios.delete(`http://localhost:8081/employee/eliminar/${employee.empNo}`, {
        withCredentials: true,
      });

      setEmployee(null);
      setMensaje("Empleado eliminado con éxito ✅");
    } catch (err) {
      setError("No se pudo eliminar el empleado");
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
            <span className="text-sm">👤 {username}</span>

            <button className="border border-white rounded-md px-3 py-1 text-sm hover:bg-white hover:text-gray-900">
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Buscar empleado por número de empleado
          </h2>

          <form onSubmit={buscarEmpleado} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Ingrese el número de empleado
              </label>
              <input
                type="number"
                value={empNo}
                onChange={(e) => setEmpNo(e.target.value)}
                placeholder="Ejemplo: 10010"
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex items-end">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Buscar
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {mensaje && (
            <div className="bg-yellow-100 text-yellow-700 p-3 rounded-lg mb-4">
              {mensaje}
            </div>
          )}

          {employee && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <Th>N° Empleado</Th>
                    <Th>Nombre</Th>
                    <Th>Apellido</Th>
                    <Th>Género</Th>
                    <Th>Nacimiento</Th>
                    <Th>Contratación</Th>
                    <Th>Departamento</Th>
                    <Th>Desde</Th>
                    <Th>Hasta</Th>
                    <Th>Acciones</Th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <Td>{employee.empNo}</Td>
                    <Td>{employee.firstName}</Td>
                    <Td>{employee.lastName}</Td>
                    <Td>{employee.gender}</Td>
                    <Td>{employee.birthDate}</Td>
                    <Td>{employee.hireDate}</Td>
                    <Td>{employee.deptNo}</Td>
                    <Td>{employee.fromDate}</Td>
                    <Td>{employee.toDate}</Td>
                    <Td>
                      <div className="flex justify-center gap-2">
                        <button className="bg-yellow-400 px-3 py-1 rounded text-sm">
                          Editar
                        </button>

                        <button
                          onClick={eliminarEmpleado}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </Td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
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

function Th({ children }) {
  return <th className="p-2 text-left whitespace-nowrap">{children}</th>;
}

function Td({ children }) {
  return <td className="p-2 whitespace-nowrap">{children}</td>;
}

export default SearchEmployee;