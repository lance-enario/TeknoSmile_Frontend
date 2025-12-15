import React, { useState, useEffect } from 'react';
import { 
  Person
} from '@mui/icons-material';
import styles from './Appointment.module.css';
import Sidebar from './Sidebar';
import api from '../api/axios';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            setError("User not found. Please log in.");
            setLoading(false);
            return; 
        }
        const user = JSON.parse(userStr);
        const userId = user.userId;

        const response = await api.get(`/patients/${userId}/dashboard`);
        const data = response.data;
        
        const allAppointments = [
            ...(data.upcomingAppointments || []),
            ...(data.pastAppointments || [])
        ];

        const mappedAppointments = allAppointments.map(appt => {
            const dateObj = new Date(appt.dateTime);
            return {
                id: appt.appointmentId,
                doctorName: appt.dentistName || 'Unknown Doctor',
                service: appt.services ? appt.services.join(', ') : 'General Checkup',
                date: dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };
        });

        setAppointments(mappedAppointments);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
        setError("Failed to load appointments.");
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className={styles.appointmentsPageWrapper}>
      <div className={styles.pageLayout}>
        <Sidebar />

        <main className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Appointments</h1>

          {loading ? (
            <p>Loading appointments...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : appointments.length === 0 ? (
             <div style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
                <p>No appointments found.</p>
             </div>
          ) : (
            <div className={styles.appointmentsList}>
              {appointments.map((appt) => (
                <div key={appt.id} className={styles.appointmentCard}>
                  
                  {/* Left: Avatar & Name */}
                  <div className={styles.cardLeft}>
                    <div className={styles.cardAvatar}>
                      <Person style={{ fontSize: 30 }} />
                    </div>
                    <div className={styles.doctorName}>{appt.doctorName}</div>
                  </div>

                  {/* Middle: Service */}
                  <div className={styles.cardMiddle}>
                    <span className={styles.serviceText}>Service: {appt.service}</span>
                  </div>

                  {/* Right: Date & Time */}
                  <div className={styles.cardRight}>
                    <span className={styles.dateText}>{appt.date}</span>
                    <span className={styles.timeText}>{appt.time}</span>
                  </div>

                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}