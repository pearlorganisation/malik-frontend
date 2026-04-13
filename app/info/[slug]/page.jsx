"use client";
import React, { useMemo, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGetPageBySlugQuery } from "@/features/page/pageApi";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ShieldCheck, Clock, ArrowLeft, FileText, Share2, CheckCircle } from "lucide-react";
import Link from "next/link";

// ─── Content Parser ────────────────────────────────────────────────────────────
function parseContent(raw) {
  if (!raw || typeof window === "undefined") return raw || "";
  const isWrapped = /^(\s*<p>[\s\S]*?<\/p>\s*)+$/.test(raw.trim());
  let decoded = raw;
  if (isWrapped) {
    decoded = raw.replace(/<p>/g, "").replace(/<\/p>/g, "\n").trim();
  }
  const txt = document.createElement("textarea");
  txt.innerHTML = decoded;
  let result = txt.value;
  const hasRealTags = /<(h[1-6]|p|ul|ol|li|strong|em|a|blockquote|hr|br|div|span|table)\b/i.test(result);
  if (!hasRealTags) {
    result = result
      .split(/\n\n+/)
      .map(para => para.trim())
      .filter(Boolean)
      .map(para => `<p>${para.replace(/\n/g, "<br/>")}</p>`)
      .join("");
  }
  return result;
}

function readingTime(html) {
  if (!html) return 1;
  const text = html.replace(/<[^>]+>/g, "");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function CMSDynamicPage() {
  const { slug } = useParams();
  const { data: response, isLoading, error } = useGetPageBySlugQuery(slug);
  const page = response?.data;
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);

  const formattedContent = useMemo(() => parseContent(page?.content), [page?.content]);
  const mins = useMemo(() => readingTime(formattedContent), [formattedContent]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading)
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" }}>
        <LoadingSpinner size={80} color="border-blue-500" />
      </div>
    );

  if (error || !page)
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617", padding: "24px" }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ width: 80, height: 80, margin: "0 auto 24px", borderRadius: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileText size={36} color="#475569" />
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: "#fff", marginBottom: 12 }}>Page Not Found</h2>
          <p style={{ color: "#94a3b8", marginBottom: 32, lineHeight: 1.6 }}>The document you're looking for was moved or doesn't exist.</p>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "#2563eb", color: "#fff", borderRadius: 14, fontWeight: 700, textDecoration: "none" }}>
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </div>
    );

  const updatedDate = new Date(page.updatedAt).toLocaleDateString("en-US", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .cmspage-wrap {
          font-family: 'Sora', sans-serif;
          background: #f1f5f9;
          min-height: 100vh;
          overflow-x: hidden;
          width: 100%;
        }

        /* ── READ PROGRESS ── */
        .cms-progress {
          position: fixed;
          top: 0; left: 0;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #6366f1);
          z-index: 9999;
          transition: width 0.1s linear;
          pointer-events: none;
        }

        /* ── TOPBAR ── */
        .cms-topbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 500;
          transition: background 0.3s, box-shadow 0.3s;
        }
        .cms-topbar.scrolled {
          background: rgba(2,6,23,0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 1px 0 rgba(255,255,255,0.06);
        }
        .cms-topbar-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        @media (min-width: 768px) { .cms-topbar-inner { padding: 20px 48px; } }

        .cms-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: rgba(255,255,255,0.55);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          transition: color 0.2s;
          font-family: 'Sora', sans-serif;
        }
        .cms-back-btn:hover { color: #fff; }
        .cms-back-icon {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.2s;
          flex-shrink: 0;
        }
        .cms-back-btn:hover .cms-back-icon { border-color: rgba(255,255,255,0.5); }
        .cms-share-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.15);
          background: transparent;
          color: rgba(255,255,255,0.5);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .cms-share-btn:hover { color: #fff; border-color: rgba(255,255,255,0.5); }

        /* ── HERO ── */
        .cms-hero {
          background: #020617;
          position: relative;
          overflow: hidden;
          width: 100%;
          padding: 120px 0 80px;
        }
        @media (min-width: 768px) { .cms-hero { padding: 140px 0 90px; } }

        .cms-hero-glow {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 70% 55% at 65% 15%, rgba(59,130,246,0.14) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 15% 85%, rgba(99,102,241,0.09) 0%, transparent 60%);
          pointer-events: none;
        }
        .cms-hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%);
          pointer-events: none;
        }
        .cms-hero-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
          z-index: 2;
        }
        @media (min-width: 768px) { .cms-hero-inner { padding: 0 48px; } }

        .cms-verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(59,130,246,0.28);
          color: #60a5fa;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          padding: 7px 14px;
          border-radius: 100px;
          margin-bottom: 22px;
          font-family: 'Sora', sans-serif;
        }
        .cms-page-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2rem, 5vw, 4.5rem);
          line-height: 1.07;
          color: #fff;
          margin: 0 0 24px;
          text-transform: capitalize;
          word-break: break-word;
        }
        .cms-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .cms-meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #94a3b8;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 8px 14px;
          border-radius: 100px;
          font-family: 'Sora', sans-serif;
          white-space: nowrap;
        }
        .cms-meta-pill.blue {
          background: rgba(59,130,246,0.09);
          border-color: rgba(59,130,246,0.22);
          color: #60a5fa;
        }

        /* ── CONTENT SECTION ── */
        .cms-content-section {
          width: 100%;
          background: #f1f5f9;
          padding-bottom: 80px;
        }
        .cms-content-wrap {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 16px;
        }
        @media (min-width: 640px)  { .cms-content-wrap { padding: 0 24px; } }
        @media (min-width: 1024px) { .cms-content-wrap { padding: 0 48px; } }
        @media (min-width: 1400px) { .cms-content-wrap { padding: 0 64px; } }

        .cms-card {
          background: #fff;
          border-radius: 20px;
          box-shadow:
            0 2px 4px rgba(0,0,0,0.04),
            0 12px 40px -8px rgba(0,0,0,0.1);
          margin-top: -44px;
          padding: 32px 18px;
          width: 100%;
          overflow: hidden;
        }
        @media (min-width: 640px)  { .cms-card { padding: 44px 36px; } }
        @media (min-width: 768px)  { .cms-card { padding: 56px 56px; } }
        @media (min-width: 1024px) { .cms-card { padding: 64px 80px; } }

        /* ── ARTICLE PROSE ── */
        .cms-article {
          font-family: 'Sora', sans-serif;
          font-size: 16px;
          line-height: 1.85;
          color: #334155;
          word-break: break-word;
          overflow-wrap: break-word;
          overflow: hidden;
          width: 100%;
        }
        @media (min-width: 768px) { .cms-article { font-size: 17px; } }

        .cms-article * {
          max-width: 100%;
          box-sizing: border-box;
        }
        .cms-article h1 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.7rem, 3.5vw, 2.8rem);
          color: #0f172a; line-height: 1.12;
          margin: 0 0 24px; word-break: break-word;
        }
        .cms-article h2 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.35rem, 2.5vw, 2rem);
          color: #0f172a;
          margin: 52px 0 14px;
          padding-bottom: 12px;
          border-bottom: 2px solid #f1f5f9;
          position: relative;
          word-break: break-word;
        }
        .cms-article h2::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 36px; height: 2px;
          background: #3b82f6; border-radius: 2px;
        }
        .cms-article h3 {
          font-size: clamp(1rem, 2vw, 1.25rem);
          font-weight: 800; color: #1e293b;
          margin: 32px 0 10px; letter-spacing: -0.01em;
          word-break: break-word;
        }
        .cms-article h4 {
          font-size: 0.95rem; font-weight: 800;
          color: #1e293b; margin: 24px 0 8px;
          text-transform: uppercase; letter-spacing: 0.06em;
        }
        .cms-article p {
          margin: 0 0 18px; color: #475569;
          line-height: 1.85; word-break: break-word; overflow-wrap: break-word;
        }
        .cms-article strong { color: #0f172a; font-weight: 800; }
        .cms-article em { color: #3b82f6; font-style: italic; }
        .cms-article a {
          color: #2563eb; font-weight: 700;
          text-decoration: none;
          border-bottom: 1px solid rgba(37,99,235,0.3);
          transition: border-color 0.2s; word-break: break-all;
        }
        .cms-article a:hover { border-color: #2563eb; }
        .cms-article ul, .cms-article ol {
          margin: 18px 0; padding: 0; list-style: none;
        }
        .cms-article ul li, .cms-article ol li {
          color: #475569; padding: 8px 0 8px 26px;
          position: relative; border-bottom: 1px solid #f8fafc;
          font-size: 15px; line-height: 1.7; word-break: break-word;
        }
        .cms-article ul li::before {
          content: ''; position: absolute;
          left: 4px; top: 50%; transform: translateY(-50%);
          width: 7px; height: 7px;
          background: #3b82f6; border-radius: 50%;
        }
        .cms-article ol { counter-reset: ol-c; }
        .cms-article ol li { counter-increment: ol-c; }
        .cms-article ol li::before {
          content: counter(ol-c);
          position: absolute; left: 0; top: 8px;
          width: 20px; height: 20px;
          background: #eff6ff; color: #2563eb;
          font-size: 10px; font-weight: 800;
          border-radius: 5px; text-align: center; line-height: 20px;
        }
        .cms-article blockquote {
          background: linear-gradient(135deg, #eff6ff, #eef2ff);
          border-left: 4px solid #3b82f6;
          border-radius: 0 14px 14px 0;
          padding: 18px 22px; margin: 24px 0;
          font-style: italic; color: #1e3a5f;
          font-size: 16px; font-weight: 500;
        }
        .cms-article hr {
          margin: 44px 0; border: none; height: 1px;
          background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
        }
        .cms-article img {
          width: 100%; max-width: 100%; height: auto;
          border-radius: 14px; margin: 20px 0;
          box-shadow: 0 8px 24px -6px rgba(0,0,0,0.12); display: block;
        }
        .cms-article table {
          width: 100%; border-collapse: collapse;
          margin: 20px 0; font-size: 14px;
          display: block; overflow-x: auto;
        }
        .cms-article th {
          background: #f8fafc; color: #0f172a;
          font-weight: 800; text-align: left;
          padding: 11px 14px; border-bottom: 2px solid #e2e8f0; white-space: nowrap;
        }
        .cms-article td {
          padding: 11px 14px; border-bottom: 1px solid #f1f5f9; color: #475569;
        }

        /* ── FOOTER ── */
        .cms-footer-card {
          margin-top: 56px; padding-top: 36px;
          border-top: 1px solid #f1f5f9;
        }
        .cms-footer-inner {
          display: flex; flex-direction: column; gap: 18px;
          background: linear-gradient(135deg, #f8fafc, #eff6ff);
          border: 1px solid #e2e8f0;
          padding: 22px; border-radius: 18px;
        }
        @media (min-width: 640px) {
          .cms-footer-inner {
            flex-direction: row; align-items: center;
            justify-content: space-between; padding: 24px 28px;
          }
        }
        .cms-footer-badge { display: flex; align-items: center; gap: 14px; }
        .cms-footer-icon {
          width: 48px; height: 48px; background: #0047AB;
          border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
          color: #fff; flex-shrink: 0;
          box-shadow: 0 6px 16px -4px rgba(0,71,171,0.35);
        }
        .cms-footer-cta {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 12px 22px; background: #0047AB; color: #fff;
          border-radius: 100px; font-size: 11px; font-weight: 800;
          letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none; transition: all 0.2s; white-space: nowrap;
          font-family: 'Sora', sans-serif;
          box-shadow: 0 5px 16px -4px rgba(0,71,171,0.4);
        }
        .cms-footer-cta:hover {
          background: #003d99; transform: translateY(-2px);
          box-shadow: 0 9px 22px -4px rgba(0,71,171,0.5);
        }
      `}</style>

      {/* ── Progress bar ── */}
      <ScrollProgress />

      <div className="cmspage-wrap">

        {/* ── FIXED TOPBAR ── */}
        {/* <nav className={`cms-topbar${scrolled ? " scrolled" : ""}`}>
          <div className="cms-topbar-inner">
            <Link href="/" className="cms-back-btn">
              <span className="cms-back-icon"><ArrowLeft size={13} /></span>
              Back to Explore
            </Link>
            <button className="cms-share-btn" onClick={handleShare} title="Copy link">
              {copied ? <CheckCircle size={15} color="#4ade80" /> : <Share2 size={15} />}
            </button>
          </div>
        </nav> */}

        {/* ── HERO ── */}
        {/* <div className="cms-hero">
          <div className="cms-hero-glow" />
          <div className="cms-hero-grid" />
          <div className="cms-hero-inner">
            <div className="cms-verified-badge">
              <ShieldCheck size={13} /> Official Verified Document
            </div>
            <h1 className="cms-page-title">{page.title}</h1>
            <div className="cms-meta-row">
              <span className="cms-meta-pill">
                <Clock size={12} style={{ color: "#60a5fa" }} /> Updated {updatedDate}
              </span>
              <span className="cms-meta-pill">⏱ {mins} min read</span>
              <span className="cms-meta-pill blue">Fun Tours Dubai</span>
            </div>
          </div>
        </div> */}

        {/* ── CONTENT CARD ── */}
        <div className="cms-content-section mt-20">
          <div className="cms-content-wrap">
            <div className="cms-card">
              <article
                className="cms-article"
                dangerouslySetInnerHTML={{ __html: formattedContent }}
              />
              <div className="cms-footer-card">
                <div className="cms-footer-inner">
                  <div className="cms-footer-badge">
                    <div className="cms-footer-icon">
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 13, fontFamily: "'Sora',sans-serif" }}>
                        Official Tourism Partner
                      </div>
                      <div style={{ color: "#64748b", fontSize: 12, fontWeight: 600, marginTop: 3, fontFamily: "'Sora',sans-serif" }}>
                        FUN TOURS DUBAI TOURISM L.L.C
                      </div>
                    </div>
                  </div>
                  <Link href="/activity" className="cms-footer-cta">
                    View Our Adventures →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

// ── Scroll Progress ────────────────────────────────────────────────────────────
function ScrollProgress() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setWidth(total > 0 ? (el.scrollTop / total) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <div className="cms-progress" style={{ width: `${width}%` }} />;
}