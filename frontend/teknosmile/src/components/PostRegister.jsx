import React, { useState, useRef } from 'react';
import { 
  CalendarMonth,
} from '@mui/icons-material';
import styles from './PostRegister.module.css'; // Changed import

export default function PostRegisterPage() {
  const dateInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    birthdate: '',
    city: '',
    barangay: '',
    number: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCalendarClick = () => {
    if (dateInputRef.current) {
      try {
        dateInputRef.current.showPicker();
      } catch (error) {
        dateInputRef.current.focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
  };

  return (
    <div className={styles.postRegisterPage}> {/* New Wrapper */}
      <div className={styles.container}>
        <h1 className={styles.title}>Manage your account</h1>

        <div className={styles.sectionTitle}>Profile</div>

        {/* --- Profile Section --- */}
        <div className={styles.profileContainer}>
          
          {/* Left: Circle & Edit Button */}
          <div className={styles.profileLeft}>
            <div className={styles.profileCircle}></div>
            <button className={styles.btnEditPhoto}>Edit Photo</button>
          </div>

          {/* Right: Personal Details Inputs */}
          <div className={styles.profileRight}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Name</label>
              <input 
                type="text" 
                className={styles.customInput} 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Surname</label>
              <input 
                type="text" 
                className={styles.customInput} 
                name="surname" 
                value={formData.surname} 
                onChange={handleChange} 
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input 
                type="email" 
                className={styles.customInput} 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Birthdate</label>
              <div className={styles.inputWithIcon}>
                <input 
                  type="date" 
                  ref={dateInputRef} 
                  className={styles.customInput} 
                  name="birthdate" 
                  value={formData.birthdate} 
                  onChange={handleChange} 
                />
                <button type="button" className={styles.inputIconBtn} onClick={handleCalendarClick}>
                  <CalendarMonth fontSize="small" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className={styles.divider}></div>

        <div className={styles.sectionTitle}>Address</div>

        {/* --- Address Section --- */}
        <div className={styles.addressGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>City</label>
            <input 
              type="text" 
              className={styles.customInput} 
              name="city" 
              value={formData.city} 
              onChange={handleChange} 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Barangay</label>
            <input 
              type="text" 
              className={styles.customInput} 
              name="barangay" 
              value={formData.barangay} 
              onChange={handleChange} 
            />
          </div>

          {/* Using Template Literal for multiple classes */}
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Number</label>
            <input 
              type="text" 
              className={styles.customInput} 
              name="number" 
              value={formData.number} 
              onChange={handleChange} 
            />
          </div>
        </div>

        <div className={styles.actionFooter}>
          <button className={styles.btnContinue} onClick={handleSubmit}>
            Continue
          </button>
        </div>

      </div>
    </div>
  );
}