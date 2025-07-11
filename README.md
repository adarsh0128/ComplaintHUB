Complaint Management System (MERN/Next.js)

A modern, full-stack complaint management system built with Next.js (React), MongoDB, and TypeScript. Features a user-friendly complaint submission form, admin dashboard with filtering, status updates, CSV export, analytics, email notifications, authentication, and is ready for one-click deployment on Vercel.

---

######## Features

- **User Complaint Submission**: Simple, accessible form for users to submit complaints.
- **Admin Dashboard**: View, filter, search, update status, delete, and export complaints.
- **Analytics**: Visual breakdown of complaint status and priority.
- **Expandable Ticket Rows**: Click any ticket to view full details in an animated card.
- **Email Notifications**: Confirmation to users and notifications to admin on new complaints.
- **Authentication**: Secure admin login (NextAuth.js, credentials-based, database-backed).
- **Responsive UI**: Modern, mobile-friendly design with Tailwind CSS.
- **Pagination**: Efficient navigation for large complaint datasets.
- **CSV Export**: Download filtered complaints for reporting.
- **MongoDB Integration**: Stores all complaints securely.
- **Vercel Ready**: One-click deploy with `vercel.json` and environment variable support.

---

######## Progress & Workflow

This project follows a strict workflow for quality and maintainability:

- Research → Plan → Implement, with validation checkpoints after each major step.
- All code is linted, type-checked, and tested before merging.
- Progress and next steps are tracked in [`PROGRESS.md`](./PROGRESS.md) and [`TODO.md`](./TODO.md).
- See [`copilot.md`](./copilot.md) for workflow rules and best practices.

---

######## Project Structure

```
mern-project/
├── src/
│   ├── app/           # Next.js app directory (pages, API routes)
│   ├── components/    # React UI components
│   ├── lib/           # Database, email, and utility functions
│   ├── models/        # Mongoose models (Complaint)
│   └── types/         # TypeScript types
├── .env.local         # Environment variables (not committed)
├── vercel.json        # Vercel deployment config
├── package.json       # Project dependencies and scripts
├── README.md          # This file
└── ...
```

---

######## Getting Started (Beginner Friendly)

######## 1. **Clone the Repository**

```bash
git clone <your-repo-url>
cd mern-project
```

######## 2. **Install Dependencies**

```bash
npm install
```

######## 3. **Set Up Environment Variables**

Create a `.env.local` file in the root directory:

```
MONGODB_URI=your-mongodb-connection-string
EMAIL_USER=your-gmail-address
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-admin-password
NEXTAUTH_SECRET=your-random-secret
```

- **MONGODB_URI**: MongoDB connection string (e.g. from MongoDB Atlas)
- **EMAIL_USER/EMAIL_PASS**: Gmail address and [App Password](https://support.google.com/accounts/answer/185833?hl=en) for sending emails
- **ADMIN_EMAIL/ADMIN_PASSWORD**: Credentials for admin login (must match what you use to log in as admin)
- **NEXTAUTH_SECRET**: Any random string (for session security)

######## 4. **Run Locally**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

######## Usage

- **Submit Complaint**: `/submit` (public)
- **Admin Dashboard**: `/admin` (login required)
- **Admin Login**: `/admin/login`

---

######## Tech Stack

- Next.js 14 (App Router, API routes)
- React 18
- TypeScript
- MongoDB & Mongoose
- NextAuth.js (credentials)
- Nodemailer
- Tailwind CSS
- Vercel (deployment)

---

######## Project Status

- [x] Initial project setup
- [x] Backend: MongoDB, Mongoose, API routes
- [x] Frontend: Next.js, React, Tailwind
- [x] Complaint schema & CRUD endpoints
- [x] Email notifications
- [x] Admin dashboard (filter, search, status, delete, export)
- [x] Authentication (admin, database-backed)
- [x] Pagination, CSV export
- [x] Analytics section (status & priority breakdown)
- [x] Expandable ticket rows (animated details)
- [x] Vercel deployment config
- [x] Documentation (this README)
