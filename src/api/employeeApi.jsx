import api from "./api";

const API_URL = "/employee";

export const buscarEmpleados = async (filters) => {
  const response = await api.get(`${API_URL}/buscar`, {
    params: filters,
  });

  return response.data;
};

export const obtenerEmpleado = async (empNo) => {
  const response = await api.get(`${API_URL}/editar/${empNo}`);
  return response.data;
};

export const crearEmpleado = async (employee) => {
  const response = await api.post(`${API_URL}/nuevo`, employee);
  return response.data;
};

export const editarEmpleado = async (employee) => {
  const response = await api.put(`${API_URL}/editar`, employee);
  return response.data;
};

export const eliminarEmpleado = async (empNo) => {
  const response = await api.delete(`${API_URL}/eliminar/${empNo}`);
  return response.data;
};