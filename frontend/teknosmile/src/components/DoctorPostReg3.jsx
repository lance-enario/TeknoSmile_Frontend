import React, { useState } from 'react';
import styles from './DoctorPostReg3.module.css'; // Changed import

export default function DoctorAvailabilityPage() {
  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  // State to track enabled days and times
  // Structure: { Monday: { enabled: false, start: '', end: '' }, ... }
  const [schedule, setSchedule] = useState(
    daysOfWeek.reduce((acc, day) => ({
      ...acc,
      [day]: { enabled: false, start: '', end: '' }
    }), {})
  );

  const toggleDay = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled }
    }));
  };

  const handleTimeChange = (day, type, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [type]: value }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Availability Submitted:', schedule);
  };

  return (
    <div className={styles.doctorAvailabilityPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Manage your account</h1>

        <div className={styles.sectionTitle}>Availability</div>

        <form onSubmit={handleSubmit} className={styles.availabilityGrid}>
          
          {daysOfWeek.map((day) => (
            <div key={day} className={styles.dayRow}>
              
              {/* Day Selection Pill */}
              <div className={styles.dayPill} onClick={() => toggleDay(day)}>
                <span className={styles.dayName}>{day}</span>
                <div 
                  className={`${styles.circleCheck} ${schedule[day].enabled ? styles.checked : ''}`}
                ></div>
              </div>

              {/* Time Selection Pills */}
              <div className={styles.timeSection}>
                <input 
                  type="time" 
                  className={styles.timeInput}
                  value={schedule[day].start}
                  onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                  disabled={!schedule[day].enabled}
                  placeholder="Select time"
                />
                
                <span className={styles.separator}>-</span>
                
                <input 
                  type="time" 
                  className={styles.timeInput}
                  value={schedule[day].end}
                  onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                  disabled={!schedule[day].enabled}
                  placeholder="Select time"
                />
              </div>

            </div>
          ))}

          <div className={styles.actionFooter}>
            <button type="submit" className={styles.btnContinue}>
              Continue
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}