import React from 'react';
import Sidebar from './Sidebar';
import { Person } from '@mui/icons-material';
import styles from './BookingPage.module.css'; // Changed import

const BookingPage = () => {
  return (
    <div className={styles.bookingPageWrapper}>
      <Sidebar />
      
      <main className={`${styles.mainContent} ${styles.bookingContent}`}>
        <h1 className={styles.pageTitle}>Book an Appointment</h1>
        
        <div className={styles.bookingGrid}>
          <div className={styles.bookingForm}>
            <div className={styles.formSection}>
              <label className={styles.sectionLabel}>Select your schedule:</label>
              <div className={styles.scheduleInputs}>
                <div className={styles.inputGroup}>
                  <input type="date" className={styles.formInput} placeholder="MM/DD/YYYY" />
                </div>
                <div className={styles.inputGroup}>
                  <input type="time" className={styles.formInput} placeholder="00:00" />
                </div>
              </div>
              
              {/* Calendar Placeholder */}
              <div className={styles.calendarPlaceholder}>
                <div className={styles.calendarHeader}>August</div>
                <div className={styles.calendarGrid}>
                  <div className={styles.calDayName}>Sun</div>
                  <div className={styles.calDayName}>Mon</div>
                  <div className={styles.calDayName}>Tue</div>
                  <div className={styles.calDayName}>Wed</div>
                  <div className={styles.calDayName}>Thu</div>
                  <div className={styles.calDayName}>Fri</div>
                  <div className={styles.calDayName}>Sat</div>
                  
                  {[...Array(31)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`${styles.calDay} ${i === 15 ? styles.selected : ''}`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <label className={styles.sectionLabel}>Select your service:</label>
              <select className={styles.formSelect}>
                <option>Select Service</option>
                <option>Dental Exam</option>
                <option>Teeth Cleaning</option>
                <option>Root Canal</option>
              </select>
            </div>

            <div className={styles.formSection}>
              <label className={styles.sectionLabel}>Additional message</label>
              <textarea className={styles.formTextarea}></textarea>
            </div>
          </div>

          <div className={styles.bookingSummary}>
            <div className={styles.summaryCard}>
              <div className={styles.dentistHeader}>
                <div className={styles.dentistAvatar}>
                  <Person fontSize="large" />
                </div>
                <h3>Dr. Lorem Ipsum</h3>
              </div>
              
              <div className={styles.dentistInfo}>
                <div className={styles.infoSection}>
                  <span className={styles.label}>Location</span>
                  <ul><li>Lorem Ipsum</li></ul>
                </div>
                
                <div className={styles.infoSection}>
                  <span className={styles.label}>Services:</span>
                  <ul>
                    <li>Lorem Ipsum</li>
                    <li>Lorem Ipsum</li>
                    <li>Lorem Ipsum</li>
                  </ul>
                </div>

                <div className={styles.infoSection}>
                  <span className={styles.label}>Available Schedule</span>
                  <ul>
                    <li>10:00A.M - 5:00P.M Monday-Friday</li>
                    <li>1:00P.M - 5:00P.M Saturday - Sunday</li>
                  </ul>
                </div>
              </div>
              
              <div className={styles.summaryImage}></div>
            </div>
            
            <div className={styles.actionArea}>
              <button className={styles.confirmBtn}>Confirm Appointment</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingPage;