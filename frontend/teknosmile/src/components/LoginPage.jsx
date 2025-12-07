import React, { useState } from 'react';
import styles from './LoginPage.module.css';
import { 
  TextField, 
  InputAdornment, 
  IconButton, 
  Divider 
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google,
  MedicalServices
} from '@mui/icons-material';
import api from '../api/axios';
import {useNavigate} from 'react-router-dom';

export default function LogInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', {
        email: email,
        password: password
      });
    
      const {token, user} = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed", error);
      alert("Invalid credentials");
    }
  };

  // Common sx styles for TextFields (matching RegisterPage)
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
    <div className={styles.loginPageWrapper}>
      <div className={styles.logo}>
        <MedicalServices className={styles.logoIcon} fontSize="large" /> TeknoSmile
      </div>

      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <h2>Log in</h2>
        </div>

        <button className={`${styles.btn} ${styles.btnGoogle}`}>
          <Google sx={{ fontSize: 20, color: 'inherit' }} /> 
          Continue with Google
        </button>

        <Divider sx={{ color: '#E5E7EB', fontSize: '0.75rem', my: 1 }}>or</Divider>

        <form onSubmit={handleLogin} className={styles.form}>
          <TextField
            fullWidth
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            sx={textFieldSx}
          />

          <TextField
            fullWidth
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            sx={textFieldSx}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
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

          <button type="submit" className={`${styles.btn} ${styles.btnLogin}`}>
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}