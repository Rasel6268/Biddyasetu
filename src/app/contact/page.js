"use client";

import { useState } from "react";
import { orgInfo } from "@/lib/data/demo";
import {
  Mail,
  Phone,
  MapPin,
  Heart,
  Send,
  MessageCircle,
  Clock,
  CheckCircle,
  Copy,
  Check,
  Sparkles,
  Building,
  ShieldCheck,
} from "lucide-react";
import { FaFacebook } from "react-icons/fa";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [copiedField, setCopiedField] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleCopy = (text, fieldName = "acc") => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(""), 2000);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "0.625rem",
    border: "1.5px solid var(--border)",
    background: "#ffffff",
    fontSize: "0.9rem",
    color: "var(--text)",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
    fontFamily: "inherit",
  };

  const focusStyle = (e) => {
    e.target.style.borderColor = "var(--primary)";
    e.target.style.boxShadow = "0 0 0 3px rgba(6,163,236,0.1)";
  };
  const blurStyle = (e) => {
    e.target.style.borderColor = "var(--border)";
    e.target.style.boxShadow = "none";
  };

  return (
    <>
      {/* Hero Banner */}
      <section
        style={{
          background: "linear-gradient(135deg, #0284c7 0%, #06A3EC 50%, #38bdf8 100%)",
          padding: "4.5rem 1.5rem 3.5rem",
          textAlign: "center",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.12) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(250,228,6,0.15) 0%, transparent 40%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: "760px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.35rem 1rem",
              borderRadius: "9999px",
              background: "rgba(255, 255, 255, 0.16)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              marginBottom: "1rem",
              backdropFilter: "blur(6px)",
            }}
          >
            <Sparkles size={14} color="#fde047" /> Connect With Our Team
          </span>
          <h1 style={{ fontSize: "clamp(2.25rem, 5vw, 3.25rem)", fontWeight: 900, marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
            Contact & Support
          </h1>
          <p style={{ fontSize: "1.0625rem", opacity: 0.92, lineHeight: 1.6, maxWidth: "600px", margin: "0 auto" }}>
            Have a question, feedback, or want to contribute? Reach out to the Biddyasetu committee.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding" style={{ background: "var(--background)" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3.5rem" }}>
            {/* Left Column: Contact info & Donation Bank Card */}
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.45rem", color: "var(--text)", marginBottom: "1.5rem" }}>
                Get In Touch
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                {[
                  { icon: Mail, label: "Email Address", val: orgInfo.email, href: `mailto:${orgInfo.email}` },
                  { icon: Phone, label: "Phone Hotline", val: orgInfo.phone, href: `tel:${orgInfo.phone}` },
                  { icon: MapPin, label: "Alumni Office", val: orgInfo.address, href: "#" },
                  { icon: Clock, label: "Office Hours", val: "Saturday – Thursday, 10:00 AM – 6:00 PM (BST)", href: null },
                ].map(({ icon: Icon, label, val, href }) => (
                  <div
                    key={label}
                    className="card interactive-card-sm"
                    style={{
                      padding: "1.1rem 1.25rem",
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                      borderRadius: "0.875rem",
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        background: "rgba(6,163,236,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} color="var(--primary)" />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.15rem" }}>
                        {label}
                      </div>
                      {href ? (
                        <a href={href} style={{ color: "var(--text)", fontWeight: 600, textDecoration: "none", fontSize: "0.925rem" }}>
                          {val}
                        </a>
                      ) : (
                        <span style={{ color: "var(--text)", fontWeight: 600, fontSize: "0.925rem" }}>{val}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Facebook Button */}
              <div style={{ marginBottom: "2.5rem" }}>
                <a
                  href={orgInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.625rem",
                    background: "#1877f2",
                    color: "white",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    boxShadow: "0 4px 12px rgba(24,119,242,0.25)",
                    transition: "transform 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <FaFacebook size={18} /> Official Facebook Page
                </a>
              </div>

              {/* Official Donation Box */}
              <div id="donate">
                <div
                  className="card"
                  style={{
                    padding: "2rem",
                    borderRadius: "1.25rem",
                    background: "linear-gradient(135deg, #ffffff 0%, rgba(6,163,236,0.03) 100%)",
                    borderTop: "5px solid var(--primary)",
                    border: "1.5px solid var(--border)",
                    borderTopWidth: "5px",
                    borderTopColor: "var(--primary)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
                    <Heart size={22} color="var(--primary)" fill="var(--primary)" />
                    <h3 style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--text)", margin: 0 }}>
                      Official Bank Account (Donation / Welfare)
                    </h3>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                    Official account of Biddyasetu Alumni Organization. Contributions directly fund scholarships and student welfare at Adarsha High School.
                  </p>

                  <div
                    style={{
                      background: "var(--background)",
                      borderRadius: "0.875rem",
                      padding: "1.25rem",
                      border: "1px solid var(--border)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, shrink: 0 }}>Account Name:</span>
                      <strong style={{ fontSize: "0.875rem", color: "var(--text)", textAlign: "right" }}>
                        BIDDYSETU / (বিদ্যাসেতু )
                      </strong>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>Bank:</span>
                      <strong style={{ fontSize: "0.875rem", color: "var(--text)" }}>Rupali Bank PLC</strong>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, shrink: 0 }}>Branch:</span>
                      <strong style={{ fontSize: "0.8125rem", color: "var(--text)", textAlign: "right", maxWidth: "260px" }}>
                        Nakalia Br, Noor Super Market, Nakalia Bazar, Bera, Pabna
                      </strong>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.6rem", borderTop: "1px solid var(--border)" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>Account Number:</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "1rem", fontWeight: 800, color: "var(--primary)" }}>
                          3822010022341
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy("3822010022341", "acc")}
                          title="Copy Account Number"
                          style={{
                            background: copiedField === "acc" ? "rgba(22,163,74,0.1)" : "rgba(6,163,236,0.1)",
                            border: "none",
                            borderRadius: "0.375rem",
                            padding: "0.25rem 0.5rem",
                            cursor: "pointer",
                            color: copiedField === "acc" ? "var(--success)" : "var(--primary)",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: "0.2rem",
                          }}
                        >
                          {copiedField === "acc" ? <Check size={12} /> : <Copy size={12} />}
                          {copiedField === "acc" ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.6rem", borderTop: "1px solid var(--border)" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>Routing Number:</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "0.95rem", fontWeight: 700, color: "var(--text)" }}>
                          185761635
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy("185761635", "routing")}
                          title="Copy Routing Number"
                          style={{
                            background: copiedField === "routing" ? "rgba(22,163,74,0.1)" : "rgba(6,163,236,0.1)",
                            border: "none",
                            borderRadius: "0.375rem",
                            padding: "0.25rem 0.5rem",
                            cursor: "pointer",
                            color: copiedField === "routing" ? "var(--success)" : "var(--primary)",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: "0.2rem",
                          }}
                        >
                          {copiedField === "routing" ? <Check size={12} /> : <Copy size={12} />}
                          {copiedField === "routing" ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Message Form */}
            <div>
              {sent ? (
                <div
                  className="card"
                  style={{
                    padding: "3.5rem 2rem",
                    textAlign: "center",
                    borderRadius: "1.25rem",
                    border: "1.5px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "50%",
                      background: "rgba(22,163,74,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1.5rem",
                    }}
                  >
                    <CheckCircle size={40} color="var(--success)" />
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: "1.5rem", marginBottom: "0.75rem", color: "var(--text)" }}>
                    Message Received!
                  </h3>
                  <p style={{ color: "var(--text-muted)", lineHeight: 1.7, maxWidth: "420px", margin: "0 auto 2rem" }}>
                    Thank you for reaching out to Biddyasetu. Our secretariat will review your message and reply via email within 2-3 business days.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="btn-outline"
                    style={{ padding: "0.65rem 1.5rem", fontSize: "0.9rem" }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div
                  className="card"
                  style={{
                    padding: "2.5rem",
                    borderRadius: "1.25rem",
                    border: "1.5px solid var(--border)",
                    background: "#ffffff",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.75rem" }}>
                    <MessageCircle size={24} color="var(--primary)" />
                    <div>
                      <h2 style={{ fontWeight: 800, fontSize: "1.35rem", color: "var(--text)", margin: 0 }}>
                        Send a Message
                      </h2>
                      <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: 0 }}>
                        We usually respond within 24–48 hours.
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSent(true);
                    }}
                    style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", fontWeight: 700, fontSize: "0.85rem", color: "var(--text)", marginBottom: "0.4rem" }}>
                          Full Name <span style={{ color: "var(--danger)" }}>*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Your name"
                          style={inputStyle}
                          onFocus={focusStyle}
                          onBlur={blurStyle}
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontWeight: 700, fontSize: "0.85rem", color: "var(--text)", marginBottom: "0.4rem" }}>
                          Email Address <span style={{ color: "var(--danger)" }}>*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="your@email.com"
                          style={inputStyle}
                          onFocus={focusStyle}
                          onBlur={blurStyle}
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: 700, fontSize: "0.85rem", color: "var(--text)", marginBottom: "0.4rem" }}>
                        Inquiry Topic <span style={{ color: "var(--danger)" }}>*</span>
                      </label>
                      <select
                        style={inputStyle}
                        onFocus={focusStyle}
                        onBlur={blurStyle}
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      >
                        <option>General Inquiry</option>
                        <option>Membership Application Support</option>
                        <option>Scholarship / Financial Assistance</option>
                        <option>Donation & Sponsorship</option>
                        <option>Reunion & Event Details</option>
                        <option>Volunteer with Biddyasetu</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: 700, fontSize: "0.85rem", color: "var(--text)", marginBottom: "0.4rem" }}>
                        Message Details <span style={{ color: "var(--danger)" }}>*</span>
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Write your message, question, or proposal..."
                        style={{ ...inputStyle, resize: "vertical" }}
                        onFocus={focusStyle}
                        onBlur={blurStyle}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-primary"
                      style={{
                        padding: "0.85rem 1.75rem",
                        fontSize: "0.95rem",
                        justifyContent: "center",
                        borderRadius: "0.625rem",
                        fontWeight: 700,
                      }}
                    >
                      <Send size={16} /> Submit Message
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
