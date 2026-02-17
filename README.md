# TripNest - AI Travel Companion 🌍✈️

TripNest is a modern, full-stack travel itinerary planner built with Next.js, Supabase, and Tailwind CSS. It helps you organize trips, track expenses, and collaborate with friends in real-time.

![TripNest App](public/icon-512x512.png)

## 🚀 Features

- **📍 Smart Itinerary Builder**: Drag-and-drop interface to plan your days.
- **💰 Budget Tracker**: Visualize expenses with charts and progress bars.
- **🤝 Real-time Collaboration**: Invite friends to edit trips with you.
- **✈️ Flight Search**: Integrated flight search context.
- **🗺️ Interactive Maps**: View your trip on a dynamic map.
- **📱 Mobile Optimized**: Fully responsive design (PWA ready).

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Lucide Icons
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **Charts**: Recharts
- **Maps**: Leaflet / React-Leaflet
- **Drag & Drop**: dnd-kit

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project

### Installation

1.  **Clone the repo**
    ```bash
    git clone https://github.com/yourusername/tripnest.git
    cd tripnest
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔒 Security

- **Row Level Security (RLS)**: All database access is secured via Supabase RLS policies.
- **Authentication**: Secure email/password and social login via Supabase Auth.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
