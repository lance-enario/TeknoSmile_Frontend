import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import styles from './SettingsPage.module.css';

const SettingsPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'account');;

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  return (
    <div className={styles.settingsContainer}>
      <Sidebar />
      
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>Manage your account settings</p>
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
                <h2 className={styles.sectionTitle}>Profile</h2>
                
                <div className={styles.profileGrid}>
                  <div className={styles.photoArea}>
                    <div className={styles.photoPlaceholder}></div>
                    <button className={styles.editPhotoBtn}>Edit Photo</button>
                  </div>
                  
                  <div className={styles.profileInputs}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Name</label>
                      <input type="text" className={styles.input} placeholder="" />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Surname</label>
                      <input type="text" className={styles.input} placeholder="" />
                    </div>
                  </div>
                </div>
              </section>

              <div className={styles.divider}></div>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Address</h2>
                
                <div className={styles.addressGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>City</label>
                    <input type="text" className={styles.input} placeholder="" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Barangay</label>
                    <input type="text" className={styles.input} placeholder="" />
                  </div>
                  <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>Number</label>
                    <input type="text" className={styles.input} placeholder="" />
                  </div>
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
