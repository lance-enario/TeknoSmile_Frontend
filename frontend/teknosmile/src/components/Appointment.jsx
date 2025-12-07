import React from 'react';
import { 
  Person
} from '@mui/icons-material';
import styles from './Appointment.module.css'; // Changed import
import Sidebar from './Sidebar';

export default function AppointmentsPage() {
  
  // Mock Data based on the image
  const appointments = [
    {
      id: 1,
      doctorName: 'Dr. Lorem Ipsum',
      service: 'Dental Exam',
      date: 'September 30, 2025',
      time: '10:30 A.M'
    },
    // Adding a few more for demonstration
    {
      id: 2,
      doctorName: 'Dr. Jane Doe',
      service: 'Teeth Cleaning',
      date: 'October 05, 2025',
      time: '02:00 P.M'
    },
    {
      id: 3,
      doctorName: 'Dr. John Smith',
      service: 'Root Canal',
      date: 'October 12, 2025',
      time: '09:00 A.M'
    }
  ];

  return (
    <div className={styles.appointmentsPageWrapper}>
      <div className={styles.pageLayout}>
        <Sidebar />

        <main className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Appointments</h1>

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
        </main>
      </div>
    </div>
  );
}