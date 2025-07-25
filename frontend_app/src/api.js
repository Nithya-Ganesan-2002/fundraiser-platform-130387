//
// API utility functions for interacting with backend
//
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

// Helper for handling API calls and JSON parsing
async function doApiCall(url, opts = {}) {
  const res = await fetch(API_BASE + url, {
    headers: {
      ...opts.headers,
      "Content-Type": opts.contentType || "application/json",
      ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {})
    },
    ...opts,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// PUBLIC_INTERFACE
export async function registerUser({ email, password, name }) {
  return doApiCall("/users/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name })
  });
}

// PUBLIC_INTERFACE
export async function loginUser({ email, password }) {
  // Uses x-www-form-urlencoded for OAuth2 password grant
  const params = new URLSearchParams({
    username: email,
    password
  });
  return doApiCall("/users/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params
  });
}

// PUBLIC_INTERFACE
export async function getCurrentUser(token) {
  return doApiCall("/users/me", {
    method: "GET",
    token
  });
}

// PUBLIC_INTERFACE
export async function listCampaigns(q = "") {
  const url = q ? `/campaigns/?q=${encodeURIComponent(q)}` : "/campaigns/";
  return doApiCall(url, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function getCampaign(id) {
  return doApiCall(`/campaigns/${id}`, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function createCampaign(data, token) {
  return doApiCall("/campaigns/", {
    method: "POST",
    body: JSON.stringify(data),
    token
  });
}

// PUBLIC_INTERFACE
export async function getCampaignAnalytics(id) {
  return doApiCall(`/analytics/campaign/${id}`, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function donateToCampaign({ campaign_id, amount }, token) {
  return doApiCall("/donations/", {
    method: "POST",
    body: JSON.stringify({ campaign_id, amount }),
    token
  });
}

// PUBLIC_INTERFACE
export async function getMyDonations(token) {
  return doApiCall("/donations/my", {
    method: "GET",
    token
  });
}
