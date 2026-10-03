"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ArrowRight, TrendingUp, CheckCircle, Sparkles, ShieldCheck } from "lucide-react";
import ScrollAnimation from "@/components/ui/ScrollAnimation";

export default function DonationCTA() {
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const amounts = [500, 1000, 2000, 5000, 10000];

  const goals = [
    { label: "Computer Lab & STEM Equipment", raised: 68000, target: 100000 },
    { label: "Annual Student Scholarship Fund", raised: 145000, target: 200000 },
    { label: "School Campus Library Renovation", raised: 48000, target: 120000 },
  ];

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "5.5rem 1.5rem",
        background: "linear-gradient(135deg, #0369a1 0%, #06A3EC 50%, #0284c7 100%)",
        color: "white",
      }}
    >
      {/* Background Glows */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            bottom: "-15%",
            right: "-5%",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(250,228,6,0.18) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "-5%",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 10 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "3.5rem",
            alignItems: "center",
          }}
        >
          {/* Left Column: Mission & Interactive Amount Selector */}
          <ScrollAnimation animation="fade-in-right">
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "rgba(250,228,6,0.2)",
                  border: "1px solid rgba(250,228,6,0.4)",
                  borderRadius: "9999px",
                  padding: "0.375rem 1rem",
                  marginBottom: "1.25rem",
                  color: "#fde047",
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                  backdropFilter: "blur(6px)",
                }}
              >
                <Heart size={14} fill="#fde047" /> Support Our Welfare Mission
              </div>

              <h2
                style={{
                  fontSize: "clamp(2rem, 4.5vw, 3rem)",
                  fontWeight: 900,
                  lineHeight: 1.15,
                  marginBottom: "1.25rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Your Generosity Changes Lives
              </h2>

              <p style={{ color: "rgba(255,255,255,0.9)", lineHeight: 1.7, fontSize: "1.05rem", marginBottom: "1.75rem" }}>
                100% of your contributions go towards student scholarships, emergency assistance, and essential academic infrastructure at Adarsha High School.
              </p>

              {/* Preset Donation Amount Pills */}
              <div style={{ marginBottom: "2rem" }}>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: "0.6rem" }}>
                  Select an amount to pledge:
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {amounts.map((amt) => {
                    const isSelected = selectedAmount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setSelectedAmount(amt)}
                        style={{
                          padding: "0.5rem 1rem",
                          borderRadius: "0.5rem",
                          border: isSelected ? "2px solid #fae406" : "1.5px solid rgba(255,255,255,0.25)",
                          background: isSelected ? "rgba(250,228,6,0.2)" : "rgba(255,255,255,0.1)",
                          color: isSelected ? "#fde047" : "#ffffff",
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        BDT {amt.toLocaleString()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                <Link
                  href="/contact#donate"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.85rem 2rem",
                    borderRadius: "9999px",
                    background: "#fae406",
                    color: "#1e293b",
                    fontWeight: 800,
                    fontSize: "1rem",
                    textDecoration: "none",
                    boxShadow: "0 10px 25px -5px rgba(250,228,6,0.4)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 15px 30px -5px rgba(250,228,6,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(250,228,6,0.4)";
                  }}
                >
                  <Heart size={18} /> Donate BDT {selectedAmount.toLocaleString()}
                </Link>
                <Link
                  href="/membership"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.85rem 1.75rem",
                    borderRadius: "9999px",
                    background: "rgba(255,255,255,0.12)",
                    border: "1.5px solid rgba(255,255,255,0.35)",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    textDecoration: "none",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  Become a Patron <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </ScrollAnimation>

          {/* Right Column: Active Goals Tracker */}
          <ScrollAnimation animation="fade-in-left">
            <div
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                backdropFilter: "blur(16px)",
                borderRadius: "1.25rem",
                padding: "2.25rem 2rem",
                border: "1.5px solid rgba(255, 255, 255, 0.25)",
                boxShadow: "0 20px 40px 0 rgba(0, 0, 0, 0.15)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.75rem" }}>
                <TrendingUp size={20} color="#fde047" />
                <h3 style={{ fontWeight: 800, color: "white", fontSize: "1.125rem", margin: 0 }}>
                  Active Project Goals
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {goals.map((goal) => {
                  const pct = Math.min(100, Math.round((goal.raised / goal.target) * 100));
                  return (
                    <div key={goal.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.45rem", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "white" }}>{goal.label}</span>
                        <span style={{ fontSize: "0.8125rem", color: "#fde047", fontWeight: 700 }}>{pct}%</span>
                      </div>
                      <div style={{ height: "8px", background: "rgba(255,255,255,0.2)", borderRadius: "9999px", overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${pct}%`,
                            background: "linear-gradient(90deg, #fde047, #fae406)",
                            borderRadius: "9999px",
                            transition: "width 1s ease",
                          }}
                        />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.35rem" }}>
                        <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
                          Raised: BDT {goal.raised.toLocaleString()}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.65)" }}>
                          Goal: BDT {goal.target.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: "1.75rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.8)" }}>
                <ShieldCheck size={16} color="#4ade80" /> Rupali Bank PLC Official Welfare Account
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
