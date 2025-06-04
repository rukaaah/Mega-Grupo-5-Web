// components/EditOverlay.tsx
import React from 'react';
import styles from '@/styles/Home.module.css';

interface EditOverlayProps {
  children: React.ReactNode;
  onClose: () => void;
}

const EditOverlay: React.FC<EditOverlayProps> = ({ children, onClose }) => {
  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.editFormContainer}>
        {children}
      </div>
    </>
  );
};

export default EditOverlay;