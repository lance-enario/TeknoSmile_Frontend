import React, { useState } from 'react';
import { 
  Person,
  Close
} from '@mui/icons-material';
import styles from './DoctorAppointment.module.css'; 
import Sidebar from './Sidebar';

export default function DoctorAppointmentsPage() {
  const [activeTab, setActiveTab] = useState('appointments');
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // Mock Data based on the image
  const appointments = [
    {
      id: 1,
      patientName: 'Lorem Ipsum',
      service: 'Dental Exam',
      date: 'September 30, 2025',
      time: '10:30 A.M'
    },
    {
      id: 2,
      patientName: 'Jane Doe',
      service: 'Teeth Cleaning',
      date: 'October 05, 2025',
      time: '02:00 P.M'
    },
    {
      id: 3,
      patientName: 'John Smith',
      service: 'Root Canal',
      date: 'October 12, 2025',
      time: '09:00 A.M'
    }
  ];

  const requests = [
    {
      id: 101,
      patientName: 'Lorem Ipsum',
      service: 'Dental Exam',
      date: 'September 30, 2025',
      time: '10:30 A.M'
    },
    {
      id: 102,
      patientName: 'Michael Scott',
      service: 'Consultation',
      date: 'October 01, 2025',
      time: '11:00 A.M'
    }
  ];

  const reschedules = [
    {
      id: 201,
      patientName: 'Pam Beesly',
      service: 'Whitening',
      date: 'October 02, 2025',
      time: '01:00 P.M'
    }
  ];

  const handleItemClick = (item) => {
    setSelectedRequest(item);
  };

  return (
    <div className={styles.appointmentsPageWrapper}>
      <div className={styles.pageLayout}>
        <Sidebar />

        <main className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Appointments</h1>

          <div className={styles.tabsContainer}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'appointments' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('appointments')}
            >
              Appointments
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'requests' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              Patient Request
              <span className={styles.badge}>1</span>
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'reschedule' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('reschedule')}
            >
              Patient Reschedule
              <span className={styles.badge}>1</span>
            </button>
          </div>

          {activeTab === 'appointments' && (
            <div className={styles.appointmentsList}>
              {appointments.map((appt) => (
                <div key={appt.id} className={styles.appointmentCard}>
                  <div className={styles.cardLeft}>
                    <div className={styles.cardAvatar}>
                      <Person style={{ fontSize: 30 }} />
                    </div>
                    <div className={styles.patientName}>{appt.patientName}</div>
                  </div>
                  <div className={styles.cardMiddle}>
                    <span className={styles.serviceText}>Service: {appt.service}</span>
                  </div>
                  <div className={styles.cardRight}>
                    <span className={styles.dateText}>{appt.date}</span>
                    <span className={styles.timeText}>{appt.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className={styles.appointmentsList}>
              {requests.map((req) => (
                <div 
                  key={req.id} 
                  className={styles.appointmentCard} 
                  onClick={() => handleItemClick(req)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.cardLeft}>
                    <div className={styles.cardAvatar}>
                      <Person style={{ fontSize: 30 }} />
                    </div>
                    <div className={styles.patientName}>{req.patientName}</div>
                  </div>
                  <div className={styles.cardMiddle}>
                    <span className={styles.serviceText}>Service: {req.service}</span>
                  </div>
                  <div className={styles.cardRight}>
                    <span className={styles.dateText}>{req.date}</span>
                    <span className={styles.timeText}>{req.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reschedule' && (
            <div className={styles.appointmentsList}>
              {reschedules.map((res) => (
                <div 
                  key={res.id} 
                  className={styles.appointmentCard}
                  onClick={() => handleItemClick(res)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.cardLeft}>
                    <div className={styles.cardAvatar}>
                      <Person style={{ fontSize: 30 }} />
                    </div>
                    <div className={styles.patientName}>{res.patientName}</div>
                  </div>
                  <div className={styles.cardMiddle}>
                    <span className={styles.serviceText}>Service: {res.service}</span>
                  </div>
                  <div className={styles.cardRight}>
                    <span className={styles.dateText}>{res.date}</span>
                    <span className={styles.timeText}>{res.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Popup Modal */}
          {selectedRequest && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={() => setSelectedRequest(null)}>
                  <Close />
                </button>
                
                <div className={styles.modalHeader}>
                  <div className={styles.modalAvatar}>
                    <Person style={{ fontSize: 40 }} />
                  </div>
                  <h2 className={styles.modalPatientName}>{selectedRequest.patientName}</h2>
                </div>

                <div className={styles.modalBody}>
                  <div className={styles.modalDateTime}>
                    <div>{selectedRequest.date}</div>
                    <div>{selectedRequest.time}</div>
                  </div>
                  <div className={styles.modalService}>
                    Service: {selectedRequest.service}
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button className={styles.acceptButton}>Accept</button>
                  <button className={styles.rescheduleButton}>Reschedule</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
