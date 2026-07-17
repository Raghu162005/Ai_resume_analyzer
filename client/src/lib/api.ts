import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const auth = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};

export const resume = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("resume", file);
    return api.post("/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getAll: () => api.get("/resume"),
  getOne: (id: string) => api.get(`/resume/${id}`),
  remove: (id: string) => api.delete(`/resume/${id}`),
};

export const analysis = {
  create: (data: { resumeId: string; jobDescriptionId: string }) =>
    api.post("/analysis", data),
  getOne: (id: string) => api.get(`/analysis/${id}`),
  getHistory: () => api.get("/analysis/history/all"),
};

export const dashboard = {
  getStats: () => api.get("/dashboard/stats"),
  getScoreHistory: () => api.get("/dashboard/scores"),
};

export default api;
