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

    if (!userId) {
      alert("Error: Missing User ID. Please restart registration.");
      navigate('/register');
      return;
    }

    try {
      // --- 1. CREATE DENTIST PROFILE ---
      // Matches payload from
      const dentistPayload = {
        userId: userId,
        email: step1Data.email,
        password: "defaultPassword123", // Or handled by backend if not needed here
        enabled: true,
        role: "DENTIST",
        profile: {
          userProfileId: 0, // 0 for new
          firstName: step1Data.name,
          lastName: step1Data.surname,
          middleName: "", 
          address: `${step1Data.city}, ${step1Data.barangay}`,
          birthDate: step1Data.birthdate
        },
        contact: {
             contactID: 0,
             type: "PHONE",
             value: step1Data.number || "0000000000"
        },
        serviceCount: 0 // Backend likely calculates this
      };
      
      console.log("Creating Dentist Profile...");
      const dentistResponse = await api.post('/api/dentists', dentistPayload); 
      
      // We need the ACTUAL dentistId returned by the backend for the next steps
      // Sometimes userId and dentistId are different.
      // Based on Swagger, it likely returns the created object.
      const dentistId = dentistResponse.data.dentistId || userId; 
      console.log("Dentist Created with ID:", dentistId);

      // --- 2. ASSIGN SERVICES ---
      // We must loop through the selected services and assign them one by one.
      // Matches endpoint: /api/services/{serviceId}/dentists/{dentistId}
      if (step2Data.selectedServices && step2Data.selectedServices.length > 0) {
        console.log("Assigning Services...");
        const servicePromises = step2Data.selectedServices.map(service => 
          api.post(`/api/services/${service.serviceId}/dentists/${dentistId}`)
        );
        await Promise.all(servicePromises);
      }

      // --- 3. CREATE AVAILABILITY ---
      // Matches payload from
      console.log("Setting Availability...");
      const availabilityPromises = Object.entries(schedule)
        .filter(([day, times]) => times.enabled && times.start && times.end)
        .map(async ([day, times]) => {
          const [startHour, startMinute] = times.start.split(':');
          const [endHour, endMinute] = times.end.split(':');

          const payload = {
            availabilityId: 0,
            dayOfWeek: day.toUpperCase(), // "MONDAY"
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

          return api.post(`/api/dentists/${dentistId}/availability`, payload);
        });

      await Promise.all(availabilityPromises);

      // --- 4. SUCCESS ---
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