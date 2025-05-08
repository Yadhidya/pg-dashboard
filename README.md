# 🏠 PG Booking Dashboard

A responsive booking dashboard designed for PG (Paying Guest) owners to manage room bookings and view booking statistics. Built with **React.js** and **TailwindCSS**, the dashboard simulates room setup, bookings, and visualizes revenue and booking data.

---

## 🚀 Features

- 📅 **Room Setup**: Configure room names, types (Single/Double/Triple/Custom), prices, and capacity per floor.
- 👥 **Bookings**: Book rooms for customers with name, date, phone number, and view availability.
- 📊 **Dashboard**:
  - Line chart showing **weekly revenue**
  - Summary of **today's bookings** and **this week's revenue**
- 💸 **Revenue Page**:
  - Lists **all completed bookings** with unique booking IDs
  - Displays total **revenue generated per booking**
- 📁 **Sidebar Navigation**: Easily switch between views (Dashboard, Bookings, Revenue, Settings).
- 📱 **Responsive UI** using TailwindCSS
- 🔒 **Error Handling** for overbooked rooms or missing details
- ❌ **Cancel Bookings** feature

---

## 📦 Tech Stack

- **React.js** (with Hooks and Context API)
- **TailwindCSS**
- **Recharts** (for revenue graph)
- **LocalStorage** (for temporary data persistence)

---

## 🛠️ How to Run Locally

Follow these steps to get the project running on your local machine:

1. **Clone the repository and install dependencies**:

   Open a terminal, navigate to the folder where you want to clone the project, and run the following commands:
   
   ```bash
   git clone https://github.com/Yadhidya/pg-dashboard.git
   cd pg-dashboard
   npm install
