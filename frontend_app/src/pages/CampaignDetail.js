import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCampaign, getCampaignAnalytics } from "../api";

// PUBLIC_INTERFACE
function CampaignDetail({ user, onLogin, onDonateClick }) {
  const { campaignId } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCampaign(campaignId)
      .then(setCampaign)
      .catch(() => setCampaign(null))
      .finally(() => setLoading(false));
    getCampaignAnalytics(campaignId)
      .then(setAnalytics)
      .catch(() => setAnalytics(null));
  }, [campaignId]);

  if (loading) return <div>Loading...</div>;
  if (!campaign) return <div>Campaign not found.</div>;

  // Format date
  const dateFmt = (s) => new Date(s).toLocaleDateString();

  return (
    <section style={{ maxWidth: 950, margin: "2rem auto", background: "var(--bg-secondary)", borderRadius: 8, boxShadow: "0 1px 8px rgba(0,0,0,0.04)", padding: 24 }}>
      <h2 style={{ color: "#1a73e8" }}>{campaign.title}</h2>
      <div style={{ marginBottom: 12, color: "#555" }}>
        <strong>Fundraising Goal:</strong> ${campaign.goal_amount} <span style={{ marginLeft: 12 }}>•</span>
        <strong>Ends:</strong> {dateFmt(campaign.end_date)}
      </div>
      {campaign.image_url && (
        <img src={campaign.image_url} alt="campaign visual" style={{ width: 220, borderRadius: 7, marginBottom: 23 }} />
      )}
      <div style={{ fontSize: 17, marginBottom: 19 }}>{campaign.description}</div>
      {analytics && (
        <div style={{ margin: "20px 0" }}>
          <div>
            <span style={{ fontWeight: "bold" }}>Raised:{" "}</span>
            <span style={{ color: "#34a853" }}>${analytics.total_raised}</span> / ${campaign.goal_amount}
          </div>
          <div>
            <span>Donors: {analytics.num_donors}</span>
            <div style={{ height: 18, width: "100%", background: "#e9ecef", borderRadius: 9, margin: "8px 0 2px" }}>
              <div
                style={{
                  width: analytics.progress_percentage + "%",
                  background: "#34a853",
                  height: "100%",
                  borderRadius: 9
                }}
              />
            </div>
            <span>Progress: {analytics.progress_percentage}%</span>
          </div>
        </div>
      )}
      {!user && (
        <button className="btn" style={{ background: "#1a73e8", color: "#fff", marginTop: 18 }} onClick={onLogin}>
          Login to donate
        </button>
      )}
      {user && (
        <button
          className="btn"
          style={{ background: "#34a853", color: "#fff", marginTop: 22 }}
          onClick={() => onDonateClick(campaign.id)}
        >
          Donate
        </button>
      )}
    </section>
  );
}

export default CampaignDetail;
