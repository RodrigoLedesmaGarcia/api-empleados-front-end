import axios from "axios";

const API_URL = "http://localhost:8081/employee";

export const buscarEmpleados = async (filters) => {
  const response = await axios.get(`${API_URL}/buscar`, {
    params: filters,
    withCredentials: true,
  });

  return response.data;
};

export const obtenerEmpleado = async (empNo) => {
  const response = await axios.get(`${API_URL}/editar/${empNo}`, {
    withCredentials: true,
  });

  return response.data;
};

export const crearEmpleado = async (employee) => {
  const response = await axios.post(`${API_URL}/nuevo`, employee, {
    withCredentials: true,
  });

  return response.data;
};

export const editarEmpleado = async (employee) => {
  const response = await axios.put(`${API_URL}/editar`, employee, {
    withCredentials: true,
  });

  return response.data;
};

export const eliminarEmpleado = async (empNo) => {
  const response = await axios.delete(`${API_URL}/eliminar/${empNo}`, {
    withCredentials: true,
  });

  return response.data;
};