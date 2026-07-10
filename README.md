<div align="center">
  <h1>🚀 HackDesk - Passion Edition</h1>
  <p><strong>An Intelligent, Concurrency-Proof Hackathon Management Platform</strong></p>

  ![Next JS](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
</div>

---

**HackDesk** is a high-performance event management system designed to seamlessly handle large-scale hackathons. It features a robust registration and check-in system, alongside a unique **AI-powered Hackathon Idea Generator** equipped with **atomic locking** to prevent race conditions during high-traffic claim events.

Built with modern web technologies to ensure low latency, high availability, and a premium user experience.

## ✨ Key Features

**👥 Smart Registration & Attendance:**
Bulk-import participants via CSV parsing.
Manually add late or on-the-spot attendees seamlessly.
Active Session tracking (e.g., "Day 1", "Day 2") for accurate multi-day check-ins.

**🧠 AI-Powered Idea Pool (Pre-generation & Smart Fallback Architecture):**
Organizers can generate batches of beginner-friendly project ideas based on specific themes using the Google Gemini AI API.
Pre-generating ideas prevents API rate limits and keeps the end-user experience lightning fast. If the pool runs empty, the system uses Google AI as a live fallback to generate ideas on the spot.

**🔒 Concurrency-Proof Idea Claiming:**
Engineered with atomic database transactions.
If 100 students click "Generate" at the exact same millisecond, the PostgreSQL backend uses strict isolation and row-level locking to ensure one unique idea is assigned per student. Zero duplicate claims.

**📊 Admin Dashboard:**
Clean, intuitive UI for event organizers to manage themes, monitor the idea pool, and export attendance data.

## 🛠️ Tech Stack

**Framework:** Next.js 16 (App Router)
**Language:** TypeScript
**Styling:** Tailwind CSS
**Database & Auth:** Supabase (PostgreSQL) with Row Level Security (RLS)
**AI Engine:** Google Gemini AI (LLM Inference)

## 🚦 Getting Started

**Prerequisites**
Make sure you have Node.js installed on your machine. You will also need active Supabase and Google AI Studio accounts.

**1. Clone the repository**
```bash
git clone [https://github.com/CodeWithMehru/HackDesk-Passion-Edition.git](https://github.com/CodeWithMehru/HackDesk-Passion-Edition.git)
cd HackDesk-Passion-Edition