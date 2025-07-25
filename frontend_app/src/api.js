//
// API utility functions for interacting with backend
//
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

/**
 * Helper for handling API calls and JSON parsing.
 * Improved to give clearer errors for network/backend/CORS issues.
 */
async function doApiCall(url, opts = {}) {
  let res;
  try {
    res = await fetch(API_BASE + url, {
      headers: {
        ...opts.headers,
        "Content-Type": opts.contentType || "application/json",
        ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {})
      },
      // Omit credentials by default unless needed, to avoid CORS issues.
      ...opts,
    });
  } catch (err) {
    // Network error, server down or not reachable
    // Provide clear error for "Failed to fetch"/network/CORS errors
    throw new Error(
      "Network error: Unable to reach backend at " +
        API_BASE +
        ".\nError: " +
        (err && err.message ? err.message : err) +
        "\nPossible causes: backend is not running, wrong URL, or CORS misconfiguration."
    );
  }
  // fetch completed but not OK — might have server error or still a CORS error
  if (!res.ok) {
    let msg = "";
    try {
      // Try to parse backend's text error message. If not json/text, fallback.
      msg = await res.text();
    } catch {
      msg = res.statusText;
    }
    // Detect opaque response for CORS issues (status=0, type='opaque')
    if (res.type === "opaque" || res.status === 0) {
      throw new Error(
        "CORS error: Backend did not respond as expected. " +
          "Check that the FastAPI backend at " +
          API_BASE +
          " is serving and allows CORS from the frontend origin."
      );
    }
    throw new Error(
      `API error (${res.status}): ${msg || "Unknown error."}`
    );
  }
  try {
    return await res.json();
  } catch (err) {
    throw new Error("Unexpected response format from API (not JSON).");
  }
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
