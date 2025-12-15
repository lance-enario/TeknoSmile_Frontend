import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Person, ChevronLeft, ChevronRight } from '@mui/icons-material'; 
import styles from './BookingPage.module.css';
import api from '../api/axios'; 

// --- STATIC HELPERS (Moved outside component) ---
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const toLocalISOString = (date) => {
  const pad = (num) => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
};

const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const passedDentistId = location.state?.dentistId;

  // --- State ---
  const [dentist, setDentist] = useState(null); 
  const [dentistServices, setDentistServices] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [notes, setNotes] = useState('');

  // --- Logic ---
  useEffect(() => {
    if (!passedDentistId) {
      alert("Please select a dentist from the dashboard first.");
      navigate('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Dentist Profile
        const { data: dentists } = await api.get('/dentists');
        const foundDentist = dentists.find(d => d.userId === passedDentistId);

        if (foundDentist) {
          setDentist({
            id: foundDentist.userId,
            name: `Dr. ${foundDentist.profile?.firstName || ''} ${foundDentist.profile?.lastName || ''}`,
            location: foundDentist.profile?.address || 'Location not available',
            schedule: { weekdays: "9:00A.M - 5:00P.M Monday-Friday", weekend: "Closed" }
          });

          // 2. Fetch Services
          const { data: services } = await api.get(`/services/dentist/${passedDentistId}`);
          setDentistServices(services);
        }
      } catch (err) {
        console.error("Error loading details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [passedDentistId, navigate]);

  const handleMonthChange = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
    setSelectedDay(1); 
  };

  const getFormattedDate = () => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
    return d.toLocaleDateString('en-GB'); // Formats as dd/mm/yyyy automatically
  };

  const handleConfirmAppointment = async () => {
    // 1. Auth Check
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const patientId = user.userId;

    if (!patientId || !token) return alert("Please log in to book.");
    if (!selectedTime || !selectedServiceId || !dentist) return alert("Please fill in all fields.");

    // 2. Time Validation
    const [hours, minutes] = selectedTime.split(':').map(Number);
    if (minutes % 15 !== 0) return alert("Appointments must be in 15-minute intervals.");
    if (hours >= 17 && minutes > 0) return alert("Clinic closes at 5:00 PM.");

    // 3. Build Payload
    const appointmentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay, hours, minutes);
    
    const payload = {
      patientId: parseInt(patientId),
      dentistId: dentist.id,
      appointmentTime: toLocalISOString(appointmentDate), 
      durationMinutes: 60,
      notes: notes || "No notes",
      serviceIds: [parseInt(selectedServiceId)],
      preferredDentistGender: "Any",
      preferredLanguage: "English"
    };

    try {
      await api.post('/patients/appointments/book', payload, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert("Appointment Booked Successfully!");
      navigate('/dashboard');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || "Booking Failed"}`);
    }
  };

  if (loading) return <div className={styles.loading}>Loading Details...</div>;
  if (!dentist) return <div className={styles.error}>Doctor not found.</div>;

  return (
    <div className={styles.bookingPageWrapper}>
      <Sidebar />
      <main className={`${styles.mainContent} ${styles.bookingContent}`}>
        <h1 className={styles.pageTitle}>Book an Appointment</h1>
        <div className={styles.bookingGrid}>
          
          {/* LEFT COLUMN */}
          <div className={styles.bookingForm}>
            <div className={styles.formSection}>
              <label className={styles.sectionLabel}>Select your schedule:</label>
              <div className={styles.scheduleInputs}>
                <div className={styles.inputGroup}>
                  <input type="text" className={styles.formInput} value={getFormattedDate()} readOnly />
                </div>
                <div className={styles.inputGroup}>
                  <input 
                    type="time" 
                    step="900" 
                    className={styles.formInput} 
                    value={selectedTime} 
                    onChange={(e) => setSelectedTime(e.target.value)} 
                  />
                </div>
              </div>
              
              {/* CALENDAR WIDGET */}
              <div className={styles.calendarPlaceholder}>
                <div className={styles.calendarHeader}>
                  <button onClick={() => handleMonthChange(-1)} className={styles.navButton}><ChevronLeft /></button>
                  <span className={styles.monthLabel}>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                  <button onClick={() => handleMonthChange(1)} className={styles.navButton}><ChevronRight /></button>
                </div>
                <div className={styles.calendarGrid}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className={styles.calDayName}>{day}</div>
                  ))}
                  
                  {/* Empty Slots */}
                  {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, i) => (
                    <div key={`empty-${i}`} className={styles.emptyDay}></div>
                  ))}

                  {/* Days */}
                  {Array.from({ length: getDaysInMonth(currentDate) }).map((_, i) => {
                    const dayNum = i + 1;
                    return (
                      <div 
                        key={dayNum} 
                        className={`${styles.calDay} ${dayNum === selectedDay ? styles.selected : ''}`}
                        onClick={() => setSelectedDay(dayNum)}
                      >
                        {dayNum}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <label className={styles.sectionLabel}>Select your service:</label>
              <select className={styles.formSelect} value={selectedServiceId} onChange={(e) => setSelectedServiceId(e.target.value)}>
                 <option value="" disabled>Select Service</option>
                 {dentistServices.map(s => <option key={s.serviceId} value={s.serviceId}>{s.serviceName}</option>)}
              </select>
            </div>
             <div className={styles.formSection}>
              <label className={styles.sectionLabel}>Additional message</label>
              <textarea className={styles.formTextarea} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className={styles.bookingSummary}>
             <div className={styles.summaryCard}>
                <div className={styles.dentistHeader}>
                    <div className={styles.dentistAvatar}><Person fontSize="large" /></div>
                    <h3>{dentist.name}</h3>
                </div>
                <div className={styles.dentistInfo}>
                    <div className={styles.infoSection}>
                        <span className={styles.label}>Location</span>
                        <ul><li>{dentist.location}</li></ul>
                    </div>
                    <div className={styles.infoSection}>
                        <span className={styles.label}>Services:</span>
                        <ul>
                          {dentistServices.length > 0 ? dentistServices.map(s => <li key={s.serviceId}>{s.serviceName}</li>) : <li>No services listed</li>}
                        </ul>
                    </div>
                    <div className={styles.infoSection}>
                        <span className={styles.label}>Available Schedule</span>
                        <ul>
                          <li>{dentist.schedule.weekdays}</li>
                          <li>{dentist.schedule.weekend}</li>
                        </ul>
                    </div>
                </div>
             </div>
             <div className={styles.actionArea}>
              <button className={styles.confirmBtn} onClick={handleConfirmAppointment}>Confirm Appointment</button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default BookingPage;