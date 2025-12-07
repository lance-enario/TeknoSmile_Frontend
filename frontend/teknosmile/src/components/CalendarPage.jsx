import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  EventAvailable 
} from '@mui/icons-material';
import styles from './CalendarPage.module.css'; // Changed import
import Sidebar from './Sidebar';

export default function CalendarPage() {
  
  // Generating grid cells for the demo (Standard 5x7 grid)
  const days = Array.from({ length: 35 }, (_, i) => i + 1);

  return (
    <>
      <div className={styles.calendarPageWrapper}>
        {/* Using the external sidebar as requested */}
        <Sidebar />

        <main className={styles.mainContent}>
          
          {/* Header Controls */}
          <header className={styles.calendarHeader}>
            <button className={styles.btnAppointments}>
              <EventAvailable fontSize="small" />
              Go to appointments
            </button>

            <div className={styles.monthNav}>
              <button className={styles.navArrow}><ChevronLeft fontSize="large" /></button>
              <span className={styles.monthTitle}>September</span>
              <button className={styles.navArrow}><ChevronRight fontSize="large" /></button>
            </div>

            <div className={styles.viewToggle}>
              <button className={styles.toggleBtn}>Day</button>
              <button className={styles.toggleBtn}>Week</button>
              {/* Combine generic button class with active class */}
              <button className={`${styles.toggleBtn} ${styles.active}`}>Month</button>
            </div>
          </header>

          {/* Calendar Grid */}
          <div className={styles.calendarContainer}>
            <div className={styles.calendarGrid}>
              {days.map((day, index) => {
                // Determine if this specific cell should have the appointment
                const hasAppointment = index === 27; 

                return (
                  <div key={index} className={styles.calendarCell}>
                    {/* Only showing numbers for visual demo based on array index */}
                    <span className={styles.dateNumber}>{index < 31 ? index + 1 : ''}</span>
                    
                    {hasAppointment && (
                      <div className={styles.appointmentBadge}>
                        10:30 appointment
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </main>
      </div>
    </>
  );
}