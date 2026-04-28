import { useEffect, useState } from "react";
import { buscarEmpleados, eliminarEmpleado } from "../api/employeeApi";
import { useNavigate } from "react-router-dom";

function Employees() {
  const [filters, setFilters] = useState({
    empNo: "",
    firstName: "",
    lastName: "",
    gender: "",
    deptNo: "",
    hireDate: "",
    birthDate: "",
    fromDate: "",
    toDate: "",
    page: 0,
    size: 10,
  });

  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [online, setOnline] = useState(navigator.onLine);
  const navigate = useNavigate();

  const username = "Usuario"; // después lo puedes traer del login/backend

  const cargarEmpleados = async () => {
    try {
      setError("");
      const data = await buscarEmpleados(filters);
      setResults(data);
    } catch (e) {
      setError("No se pudieron cargar los empleados");
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

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

    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleBuscar = async (e) => {
    e.preventDefault();

    const nuevosFiltros = {
      ...filters,
      page: Number(filters.page || 0),
      size: Number(filters.size || 10),
    };

    try {
      setError("");
      const data = await buscarEmpleados(nuevosFiltros);
      setResults(data);
    } catch (e) {
      setError("Error al buscar empleados");
    }
  };

  const limpiarBusqueda = () => {
    setFilters({
      empNo: "",
      firstName: "",
      lastName: "",
      gender: "",
      deptNo: "",
      hireDate: "",
      birthDate: "",
      fromDate: "",
      toDate: "",
      page: 0,
      size: 10,
    });

    setResults(null);
  };

  const cambiarPagina = async (page) => {
    const nuevosFiltros = {
      ...filters,
      page,
    };

    setFilters(nuevosFiltros);

    try {
      const data = await buscarEmpleados(nuevosFiltros);
      setResults(data);
    } catch (e) {
      setError("Error al cambiar de página");
    }
  };

  const handleEliminar = async (empNo) => {
    const confirmar = window.confirm(
      "¿Seguro que quiere eliminar este empleado?"
    );

    if (!confirmar) return;

    try {
      await eliminarEmpleado(empNo);
      await cargarEmpleados();
    } catch (e) {
      setError("No se pudo eliminar el empleado");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white shadow">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
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

      <main className="p-6">
        <h4 className="text-center text-xl font-semibold mb-4">
          Sistema de búsqueda de empleados
        </h4>

        <hr className="mb-6" />

        <form
          onSubmit={handleBuscar}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-5 rounded-xl shadow mb-5"
        >
          <Input label="N° empleado" name="empNo" type="number" value={filters.empNo} onChange={handleChange} />
          <Input label="Nombre" name="firstName" value={filters.firstName} onChange={handleChange} />
          <Input label="Apellido" name="lastName" value={filters.lastName} onChange={handleChange} />

          <div>
            <label className="block text-sm font-medium mb-1">Género</label>
            <select
              name="gender"
              value={filters.gender}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Todos</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>

          <Input label="Departamento" name="deptNo" value={filters.deptNo} onChange={handleChange} />
          <Input label="Contratación" name="hireDate" type="date" value={filters.hireDate} onChange={handleChange} />
          <Input label="Cumpleaños" name="birthDate" type="date" value={filters.birthDate} onChange={handleChange} />
          <Input label="Desde" name="fromDate" type="date" value={filters.fromDate} onChange={handleChange} />
          <Input label="Actualidad" name="toDate" type="date" value={filters.toDate} onChange={handleChange} />
          <Input label="Página" name="page" type="number" value={filters.page} onChange={handleChange} />
          <Input label="Tamaño" name="size" type="number" value={filters.size} onChange={handleChange} />

          <div className="md:col-span-4 flex gap-3 mt-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Buscar empleado
            </button>

            <button
              type="button"
              onClick={limpiarBusqueda}
              className="border border-gray-400 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Limpiar búsqueda
            </button>

            <button
              type="button"
              onClick={() => navigate("/employee/create")}
              className="border border-green-500 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50"
            >
              Crear nuevo
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {results && (
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="text-sm text-gray-600">
                Total {results.totalElements} | Página {results.number + 1} de{" "}
                {results.totalPages}
              </div>

              <div className="flex gap-2">
                <button
                  disabled={results.first}
                  onClick={() => cambiarPagina(results.number - 1)}
                  className="border border-blue-600 text-blue-600 px-3 py-1 rounded disabled:opacity-40"
                >
                  Anterior
                </button>

                <button
                  disabled={results.last}
                  onClick={() => cambiarPagina(results.number + 1)}
                  className="border border-blue-600 text-blue-600 px-3 py-1 rounded disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            </div>

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
                    <Th>From</Th>
                    <Th>To</Th>
                    <Th>Acciones</Th>
                  </tr>
                </thead>

                <tbody>
                  {results.content?.map((item) => (
                    <tr key={item.empNo} className="border-b hover:bg-gray-50">
                      <Td>{item.empNo}</Td>
                      <Td>{item.firstName}</Td>
                      <Td>{item.lastName}</Td>
                      <Td>{item.gender}</Td>
                      <Td>{item.birthDate}</Td>
                      <Td>{item.hireDate}</Td>
                      <Td>{item.deptNo}</Td>
                      <Td>{item.fromDate}</Td>
                      <Td>{item.toDate}</Td>
                      <Td>
                        <div className="flex justify-center gap-2">
                          <button className="bg-yellow-400 px-3 py-1 rounded text-sm">
                            Editar
                          </button>

                          <button
                            onClick={() => handleEliminar(item.empNo)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
      </main>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded-lg px-3 py-2"
      />
    </div>
  );
}

function Th({ children }) {
  return <th className="p-2 text-left whitespace-nowrap">{children}</th>;
}

function Td({ children }) {
  return <td className="p-2 whitespace-nowrap">{children}</td>;
}

export default Employees;