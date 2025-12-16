import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import styles from './SettingsPage.module.css';
import api from '../api/axios';

const SettingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'account');
  
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    barangay: '',
    number: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);
        
        const response = await api.get(`/patients/${user.userId}`);
        const profile = response.data.profile || {};
            
        setUserData({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          address: profile.address || '',
          city: profile.address || '', 
          barangay: '',
          number: ''
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user data", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
        console.log("Logout successful")
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;
      const user = JSON.parse(userStr);

      // Construct the address from components if we were using them, 
      // but for now we are just using the 'address' field directly or 'city' as the main address input.
      // Let's assume the user edits the 'address' field directly if we simplify the UI,
      // or we map 'city' back to address.
      const addressToSave = userData.address; 

      await api.put(`/patients/${user.userId}/profile`, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        address: addressToSave
      });
      
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile");
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <Sidebar />
      
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Settings</h1>
            <p className={styles.subtitle}>Manage your account settings</p>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>Log Out</button>
        </div>

        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'account' ? styles.active : ''}`}
            onClick={() => setActiveTab('account')}
          >
            Account
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'privacy' ? styles.active : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy
          </button>
        </div>

        <div className={styles.contentArea}>
          {activeTab === 'account' ? (
            <>
              <section className={styles.section}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Profile</h2>
                  {!isEditing ? (
                    <button 
                      className={styles.confirmBtn} 
                      onClick={() => setIsEditing(true)}
                      style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button 
                        className={styles.confirmBtn} 
                        onClick={() => setIsEditing(false)}
                        style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem', backgroundColor: '#f5f5f5' }}
                      >
                        Cancel
                      </button>
                      <button 
                        className={styles.confirmBtn} 
                        onClick={handleSaveProfile}
                        style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem', backgroundColor: '#007bff', color: 'white' }}
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
                
                <div className={styles.profileGrid}>
                  <div className={styles.photoArea}>
                    <div className={styles.photoPlaceholder}></div>
                    <button className={styles.editPhotoBtn}>Edit Photo</button>
                  </div>
                  
                  <div className={styles.profileInputs}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Name</label>
                      <input 
                        type="text" 
                        className={styles.input} 
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Surname</label>
                      <input 
                        type="text" 
                        className={styles.input} 
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <div className={styles.divider}></div>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Address</h2>
                
                <div className={styles.addressGrid}>
                  <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>Full Address</label>
                    <input 
                      type="text" 
                      className={styles.input} 
                      name="address"
                      value={userData.address}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                      placeholder="City, Barangay, House No."
                    />
                  </div>
                  {/* 
                    Simplified to single address field to match backend model.
                    If you want separate fields, we need to parse/stringify the address string.
                  */}
                </div>
              </section>
            </>
          ) : (
            <>
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Change Password</h2>
                
                <div className={styles.privacyGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Current Password</label>
                    <input type="password" className={styles.input} placeholder="" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>New Password</label>
                    <input type="password" className={styles.input} placeholder="" />
                  </div>
                </div>
                <div className={styles.buttonContainer}>
                  <button className={styles.confirmBtn}>Confirm Change</button>
                </div>
              </section>

              <div className={styles.divider}></div>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Change Email</h2>
                
                <div className={styles.privacyGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Enter Password</label>
                    <input type="password" className={styles.input} placeholder="" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>New Email</label>
                    <input type="email" className={styles.input} placeholder="" />
                  </div>
                </div>
                <div className={styles.buttonContainer}>
                  <button className={styles.confirmBtn}>Confirm Change</button>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
