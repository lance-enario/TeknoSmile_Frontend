import React from 'react';
import { 
  Search,
  LocationOnOutlined,
  FilterList,
  Close,
  Person
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import styles from './Dashboard.module.css'; // Changed import

const Dashboard = () => {
  const navigate = useNavigate();
  // Mock data for dentists
  const dentists = [
    {
      id: 1,
      name: "Dr. Lorem Ipsum",
      location: "Lorem Ipsum",
      services: ["Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum"],
      schedule: {
        weekdays: "10:00A.M - 5:00P.M Monday-Friday",
        weekend: "1:00P.M - 5:00P.M Saturday - Sunday"
      }
    },
    {
      id: 2,
      name: "Dr. Lorem Ipsum",
      location: "Lorem Ipsum",
      services: ["Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum"],
      schedule: {
        weekdays: "10:00A.M - 5:00P.M Monday-Friday",
        weekend: "1:00P.M - 5:00P.M Saturday - Sunday"
      }
    },
    {
      id: 3,
      name: "Dr. Lorem Ipsum",
      location: "Lorem Ipsum",
      services: ["Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum"],
      schedule: {
        weekdays: "10:00A.M - 5:00P.M Monday-Friday",
        weekend: "1:00P.M - 5:00P.M Saturday - Sunday"
      }
    },
    {
      id: 4,
      name: "Dr. Lorem Ipsum",
      location: "Lorem Ipsum",
      services: ["Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum"],
      schedule: {
        weekdays: "10:00A.M - 5:00P.M Monday-Friday",
        weekend: "1:00P.M - 5:00P.M Saturday - Sunday"
      }
    }
  ];

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Top Search Bar */}
        <div className={styles.topBar}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search for Services, Clinics name, or your Doctor's name..." 
              className={styles.searchInput}
            />
          </div>
          <div className={styles.locationContainer}>
            <LocationOnOutlined className={styles.locationIcon} />
            <input type="text" placeholder="Select Location" className={styles.locationInput} />
          </div>
          <button className={styles.filterBtn}>
            <FilterList /> Filters <span className={styles.filterCount}>1</span>
          </button>
        </div>

        {/* Active Filters */}
        <div className={styles.activeFilters}>
          <span className={styles.filterTag}>
            Dental Exam <Close fontSize="small" className={styles.closeIcon} />
          </span>
        </div>

        {/* Dentists Grid */}
        <div className={styles.dentistsGrid}>
          {dentists.map((dentist) => (
            <div key={dentist.id} className={styles.dentistCard}>
              <div className={styles.cardContent}>
                <div className={styles.dentistHeader}>
                  <div className={styles.dentistAvatar}>
                    <Person fontSize="large" />
                  </div>
                  <h3>{dentist.name}</h3>
                </div>
                
                <div className={styles.dentistInfo}>
                  <div className={styles.infoSection}>
                    <span className={styles.label}>Location</span>
                    <ul><li>{dentist.location}</li></ul>
                  </div>
                  
                  <div className={styles.infoSection}>
                    <span className={styles.label}>Services:</span>
                    <ul>
                      {dentist.services.map((service, index) => (
                        <li key={index}>{service}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.infoSection}>
                    <span className={styles.label}>Available Schedule</span>
                    <ul>
                      <li>{dentist.schedule.weekdays}</li>
                      <li>{dentist.schedule.weekend}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={styles.cardActions}>
                <div className={styles.placeholderImage}></div>
                <button className={styles.bookBtn} onClick={() => navigate('/book-appointment')}>Book An Appointment</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;