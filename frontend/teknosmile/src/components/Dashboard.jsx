import React, { useState, useEffect } from 'react';
import { 
  Search,
  LocationOnOutlined,
  FilterList,
  Close,
  Person
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import styles from './Dashboard.module.css';
import api from '../api/axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDentists = async () => {
      try {
        const response = await api.get('/dentists');
        
        const dentistsWithServices = await Promise.all(
          response.data.map(async (dentist) => {
            let services = [];
            try {
              const servicesResponse = await api.get(`/services/dentist/${dentist.userId}`);
              services = servicesResponse.data.map(s => s.serviceName);
            } catch (serviceErr) {
              console.error(`Failed to fetch services for dentist ${dentist.userId}`, serviceErr);
            }

            return {
              id: dentist.userId,
              name: `Dr. ${dentist.profile?.firstName || ''} ${dentist.profile?.lastName || ''}`,
              location: dentist.profile?.address || 'Location not available',
              services: services,
              schedule: {
                weekdays: "9:00A.M - 5:00P.M Monday-Friday",
                weekend: "Closed"
              }
            };
          })
        );

        setDentists(dentistsWithServices);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch dentists", err);
        setError("Failed to load dentists");
        setLoading(false);
      }
    };

    fetchDentists();
  }, []);

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
          {loading ? (
            <p>Loading dentists...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            dentists.map((dentist) => (
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
                        {dentist.services.length > 0 ? (
                          dentist.services.map((service, index) => (
                            <li key={index}>{service}</li>
                          ))
                        ) : (
                          <li>No services listed</li>
                        )}
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
                  <button 
                    className={styles.bookBtn} 
                    onClick={() => navigate('/book-appointment', { state: { dentistId: dentist.id } })}
                  >
                    Book An Appointment
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;