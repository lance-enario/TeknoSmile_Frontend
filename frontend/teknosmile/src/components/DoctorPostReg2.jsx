import React, { useState } from 'react';
import { 
  FilterList,
  Close
} from '@mui/icons-material';
import styles from './DoctorPostReg2.module.css'; // Changed import

export default function DoctorClinicInfoPage() {
  const [formData, setFormData] = useState({
    clinicName: '',
    clinicAddress: ''
  });

  const [selectedServices, setSelectedServices] = useState([
    'Dental Exam',
    'What the helly'
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const removeService = (serviceToRemove) => {
    setSelectedServices(services => services.filter(s => s !== serviceToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Clinic Info Submitted:', { ...formData, selectedServices });
  };

  return (
    <div className={styles.doctorPostRegPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Manage your account</h1>

        <div className={styles.sectionTitle}>Clinic Address</div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Clinic Name</label>
            <input 
              type="text" 
              className={styles.customInput} 
              name="clinicName" 
              value={formData.clinicName} 
              onChange={handleChange} 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Clinic Address</label>
            <input 
              type="text" 
              className={styles.customInput} 
              name="clinicAddress" 
              value={formData.clinicAddress} 
              onChange={handleChange} 
            />
          </div>

          <div className={styles.divider}></div>

          <div className={styles.sectionTitle}>Services</div>

          <div className={styles.servicesContainer}>
            <label className={styles.label}>Select Services</label>
            <button type="button" className={styles.selectServicesBtn}>
              <FilterList fontSize="small" />
              Select Services
            </button>

            <div className={styles.chipsContainer}>
              {selectedServices.map((service, index) => (
                <div key={index} className={styles.serviceChip}>
                  <span>{service}</span>
                  <div className={styles.removeIcon} onClick={() => removeService(service)}>
                    <Close fontSize="small" style={{ fontSize: 16 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.actionFooter}>
            <button type="submit" className={styles.btnNext}>
              Next
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}