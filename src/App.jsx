import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Employees from "./pages/Employees";
import SearchEmployee from "./pages/SearchEmployee";
import EditEmployee from "./pages/EditEmployee";
import CreateEmployee from "./pages/CreateEmployee";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Empleados */}
        <Route path="/employee" element={<Employees />} />

        {/* Buscar */}
        <Route path="/employee/search" element={<SearchEmployee />} />

        {/* Crear */}
        <Route path="/employee/create" element={<CreateEmployee />} />

        {/* Editar con parámetro */}
        <Route path="/employee/edit/:empNo" element={<EditEmployee />} />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;