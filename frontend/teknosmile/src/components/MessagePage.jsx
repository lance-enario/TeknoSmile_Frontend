import React, { useState } from 'react';
import { 
  PersonOutline, 
  Add
} from '@mui/icons-material';
import styles from './MessagePage.module.css'; // Changed import
import Sidebar from './Sidebar';

const MessagePage = () => {
  const [selectedChat, setSelectedChat] = useState(0);

  // Mock data to replicate the list in your image
  const contacts = [
    { id: 0, name: 'Lorem Ipsum' },
    { id: 1, name: 'Lorem Ipsum' },
    { id: 2, name: 'Lorem Ipsum' },
    { id: 3, name: 'Lorem Ipsum' },
    { id: 4, name: 'Lorem Ipsum' },
  ];

  return (
    <div className={styles.pageLayout}>
      {/* 1. Sidebar on the left */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <main className={styles.mainContent}>
        
        {/* Middle Column: Chat List */}
        <section className={styles.chatListPanel}>
          {contacts.map((contact, index) => (
            <div 
              key={contact.id} 
              className={`${styles.chatItem} ${selectedChat === index ? styles.selected : ''}`}
              onClick={() => setSelectedChat(index)}
            >
              <div className={styles.avatarCircle}>
                <PersonOutline />
              </div>
              <span className={styles.contactName}>{contact.name}</span>
            </div>
          ))}
        </section>

        {/* Right Column: Active Conversation */}
        <section className={styles.chatWindowPanel}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.avatarCircle}>
              <PersonOutline />
            </div>
            <span className={styles.headerName}>Lorem Ipsum</span>
          </div>

          {/* Messages Area */}
          <div className={styles.messagesContainer}>
            {/* Incoming Message */}
            <div className={`${styles.messageGroup} ${styles.incoming}`}>
              <div className={`${styles.avatarCircle} ${styles.small}`}>
                <PersonOutline fontSize="small" />
              </div>
              <div className={styles.messageContent}>
                <p className={styles.senderName}>Lorem Ipsum</p>
                <div className={styles.messageBubble}>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                </div>
              </div>
            </div>

            {/* Outgoing Message */}
            <div className={`${styles.messageGroup} ${styles.outgoing}`}>
              <div className={styles.messageContent}>
                <p className={styles.senderName}>Lorem Ipsum</p>
                <div className={styles.messageBubble}>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                </div>
              </div>
              <div className={`${styles.avatarCircle} ${styles.small}`}>
                <PersonOutline fontSize="small" />
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className={styles.chatInputArea}>
            <button className={styles.addBtn}>
              <Add />
            </button>
            <input type="text" className={styles.messageInput} />
          </div>
        </section>

      </main>
    </div>
  );
};

export default MessagePage;