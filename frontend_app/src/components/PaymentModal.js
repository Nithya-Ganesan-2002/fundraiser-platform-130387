import React, { useState } from "react";
import { donateToCampaign } from "../api";

// PUBLIC_INTERFACE
function PaymentModal({ open, onClose, user, token, campaignId }) {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;
  const onDonate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await donateToCampaign({ campaign_id: campaignId, amount: parseFloat(amount) }, token);
      setStatus("Thank you for your donation!");
    } catch (e) {
      setStatus(e.message || "Failed to process donation.");
    }
    setLoading(false);
  };

  return (
    <div className="modal-backdrop" style={modalBackdropStyle}>
      <div className="modal-content" style={modalContentStyle}>
        <button onClick={onClose} style={closeButtonStyle}>&times;</button>
        <h2 style={{ color: "#34a853" }}>Make a Donation</h2>
        {!user ? (
          <div style={{ margin: 18, color: "#fbbc05" }}>You need to login to donate.</div>
        ) : (
          <form onSubmit={onDonate} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="number"
              placeholder="Amount (USD)"
              value={amount}
              min={1}
              step={0.01}
              required
              onChange={(e) => setAmount(e.target.value)}
              style={inputStyle}
            />
            <button className="btn" style={{ background: "#34a853", color: "#fff" }} disabled={loading}>
              {loading ? "Processing..." : "Donate"}
            </button>
            {status && <div style={{ color: status.startsWith("Thank") ? "#34a853" : "#b90023", marginTop: 8 }}>{status}</div>}
          </form>
        )}
      </div>
    </div>
  );
}

const modalBackdropStyle = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.26)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center"
};
const modalContentStyle = {
  background: "#fff", borderRadius: 8, maxWidth: 340, padding: 28,
  minWidth: 270, boxShadow: "0 2px 16px rgba(80,80,80,0.11)", position: "relative"
};
const closeButtonStyle = {
  position: "absolute", top: 10, right: 12, fontSize: 22, background: "none", border: "none", cursor: "pointer", color: "#888"
};
const inputStyle = {
  padding: "9px 13px", borderRadius: 6, border: "1px solid var(--border-color)", fontSize: 16
};

export default PaymentModal;
