import React from "react";

const HyderabadCalendar = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Hyderabad Holiday Calendar - 2026</h2>

      <div style={styles.card}>
        <img
          src="/hyd-calendar-2026.png"
          alt="Hyderabad Holiday Calendar 2026"
          style={styles.image}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(to bottom, #eef2ff, #dce4ff)",
  },
  heading: {
    fontSize: "24px",
    fontWeight: 600,
    marginBottom: "10px",
  },
  card: {
    background: "#fff",
    borderRadius: "14px",
    padding: "10px",
    maxWidth: "95vw",
    maxHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
  },
  image: {
    maxWidth: "90vw",
    maxHeight: "70vh",
    objectFit: "contain",
    borderRadius: "8px",
  },
};

export default HyderabadCalendar;
