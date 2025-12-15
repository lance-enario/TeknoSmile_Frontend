import React, { useState } from 'react';
import styles from './RegisterPage.module.css';
import {
  Visibility,
  VisibilityOff,
  Google,
  Person,
  MedicalServices
} from '@mui/icons-material';
import { 
  TextField, 
  InputAdornment, 
  IconButton, 
  Divider 
} from '@mui/material';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('patient');

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const role = userType === 'patient' ? 'PATIENT' : 'DENTIST';
      const response = await api.post('/auth/register', {
        firstName,
        lastName,
        email,
        password,
        role
      });
      
      const { accessToken, refreshToken, userId, role: userRole } = response.data;
      
      // Store Session Data
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify({ userId, role: userRole }));
      
      // --- NAVIGATION LOGIC ---
      if (userRole === 'DENTIST' || role === 'DENTIST') {
        // If Doctor, start the setup flow
        // We pass the data we already have so Step 1 is pre-filled
        navigate('/doctor-post-register', { 
          state: { 
            userId,
            prefilledData: { firstName, lastName, email, role } 
          } 
        });
      } else {
        // If Patient, go straight to dashboard
        navigate('/dashboard');
      }

    } catch (error) {
      console.error("Registration failed", error);
      alert("Registration failed. Please try again.");
    }
  };

  const toggleUserType = () => {
    setUserType(userType === 'patient' ? 'doctor' : 'patient');
  };

  const textFieldSx = {
    marginBottom: '1rem',
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#EBF8FC',
      borderRadius: '8px',
      '& fieldset': { border: 'none' },
      '&:hover fieldset': { border: 'none' },
      '&.Mui-focused fieldset': { border: '2px solid #CFECF7' },
    },
    '& input': { 
      padding: '14px 16px', 
      color: '#374151',
      fontFamily: 'Poppins, sans-serif'
    }
  };

  return (
    <>
      <div className={styles.registerPageWrapper}>
        <div className={styles.logo}>
          <MedicalServices className={styles.logoIcon} fontSize="large" /> TeknoSmile
        </div>

        <div className={styles.signupContainer}>
          <div className={styles.signupHeader}>
            <h2>
              {userType === 'patient' ? 
                <Person sx={{ fontSize: 30, marginRight: 1 }} /> : 
                <MedicalServices sx={{ fontSize: 30, marginRight: 1 }} />
              }
              Welcome!
            </h2>
          </div>

          <button className={`${styles.btn} ${styles.btnGoogle}`}>
            <Google sx={{ fontSize: 20, color: 'inherit' }} /> 
            Continue with Google
          </button>

          <Divider sx={{ color: '#E5E7EB', fontSize: '0.75rem', my: 1 }}>or</Divider>

          <form onSubmit={handleSignup} className={styles.form}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <TextField fullWidth placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} sx={textFieldSx} />
              <TextField fullWidth placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} sx={textFieldSx} />
            </div>
            <TextField fullWidth placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} sx={textFieldSx} />
            <TextField
              fullWidth placeholder="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} sx={textFieldSx}
              InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#6B7280' }}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>)}}
            />
            <TextField
              fullWidth placeholder="Confirm password" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} sx={{ ...textFieldSx, marginBottom: '0.5rem' }}
              InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" sx={{ color: '#6B7280' }}>{showConfirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>)}}
            />

            <div className={styles.doctorLink} onClick={toggleUserType}>
              {userType === 'patient' ? 'Are you a doctor? Click Here!' : 'Are you a patient? Click Here!'}
            </div>

            <button type="submit" className={`${styles.btn} ${styles.btnRegister}`}>Register</button>
          </form>
        </div>
      </div>
    </>
  );
}