import React, { useState, useRef, useEffect } from 'react';
import { CalendarMonth } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './DoctorPostReg1.module.css';

export default function DoctorPostRegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dateInputRef = useRef(null);

  // Retrieve data passed from Register Page
  const { userId, prefilledData } = location.state || {};

  const [formData, setFormData] = useState({
    name: prefilledData?.firstName || '',
    surname: prefilledData?.lastName || '',
    email: prefilledData?.email || '',
    birthdate: '',
    city: '',
    barangay: '',
    number: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    // Validate basic fields
    if (!formData.name || !formData.surname) {
      alert("Please complete your profile details.");
      return;
    }

    // Go to Step 2, carrying over all data
    navigate('/doctor-clinic-info', {
      state: {
        userId,
        step1Data: formData // Pass this page's data forward
      }
    });
  };

  return (
    <div className={styles.doctorPostRegPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Manage your account (1/3)</h1>
        <div className={styles.sectionTitle}>Profile</div>

        <div className={styles.profileContainer}>
          <div className={styles.profileLeft}>
            <div className={styles.profileCircle}></div>
            <button className={styles.btnEditPhoto}>Edit Photo</button>
          </div>

          <div className={styles.profileRight}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Name</label>
              <input type="text" className={styles.customInput} name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Surname</label>
              <input type="text" className={styles.customInput} name="surname" value={formData.surname} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input type="email" className={styles.customInput} name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Birthdate</label>
              <div className={styles.inputWithIcon}>
                <input type="date" ref={dateInputRef} className={styles.customInput} name="birthdate" value={formData.birthdate} onChange={handleChange} />
                <button type="button" className={styles.inputIconBtn} onClick={() => dateInputRef.current?.showPicker()}>
                  <CalendarMonth fontSize="small" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divider}></div>
        <div className={styles.sectionTitle}>Address</div>

        <div className={styles.addressGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>City</label>
            <input type="text" className={styles.customInput} name="city" value={formData.city} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Barangay</label>
            <input type="text" className={styles.customInput} name="barangay" value={formData.barangay} onChange={handleChange} />
          </div>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Number (Contact)</label>
            <input type="text" className={styles.customInput} name="number" value={formData.number} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.actionFooter}>
          <button className={styles.btnNext} onClick={handleNext}>Next</button>
        </div>
      </div>
    </div>
  );
}