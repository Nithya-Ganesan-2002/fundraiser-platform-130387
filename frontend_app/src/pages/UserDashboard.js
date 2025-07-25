import React, { useEffect, useState } from "react";
import { listCampaigns, getMyDonations } from "../api";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
function UserDashboard({ user, token, onLogin }) {
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && token) {
      setLoading(true);
      listCampaigns()
        .then(res => setCampaigns(res.filter(c => c.owner_id === user.id)))
        .finally(() => setLoading(false));
      getMyDonations(token)
        .then(setDonations)
        .catch(() => setDonations([]));
    }
  }, [user, token]);

  if (!user) return <div style={{ margin: 50 }}>Please login to view your dashboard.</div>;

  return (
    <div style={{ maxWidth: 900, margin: "2.5rem auto", display: "flex", gap: 52 }}>
      <aside style={{ minWidth: 190, borderRight: "1px solid #e9ecef", paddingRight: 25 }}>
        <div style={{ fontWeight: 700, fontSize: 21, color: "#1a73e8", marginBottom: 18 }}>Dashboard</div>
        <div style={{ color: "#444" }}>
          <div>User: <span style={{ fontWeight: 500 }}>{user.name || user.email}</span></div>
          <div>Email: <span style={{ fontWeight: 500 }}>{user.email}</span></div>
        </div>
      </aside>
      <main style={{ flex: 1 }}>
        <h2 style={{ color: "#1a73e8" }}>My Campaigns</h2>
        {!loading && campaigns.length === 0 && (
          <div>You have not created any campaigns. <Link to="/campaign/new">Start a campaign ➔</Link></div>
        )}
        <ul>
          {campaigns.map((c) => (
            <li key={c.id} style={{ marginBottom: 10 }}>
              <Link to={`/campaign/${c.id}`}>{c.title}</Link>{" "}
              <Link to={`/campaign/${c.id}/edit`} style={{ marginLeft: 10, fontSize: 13 }}>Edit</Link>
            </li>
          ))}
        </ul>
        <h2 style={{ color: "#1a73e8", marginTop: 36 }}>My Donations</h2>
        <ul>
          {donations.map((d) => (
            <li key={d.id}>
              Donated <b>${d.amount}</b> to <Link to={`/campaign/${d.campaign_id}`}>Campaign #{d.campaign_id}</Link> on {new Date(d.donated_at).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default UserDashboard;
