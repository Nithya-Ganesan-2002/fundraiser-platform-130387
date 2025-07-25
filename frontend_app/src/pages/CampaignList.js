import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCampaigns } from "../api";

// PUBLIC_INTERFACE
function CampaignList({ user, onLogin }) {
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    listCampaigns()
      .then((res) => setCampaigns(res))
      .finally(() => setLoading(false));
  }, []);

  const doSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    listCampaigns(search)
      .then(setCampaigns)
      .finally(() => setLoading(false));
  };

  return (
    <section style={{ maxWidth: 820, margin: "2rem auto" }}>
      <h1 style={{ fontSize: 32, margin: 0, color: "#1a73e8" }}>Crowdfunding Campaigns</h1>
      <form onSubmit={doSearch} style={{ margin: "1.5rem 0", display: "flex", gap: 10 }}>
        <input
          style={{
            flex: 1,
            padding: "0.7rem 1rem",
            borderRadius: 5,
            border: "1px solid var(--border-color)",
            fontSize: 16,
            outline: "none"
          }}
          placeholder="Search for campaigns..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn" style={{ background: "#1a73e8", color: "#fff" }} type="submit">
          Search
        </button>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 28,
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          }}
        >
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                padding: 16,
                borderRadius: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                minHeight: 170,
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2 style={{ margin: "0 0 10px", color: "#1a73e8" }}>{campaign.title}</h2>
                <div style={{ color: "#444", fontSize: 15, marginBottom: 9 }}>
                  {campaign.description ? campaign.description.slice(0, 73) : ""}
                  {campaign.description && campaign.description.length > 73 ? "..." : ""}
                </div>
                <div style={{ fontSize: 14, marginBottom: 4 }}>
                  Goal: <strong>${campaign.goal_amount}</strong>
                </div>
                <div style={{ fontSize: 14 }}>
                  Raised: <span style={{ color: "#34a853" }}>${campaign.current_amount}</span>
                </div>
              </div>
              <Link
                to={`/campaign/${campaign.id}`}
                style={{
                  background: "#1a73e8",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "0.50rem 1rem",
                  marginTop: 18,
                  width: 120,
                  textAlign: "center",
                  textDecoration: "none",
                  fontWeight: 500,
                  display: "inline-block"
                }}
              >
                View details
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
export default CampaignList;
