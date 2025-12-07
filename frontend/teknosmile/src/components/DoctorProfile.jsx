import React from 'react';
import styles from './DoctorProfile.module.css'; // Changed import
import Sidebar from './Sidebar';

export default function DoctorProfilePage() {
  return (
    <div className={styles.doctorProfileWrapper}>
      <div className={styles.pageLayout}>
        <Sidebar />

        <main className={styles.mainContent}>
          <div className={styles.profileCard}>
            
            <div className={styles.profileHeader}>
              <div className={styles.avatarLarge}></div>
              <div className={styles.headerInfo}>
                <h2>Clinic Name</h2>
                <h1>Lorem Ipsum</h1>
              </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.infoGrid}>
              
              <div>
                <div className={styles.infoSection}>
                  <h3>Location:</h3>
                  <div className={styles.infoContent}>
                    Somewhere over the rainbow
                  </div>
                </div>

                {/* Replaced inline style with class */}
                <div className={`${styles.infoSection} ${styles.numberSection}`}>
                  <h3>Number:</h3>
                  <div className={styles.infoContent}>
                    099 ambot nimo
                  </div>
                </div>
              </div>

              <div>
                <div className={styles.infoSection}>
                  <h3>Availability:</h3>
                  <ul className={`${styles.infoContent} ${styles.infoList}`}>
                    <li>10:00A.M - 5:00P.M Monday-Friday</li>
                    <li>1:00P.M - 5:00P.M Saturday - Sunday</li>
                  </ul>
                </div>
              </div>

              {/* Replaced inline style with class */}
              <div className={`${styles.infoSection} ${styles.servicesSection}`}>
                <h3>Services:</h3>
                <ul className={`${styles.infoContent} ${styles.infoList}`}>
                  <li>1st service</li>
                  <li>2nd service</li>
                  <li>3rd service</li>
                </ul>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}