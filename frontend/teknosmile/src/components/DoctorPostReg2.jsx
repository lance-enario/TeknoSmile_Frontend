import React, { useState, useEffect } from 'react';
import { FilterList, Close } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './DoctorPostReg2.module.css';
import api from '../api/axios';

export default function DoctorClinicInfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, step1Data } = location.state || {};

  const [formData, setFormData] = useState({
    clinicName: '',
    clinicAddress: ''
  });

  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]); 
  const [loadingServices, setLoadingServices] = useState(true);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/api/services');
        setAvailableServices(response.data);
        setLoadingServices(false);
      } catch (error) {
        console.error("Failed to load services", error);
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleService = (service) => {
    if (selectedServices.find(s => s.serviceId === service.serviceId)) {

      setSelectedServices(prev => prev.filter(s => s.serviceId !== service.serviceId));
    } else {
 
      setSelectedServices(prev => [...prev, service]);
    }
    setIsServiceDropdownOpen(false);
  };

  const removeService = (serviceId) => {
    setSelectedServices(prev => prev.filter(s => s.serviceId !== serviceId));
  };

  const handleNext = (e) => {
    e.preventDefault();
    
    if (selectedServices.length === 0) {
      alert("Please select at least one service.");
      return;
    }

    navigate('/doctor-availability', {
      state: {
        userId,
        step1Data, 
        step2Data: { 
          ...formData, 
         
          selectedServices 
        }
      }
    });
  };

  return (
    <div className={styles.doctorPostRegPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Manage your account (2/3)</h1>
        <div className={styles.sectionTitle}>Clinic Address</div>

        <form onSubmit={handleNext}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Clinic Name</label>
            <input type="text" className={styles.customInput} name="clinicName" value={formData.clinicName} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Clinic Address</label>
            <input type="text" className={styles.customInput} name="clinicAddress" value={formData.clinicAddress} onChange={handleChange} required />
          </div>

          <div className={styles.divider}></div>
          <div className={styles.sectionTitle}>Services</div>

          <div className={styles.servicesContainer}>
            <label className={styles.label}>Select Services</label>
            
            <button 
              type="button" 
              className={styles.selectServicesBtn}
              onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
            >
              <FilterList fontSize="small" /> 
              {loadingServices ? "Loading Services..." : "Select Services from List"}
            </button>

            {isServiceDropdownOpen && (
              <div style={{ 
                border: '1px solid #ccc', 
                borderRadius: '8px', 
                marginTop: '10px', 
                maxHeight: '200px', 
                overflowY: 'auto',
                background: 'white',
                padding: '10px'
              }}>
                {availableServices.map(service => (
                  <div 
                    key={service.serviceId} 
                    onClick={() => toggleService(service)}
                    style={{ 
                      padding: '8px', 
                      cursor: 'pointer',
                      background: selectedServices.find(s => s.serviceId === service.serviceId) ? '#e6f7ff' : 'transparent'
                    }}
                  >
                    {service.serviceName}
                  </div>
                ))}
              </div>
            )}

            <div className={styles.chipsContainer}>
              {selectedServices.map((service) => (
                <div key={service.serviceId} className={styles.serviceChip}>
                  <span>{service.serviceName}</span>
                  <div className={styles.removeIcon} onClick={() => removeService(service.serviceId)}>
                    <Close fontSize="small" style={{ fontSize: 16 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.actionFooter}>
            <button type="submit" className={styles.btnNext}>Next</button>
          </div>
        </form>
      </div>
    </div>
  );
}