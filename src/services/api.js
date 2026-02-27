const API_BASE = import.meta.env.VITE_API_BASE;

async function request(path, { method = "GET", body, headers } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(headers || {}),
    },
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
}

export const productsApi = {
  list: () => request("/products"),
};

export const ordersApi = {
  create: (payload) => request("/orders", { method: "POST", body: payload }),
};

export const promoApi = {
  validate: (code) =>
    request(`/promo_codes/validate?code=${encodeURIComponent(code)}`),
};

export const uploadApi = {
  product: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return request("/upload/product", { method: "POST", body: fd });
  },
  payment: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return request("/upload/payment", { method: "POST", body: fd });
  },
  design: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return request("/upload/design", { method: "POST", body: fd });
  },
};