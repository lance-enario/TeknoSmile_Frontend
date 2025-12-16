import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Person, ChevronLeft, ChevronRight } from '@mui/icons-material'; 
import styles from './BookingPage.module.css';
import api from '../api/axios'; 

// --- HELPER: KEEPS TIME EXACTLY AS SELECTED (Prevents the 8-hour shift) ---
const toLocalISOString = (date) => {
  const pad = (num) => String(num).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  
  // Hardcode seconds to 00 to satisfy strict APIs
  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
};

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const passedDentistId = location.state?.dentistId;

  // --- State ---
  const [dentist, setDentist] = useState(null); 
  const [dentistServices, setDentistServices] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [notes, setNotes] = useState('');

  // --- Fetch Logic ---
  useEffect(() => {
    if (!passedDentistId) {
      alert("Please select a dentist from the dashboard first.");
      navigate('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const dentistsResponse = await api.get('/dentists');
        const foundDentist = dentistsResponse.data.find(d => d.userId === passedDentistId);

        if (foundDentist) {
          setDentist({
            id: foundDentist.userId,
            name: `Dr. ${foundDentist.profile?.firstName || ''} ${foundDentist.profile?.lastName || ''}`,
            location: foundDentist.profile?.address || 'Location not available',
            schedule: {
              weekdays: "9:00A.M - 5:00P.M Monday-Friday",
              weekend: "Closed"
            }
          });

          try {
            const servicesResponse = await api.get(`/services/dentist/${passedDentistId}`);
            setDentistServices(servicesResponse.data); 
          } catch (serviceErr) {
            console.error("Failed to fetch services", serviceErr);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to load booking details", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [passedDentistId, navigate]);

  // --- Calendar Helpers ---
  const getFormattedDate = () => {
    const day = selectedDay < 10 ? `0${selectedDay}` : selectedDay;
    const month = currentDate.getMonth() + 1 < 10 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDay(1); 
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDay(1);
  };

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const renderCalendarDays = () => {
    const totalDays = daysInMonth(currentDate);
    const startDay = firstDayOfMonth(currentDate);
    const daysArray = [];

    for (let i = 0; i < startDay; i++) {
      daysArray.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
    }

    for (let i = 1; i <= totalDays; i++) {
      const isSelected = i === selectedDay;
      daysArray.push(
        <div 
          key={i} 
          className={`${styles.calDay} ${isSelected ? styles.selected : ''}`}
          onClick={() => setSelectedDay(i)}
        >
          {i}
        </div>
      );
    }
    return daysArray;
  };

  // --- API Submission ---
  const handleConfirmAppointment = async () => {
    const userStorage = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    let patientId = null;

    if (userStorage) {
      try {
        const userObj = JSON.parse(userStorage);
        patientId = userObj.userId;
      } catch (e) {
        console.error("Error parsing user data");
      }
    }

    if (!patientId || !token) {
      alert("Please log in to book.");
      return;
    }
    
    if (!selectedTime || !selectedServiceId || !dentist) {
      alert("Please fill in all fields (Time and Service).");
      return;
    }

    // --- Time Interval Check ---
    const [hoursStr, minutesStr] = selectedTime.split(':');
    const minutes = parseInt(minutesStr);
    const hours = parseInt(hoursStr);

    if (minutes % 15 !== 0) {
      alert("Appointments must be in 15-minute intervals (e.g., :00, :15, :30, :45)");
      return;
    }

    // --- WARNING: 5:15 PM is technically "Closed" ---
    // If schedule is 9:00 - 17:00, then 17:15 is outside business hours.
    // I added this check to save you the API error.
    if (hours >= 17 && minutes > 0) {
        alert("The clinic closes at 5:00 PM. Please choose an earlier time.");
        return;
    }

    // 2. Construct Date Object
    const appointmentDateTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      selectedDay,
      hours,
      minutes
    );

    // 3. Payload Construction
    const payload = {
      patientId: parseInt(patientId),
      dentistId: dentist.id,
      // FIX: Use the custom helper instead of .toISOString()
      appointmentTime: toLocalISOString(appointmentDateTime), 
      durationMinutes: 60,
      notes: notes || "No notes",
      serviceIds: [ parseInt(selectedServiceId) ],
      preferredDentistGender: "Any",
      preferredLanguage: "English"
    };

    console.log("Sending Payload:", payload);

    try {
      await api.post('/patients/appointments/book', payload, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert("Appointment Booked Successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Booking Error:", error);
      const msg = error.response?.data?.message || "Failed to book appointment.";
      alert(`Error: ${msg}`);
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
          {/* --- LEFT FORM --- */}
          <div className={styles.bookingForm}>
            <div className={styles.formSection}>
              <label className={styles.sectionLabel}>Select your schedule:</label>
              <div className={styles.scheduleInputs}>
                <div className={styles.inputGroup}>
                  <input 
                    type="text" 
                    className={styles.formInput} 
                    value={getFormattedDate()}
                    readOnly 
                  />
                </div>
                <div className={styles.inputGroup}>
                  <input 
                    type="time" 
                    step="900" // Forces 15 min steps in Chrome
                    className={styles.formInput} 
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </div>
              </div>
              
              <div className={styles.calendarPlaceholder}>
                <div className={styles.calendarHeader}>
                  <button onClick={prevMonth} className={styles.navButton}><ChevronLeft /></button>
                  <span className={styles.monthLabel}>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                  <button onClick={nextMonth} className={styles.navButton}><ChevronRight /></button>
                </div>
                <div className={styles.calendarGrid}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className={styles.calDayName}>{day}</div>
                  ))}
                  {renderCalendarDays()}
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <label className={styles.sectionLabel}>Select your service:</label>
              <select 
                className={styles.formSelect} 
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
              >
                 <option value="" disabled>Select Service</option>
                 {dentistServices.map(service => (
                   <option key={service.serviceId} value={service.serviceId}>
                     {service.serviceName}
                   </option>
                 ))}
              </select>
            </div>
             <div className={styles.formSection}>
              <label className={styles.sectionLabel}>Additional message</label>
              <textarea 
                className={styles.formTextarea}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* --- RIGHT SUMMARY --- */}
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
                          {dentistServices.length > 0 ? (
                            dentistServices.map(s => <li key={s.serviceId}>{s.serviceName}</li>)
                          ) : (
                            <li>No services listed</li>
                          )}
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
              <button className={styles.confirmBtn} onClick={handleConfirmAppointment}>
                Confirm Appointment
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingPage;