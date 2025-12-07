import React from 'react';
import { 
  PersonOutline, 
  SettingsOutlined, 
  NotificationsNoneOutlined,
  DashboardOutlined,
  ChatBubbleOutline,
  CalendarTodayOutlined,
  SmartphoneOutlined,
  MedicalServices
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css'; // Changed import

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>
          <MedicalServices className={styles.logoIcon} fontSize="large" /> TeknoSmile
        </div>
        <div className={styles.userActions}>
        <button 
          className={styles.iconBtn}
          onClick={() => navigate('/settings', { state: { tab: 'account' } })}
        >
          <PersonOutline />
        </button>
        <button 
          className={styles.iconBtn}
          onClick={() => navigate('/settings', { state: { tab: 'privacy' } })}
        >
          <SettingsOutlined />
        </button>
        
        <button className={styles.iconBtn}><NotificationsNoneOutlined /></button>
      </div>
      </div>

      <nav className={styles.sidebarNav}>
        <a 
          href="#" 
          // Conditional logic updated for CSS modules
          className={`${styles.navItem} ${isActive('/dashboard') ? styles.active : ''}`}
          onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}
        >
          <DashboardOutlined /> <span>DASHBOARD</span>
        </a>
        <a href="#"
        // Conditional logic updated for CSS modules
          className={`${styles.navItem} ${isActive('/message') ? styles.active : ''}`}
          onClick={(e) => { e.preventDefault(); navigate('/message'); }}
        >
          <ChatBubbleOutline /> <span>MESSAGES</span>
        </a>
        <a href="#"
        // Conditional logic updated for CSS modules
          className={`${styles.navItem} ${isActive('/calendar') ? styles.active : ''}`}
          onClick={(e) => { e.preventDefault(); navigate('/calendar'); }}
        >
          <CalendarTodayOutlined /> <span>CALENDAR</span>
        </a>
        <a href="#"
          className={`${styles.navItem} ${isActive('/appointments') ? styles.active : ''}`}
          onClick={(e) => { e.preventDefault(); navigate('/appointments'); }}
        >
          <SmartphoneOutlined /> <span>APPOINTMENTS</span>
        </a>
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.notificationArea}>
          <PersonOutline /> <span>Lorem Ipsum</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;