export const API_URL = "https://keep.kevindupas.com/api";

export const ENDPOINTS = {
  auth: {
    login: "/login",
    logout: "/logout",
    qrScan: "/qr-scan",
  },

  categories: {
    list: "/categories",
    create: "/categories",
    update: (id: string) => `/categories/${id}`,
    delete: (id: string) => `/categories/${id}`,
  },

  notes: {
    list: "/notes",
    create: "/notes",
    get: (id: string) => `/notes/${id}`,
    update: (id: string) => `/notes/${id}`,
    delete: (id: string) => `/notes/${id}`,
  },

  tasks: {
    list: "/tasks",
    create: "/tasks",
    get: (id: string) => `/tasks/${id}`,
    update: (id: string) => `/tasks/${id}`,
    delete: (id: string) => `/tasks/${id}`,
    toggle: (id: string) => `/tasks/${id}/toggle`,
    subtasks: {
      create: (taskId: string) => `/tasks/${taskId}/subtasks`,
      update: (taskId: string, subtaskId: string) =>
        `/tasks/${taskId}/subtasks/${subtaskId}`,
      delete: (taskId: string, subtaskId: string) =>
        `/tasks/${taskId}/subtasks/${subtaskId}`,
    },
  },
} as const;

// apiClient.get(ENDPOINTS.notes.list)
// apiClient.post(ENDPOINTS.auth.login, { email, password })
// apiClient.put(ENDPOINTS.notes.update(noteId), { title, content })
