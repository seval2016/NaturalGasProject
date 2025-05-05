import React from 'react';
import styles from '../styles/sectionTitle.module.css';

interface SectionTitleProps {
  label: string;
  title: string;
  description: string;
}

const SectionTitle = ({ label, title, description }: SectionTitleProps) => {
  return (
    <div className={styles.container}>
      {label && (
        <div className={styles.labelContainer}>
          <span className={styles.line} />
          <span className={styles.label}>{label}</span>
          <span className={styles.line} />
        </div>
      )}
      <h2 className={styles.title}>{title}</h2>
      {description && (
        <p className={styles.description}>{description}</p>
      )}
    </div>
  );
};

export default SectionTitle; 