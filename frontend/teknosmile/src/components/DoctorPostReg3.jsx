import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './DoctorPostReg3.module.css';
import api from '../api/axios'; 

export default function DoctorAvailabilityPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, step1Data, step2Data } = location.state || {};

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [schedule, setSchedule] = useState(
    daysOfWeek.reduce((acc, day) => ({
      ...acc,
      [day]: { enabled: false, start: '', end: '' }
    }), {})
  );

  const toggleDay = (day) => {
    setSchedule(prev => ({ ...prev, [day]: { ...prev[day], enabled: !prev[day].enabled } }));
  };

  const handleTimeChange = (day, type, value) => {
    setSchedule(prev => ({ ...prev, [day]: { ...prev[day], [type]: value } }));
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    // 1. GET THE TOKEN
    const token = localStorage.getItem('token'); 

    if (!userId || !token) {
      alert("Session missing. Please log in again.");
      navigate('/login');
      return;
    }

    // 2. CONFIG FOR HEADERS (The Fix for 403)
    const authHeader = {
      headers: { 
        'Authorization': `Bearer ${token}` 
      }
    };

    try {
      // --- A. CREATE DENTIST PROFILE ---
      const dentistPayload = {
        userId: userId,
        email: step1Data.email,
        password: step1Data.password,
        enabled: true,
        role: "DENTIST",
        profile: {
          userProfileId: userId,
          firstName: step1Data.name,
          middleName: "", 
          lastName: step1Data.surname,
          address: `${step1Data.city}, ${step1Data.barangay}`,
          birthDate: step1Data.birthdate
        },
        contact: step1Data?.contact ?? {
          contactID: contactId,
          type: "PHONE",
          value: step1Data.number || "0000000000"
        },
        serviceCount: step2Data.selectedServices.length
      };
      
      console.log("Creating Dentist Profile...");
      const dentistResponse = await api.post('/dentists', dentistPayload); 
      console.log("/dentists/ called")
      
      const dentistId = dentistResponse.data.dentistId || userId; 
      console.log("Dentist Created with ID:", dentistId);

      // --- B. ASSIGN SERVICES ---
      if (step2Data.selectedServices && step2Data.selectedServices.length > 0) {
        console.log("Assigning Services...");
        const servicePromises = step2Data.selectedServices.map(service => 
          api.post(`/services/${service.serviceId}/dentists/${dentistId}`)
        );
        await Promise.all(servicePromises);
      }

      // --- C. CREATE AVAILABILITY ---
      console.log("Setting Availability...");
      const availabilityPromises = Object.entries(schedule)
        .filter(([day, times]) => times.enabled && times.start && times.end)
        .map(async ([day, times]) => {
          const [startHour, startMinute] = times.start.split(':');
          const [endHour, endMinute] = times.end.split(':');

          const payload = {
            availabilityId: 0,
            dayOfWeek: day.toUpperCase(),
            startTime: { 
                hour: parseInt(startHour), 
                minute: parseInt(startMinute), 
                second: 0, 
                nano: 0 
            },
            endTime: { 
                hour: parseInt(endHour), 
                minute: parseInt(endMinute), 
                second: 0, 
                nano: 0 
            }
          };

          return api.post(`/dentists/${dentistId}/availability`, payload);
        });

      await Promise.all(availabilityPromises);

      // --- D. SUCCESS ---
      alert("Doctor Registration Complete!");
      navigate('/dashboard');

    } catch (error) {
      console.error("Submission Failed Full Error:", error);
      alert(`Failed to complete setup: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className={styles.doctorAvailabilityPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Manage your account (3/3)</h1>
        <div className={styles.sectionTitle}>Availability</div>

        <form onSubmit={handleFinalSubmit} className={styles.availabilityGrid}>
          {daysOfWeek.map((day) => (
            <div key={day} className={styles.dayRow}>
              <div className={styles.dayPill} onClick={() => toggleDay(day)}>
                <span className={styles.dayName}>{day}</span>
                <div className={`${styles.circleCheck} ${schedule[day].enabled ? styles.checked : ''}`}></div>
              </div>

              <div className={styles.timeSection}>
                <input type="time" className={styles.timeInput} value={schedule[day].start} onChange={(e) => handleTimeChange(day, 'start', e.target.value)} disabled={!schedule[day].enabled} />
                <span className={styles.separator}>-</span>
                <input type="time" className={styles.timeInput} value={schedule[day].end} onChange={(e) => handleTimeChange(day, 'end', e.target.value)} disabled={!schedule[day].enabled} />
              </div>
            </div>
          ))}

          <div className={styles.actionFooter}>
            <button type="submit" className={styles.btnContinue}>Finish Setup</button>
          </div>
        </form>
      </div>
    </div>
  );
}