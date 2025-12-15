import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  EventAvailable 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import styles from './CalendarPage.module.css';
import Sidebar from './Sidebar';
import api from '../api/axios';

export default function CalendarPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        
        const user = JSON.parse(userStr);
        const response = await api.get(`/patients/${user.userId}/dashboard`);
        
        const allAppointments = [
          ...(response.data.upcomingAppointments || []),
          ...(response.data.pastAppointments || [])
        ];
        
        setAppointments(allAppointments);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch appointments", error);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
    
    const days = [];
    
    // Add empty slots for days before the first of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getEndTime = (dateString, durationMinutes) => {
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + (durationMinutes || 30)); // Default to 30 if null
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAppointmentsForDay = (date) => {
    if (!date) return [];
    return appointments.filter(appt => {
      const apptDate = new Date(appt.dateTime);
      return apptDate.getDate() === date.getDate() &&
             apptDate.getMonth() === date.getMonth() &&
             apptDate.getFullYear() === date.getFullYear();
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <>
      <div className={styles.calendarPageWrapper}>
        <Sidebar />

        <main className={styles.mainContent}>
          
          {/* Header Controls */}
          <header className={styles.calendarHeader}>
            <button className={styles.btnAppointments} onClick={() => navigate('/appointments')}>
              <EventAvailable fontSize="small" />
              Go to appointments
            </button>

            <div className={styles.monthNav}>
              <button className={styles.navArrow} onClick={handlePrevMonth}><ChevronLeft fontSize="large" /></button>
              <span className={styles.monthTitle}>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <button className={styles.navArrow} onClick={handleNextMonth}><ChevronRight fontSize="large" /></button>
            </div>

            <div className={styles.viewToggle}>
              <button className={styles.toggleBtn}>Day</button>
              <button className={styles.toggleBtn}>Week</button>
              <button className={`${styles.toggleBtn} ${styles.active}`}>Month</button>
            </div>
          </header>

          {/* Calendar Grid */}
          <div className={styles.calendarContainer}>
            <div className={styles.calendarGrid}>
              {/* Day Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className={styles.dayHeader}>{day}</div>
              ))}
              
              {/* Calendar Cells */}
              {days.map((date, index) => {
                const dayAppointments = getAppointmentsForDay(date);
                
                return (
                  <div key={index} className={`${styles.calendarCell} ${!date ? styles.emptyCell : ''}`}>
                    {date && (
                      <>
                        <span className={styles.dateNumber}>{date.getDate()}</span>
                        <div className={styles.appointmentsContainer}>
                          {dayAppointments.map(appt => (
                            <div key={appt.appointmentId} className={styles.appointmentBadge}>
                              {formatTime(appt.dateTime)} - {getEndTime(appt.dateTime, appt.durationMinutes)}
                            </div>
                          ))}
                        </div>
                      </>
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