# BarberShop Frontend

Modern frontend for Barbershop Booking & Management system with a sleek black, white, and red design matching the brand logo.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** for fast development
- **TailwindCSS** for styling with custom theme
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons

## Design Theme

The frontend uses a minimalist design inspired by the logo:
- **Primary Color**: Black (#000000)
- **Secondary Color**: White (#FFFFFF)
- **Accent Color**: Red (#DC2626)
- Clean, modern UI with high contrast

## Features

- 🔐 User authentication (login/register)
- 📅 Online booking system
- 👤 Customer dashboard
- 💈 Barber selection with availability
- ✂️ Service catalog
- 📊 Booking history and status tracking
- 🎨 Responsive design

## Getting Started

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

## API Configuration

The frontend is configured to proxy API requests to the backend running on `http://localhost:3000`. Make sure the backend is running before starting the frontend.

## Demo Accounts

- **Admin**: admin@barber.com / admin123
- **Barber**: barber1@barber.com / barber123
- **Customer**: Register a new account

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.
