import React, { useState } from 'react';
import styles from './RegisterPage.module.css'; // Changed import
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

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('patient');

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5173/api/auth/register" , {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify()
      })
    } catch (error){

    }

    console.log('Registering...', { email, password, confirmPassword, userType });
  };

  const toggleUserType = () => {
    setUserType(userType === 'patient' ? 'doctor' : 'patient');
  };

  // Common sx styles for TextFields to keep code clean
  const textFieldSx = {
    marginBottom: '1rem',
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#EBF8FC', // var(--bg-input)
      borderRadius: '8px',
      '& fieldset': { border: 'none' },
      '&:hover fieldset': { border: 'none' },
      '&.Mui-focused fieldset': { 
        border: '2px solid #CFECF7'
      },
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
            
            {/* Email */}
            <TextField
              fullWidth
              placeholder="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={textFieldSx}
            />

            {/* Password */}
            <TextField
              fullWidth
              placeholder="Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={textFieldSx}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#6B7280' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Confirm Password */}
            <TextField
              fullWidth
              placeholder="Confirm password"
              variant="outlined"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ ...textFieldSx, marginBottom: '0.5rem' }} // Override margin for the last input
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: '#6B7280' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <div className={styles.doctorLink} onClick={toggleUserType}>
              {userType === 'patient' ? 'Are you a doctor? Click Here!' : 'Are you a patient? Click Here!'}
            </div>

            <button type="submit" className={`${styles.btn} ${styles.btnRegister}`}>
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
}