import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createCampaign, getCampaign } from "../api";

// PUBLIC_INTERFACE
function CampaignForm({ user, token, onLogin }) {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    goal_amount: "",
    end_date: "",
    image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState();

  useEffect(() => {
    if (campaignId) {
      getCampaign(campaignId).then((c) =>
        setForm({
          title: c.title,
          description: c.description ?? "",
          goal_amount: c.goal_amount,
          end_date: c.end_date.slice(0, 10),
          image_url: c.image_url ?? "",
        }),
      );
    }
  }, [campaignId]);

  if (!user) return <div style={{ margin: 40 }}>Please login to create or edit a campaign.</div>;

  const onInput = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg();
    try {
      const data = {
        ...form,
        goal_amount: Number(form.goal_amount),
        end_date: new Date(form.end_date).toISOString(),
      };
      await createCampaign(data, token);
      setMsg("Success! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 900);
    } catch (err) {
      setMsg(err.message || "Failed to save campaign.");
    }
    setLoading(false);
  };

  return (
    <section
      style={{
        maxWidth: 520,
        margin: "2rem auto 2.5rem auto",
        background: "var(--bg-secondary)",
        borderRadius: 9,
        padding: 30,
        boxShadow: "0 2px 16px rgba(70,64,64,0.08)",
      }}
    >
      <h2 style={{ color: "#1a73e8" }}>
        {campaignId ? "Edit Campaign" : "Start a New Campaign"}
      </h2>
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          required
          onChange={onInput}
          style={inputStyle}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={onInput}
          rows={3}
          style={inputStyle}
        />
        <input
          name="goal_amount"
          type="number"
          min={1}
          placeholder="Goal Amount (USD)"
          value={form.goal_amount}
          required
          onChange={onInput}
          style={inputStyle}
        />
        <input
          name="end_date"
          type="date"
          placeholder="End Date"
          value={form.end_date}
          required
          onChange={onInput}
          style={inputStyle}
        />
        <input
          name="image_url"
          placeholder="Image URL (optional)"
          value={form.image_url}
          onChange={onInput}
          style={inputStyle}
        />
        <button className="btn" style={{ background: "#1a73e8", color: "#fff" }} disabled={loading}>
          {loading ? "Saving..." : campaignId ? "Update Campaign" : "Create Campaign"}
        </button>
      </form>
      {msg && (
        <div
          style={{
            color: msg.startsWith("Success") ? "#34a853" : "#b90023",
            marginTop: 10,
            textAlign: "center",
          }}
        >
          {msg}
        </div>
      )}
    </section>
  );
}

const inputStyle = {
  padding: "11px 14px", borderRadius: 6, border: "1px solid var(--border-color)", fontSize: 16,
  marginBottom: 0
};
export default CampaignForm;
