const trimTrailingSlash = (value) => value.replace(/\/$/, "");

const getLocalApiBaseUrl = () => {
  if (typeof window === "undefined") {
    return "/api";
  }

  const { hostname, protocol, port } = window.location;
  const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";

  if (!isLocalHost || port === "5000") {
    return "/api";
  }

  return `${protocol}//${hostname}:5000/api`;
};

const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.VITE_API_PROXY_TARGET
      ? `${trimTrailingSlash(import.meta.env.VITE_API_PROXY_TARGET)}/api`
      : getLocalApiBaseUrl()),
);

const SERVER_UNAVAILABLE_MESSAGE =
  "Unable to reach the Tasty Town server. Please make sure the backend is running.";

const isServerUnavailableResponse = (status, rawText) =>
  status >= 500 &&
  /(ECONNREFUSED|ECONNRESET|ENOTFOUND|socket hang up|Error occurred while trying to proxy|http proxy error|proxy error|connect failed|fetch failed)/i.test(
    rawText,
  );

const request = async (path, options = {}) => {
  const { headers, ...restOptions } = options;
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(headers || {}),
      },
      ...restOptions,
    });
  } catch {
    throw new Error(SERVER_UNAVAILABLE_MESSAGE);
  }

  let data = null;
  let rawText = "";

  try {
    rawText = await response.text();
  } catch {
    rawText = "";
  }

  if (rawText) {
    try {
      data = JSON.parse(rawText);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    if (isServerUnavailableResponse(response.status, rawText)) {
      throw new Error(SERVER_UNAVAILABLE_MESSAGE);
    }

    throw new Error(data?.message || rawText || "Request failed. Please try again.");
  }

  return data ?? null;
};

const withAuth = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const authApi = {
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  forgotPassword: (payload) =>
    request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  resetPassword: (payload) =>
    request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const publicApi = {
  getCatalogBootstrap: () => request("/catalog/bootstrap"),
  createOrder: (payload) =>
    request("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getCustomerOrders: (email) => request(`/orders/customer/${email}`),
  createReview: (payload) =>
    request("/reviews", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const customerApi = {
  saveProfile: (payload) =>
    request("/customers", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const adminApi = {
  getBootstrap: (token) =>
    request("/admin/bootstrap", {
      ...withAuth(token),
    }),
  updateOrderStatus: (token, orderId, payload) =>
    request(`/admin/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      ...withAuth(token),
    }),
  toggleUserBlock: (token, userId, payload) =>
    request(`/admin/users/${userId}/block`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      ...withAuth(token),
    }),
  deleteUser: (token, userId) =>
    request(`/admin/users/${userId}`, {
      method: "DELETE",
      ...withAuth(token),
    }),
  deleteReview: (token, reviewId) =>
    request(`/admin/reviews/${reviewId}`, {
      method: "DELETE",
      ...withAuth(token),
    }),
  updateSettings: (token, payload) =>
    request("/admin/settings", {
      method: "PUT",
      body: JSON.stringify(payload),
      ...withAuth(token),
    }),
  createMenuCategory: (token, payload) =>
    request("/admin/menu-categories", {
      method: "POST",
      body: JSON.stringify(payload),
      ...withAuth(token),
    }),
  updateMenuCategory: (token, categoryId, payload) =>
    request(`/admin/menu-categories/${categoryId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      ...withAuth(token),
    }),
  deleteMenuCategory: (token, categoryId) =>
    request(`/admin/menu-categories/${categoryId}`, {
      method: "DELETE",
      ...withAuth(token),
    }),
  createMenuItem: (token, payload) =>
    request("/admin/menu-items", {
      method: "POST",
      body: JSON.stringify(payload),
      ...withAuth(token),
    }),
  updateMenuItem: (token, itemId, payload) =>
    request(`/admin/menu-items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      ...withAuth(token),
    }),
  deleteMenuItem: (token, itemId) =>
    request(`/admin/menu-items/${itemId}`, {
      method: "DELETE",
      ...withAuth(token),
    }),
};
