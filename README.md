# Deutsch Mark Academy Website

A modern, responsive website for Deutsch Mark Academy built with React, Vite, and Tailwind CSS.

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx        # Navigation bar with mobile menu
│   ├── Hero.jsx          # Hero section
│   ├── Methodology.jsx   # Three-pillar methodology section
│   ├── Programs.jsx      # Featured programs section
│   ├── WhyUs.jsx         # Why choose us section
│   ├── CTA.jsx           # Call-to-action section
│   ├── Footer.jsx        # Footer
│   ├── CheckCircle.jsx   # Reusable check circle icon
│   └── CmsPanel.jsx      # Open in-site CMS editor
├── content/
│   └── defaultContent.js # Default editable content model
├── hooks/
│   └── useCmsContent.js  # CMS state with local + Supabase sync
├── App.jsx               # Main app component
├── index.css             # Tailwind CSS imports
└── main.jsx              # React entry point

public/                    # Static assets

index.html                # HTML entry point
package.json              # Project dependencies
vite.config.js            # Vite configuration
tailwind.config.js        # Tailwind CSS configuration
postcss.config.js         # PostCSS configuration
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Open CMS

Open [http://localhost:5173/cms](http://localhost:5173/cms) to manage the site content.

The CMS lets you:
- Edit text in every section
- Add/remove/edit featured programs
- Set a custom image URL for each program card (URL-only workflow)
- Change every button/link target
- Save changes with `Save Now` / `Save Now (Cloud)`

### Supabase Cloud CMS (Shared Across Devices)

If you want CMS edits shared across devices/editors, connect Supabase.

1. Install dependencies (already included in this repo):
```bash
npm install
```

2. Create `.env` from `.env.example` and fill values:
```bash
cp .env.example .env
```

3. In Supabase SQL Editor, run:
```sql
-- see full file
-- supabase/schema.sql
```

If you already created the table before enabling CMS login, re-run `supabase/schema.sql` to refresh policies.
This fixes errors like: `new row violates row-level security policy for table "cms_content"`.
If you see `403` from Supabase REST, re-running the same SQL also reapplies required table grants.

4. Restart dev server.

When configured:
- CMS auto-loads content from Supabase table `public.cms_content` (row id: `main`)
- Changes auto-sync to Supabase
- CMS shows sync status + `Save Now (Cloud)` button

When not configured:
- CMS stays in local storage mode automatically

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Features

- ✨ Modern, glassmorphic design
- 📱 Fully responsive (mobile, tablet, desktop)
- 🎨 Tailwind CSS styling
- ⚡ Fast build with Vite
- 🧩 Reusable React components
- 🎯 Scroll-based navbar effects
- 📊 Featured programs showcase
- 🎬 Integrated icon library (lucide-react)
- 🛠️ Built-in open CMS at `/cms`

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **lucide-react** - Icon library
- **PostCSS & Autoprefixer** - CSS processing

## License

All rights reserved © 2024 Deutsch Mark Academy
