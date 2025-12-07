import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MedicalServices, 
  AutoAwesome, 
  CalendarMonth, 
  VerifiedUser 
} from '@mui/icons-material';
import styles from './LandingPage.module.css'; // Changed import

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.landingPage}>
      <div className={styles.leftPanel}>
        <div className={styles.logo}>
          <MedicalServices className={styles.logoIcon} fontSize="large" /> TeknoSmile
        </div>
        <div className={styles.heroContent}>
          <h1>Looking for a Dentist?</h1>
          <p className={styles.subtitle}>Book your appointment with the best professionals in town.</p>
          <div className={styles.trustIndicators}>
            <span><AutoAwesome fontSize="small" /> Expert Care</span>
            <span><CalendarMonth fontSize="small" /> Easy Scheduling</span>
            <span><VerifiedUser fontSize="small" /> Verified Clinics</span>
          </div>
        </div>
        <div className={styles.leftFooter}>
          <p>© 2025 TeknoSmile</p>
        </div>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.authContainer}>
          <h2>Welcome Back</h2>
          <p className={styles.authSubtitle}>Manage your dental health with ease.</p>
          
          <div className={styles.authButtons}>
            <button 
              className={`${styles.btn} ${styles.btnPrimary}`} 
              onClick={() => navigate('/login')}
            >
              Log in
            </button>
            <button 
              className={`${styles.btn} ${styles.btnSecondary}`} 
              onClick={() => navigate('/register')}
            >
              Sign up
            </button>
          </div>
          
          <div className={styles.helperLinks}>
            <a href="#">Need help?</a>
            <span className={styles.separator}>•</span>
            <a href="#">For Dentists</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;