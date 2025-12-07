import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage'
import LogInPage from './components/LoginPage'
import Dashboard from './components/Dashboard'
import BookingPage from './components/BookingPage'
import RegisterPage from './components/RegisterPage'
import MessagePage from './components/MessagePage'
import CalendarPage from './components/CalendarPage'
import PostRegisterPage from './components/PostRegister'
import SettingsPage from './components/SettingsPage'
import DoctorProfile from './components/DoctorProfile'
import AppointmentsPage from './components/Appointment';
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/doctor-profile" element={<DoctorProfile />} />
        <Route path="/message" element={<MessagePage />} />
        <Route path="/post-register" element={<PostRegisterPage />} />
        <Route path="/book-appointment" element={<BookingPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
