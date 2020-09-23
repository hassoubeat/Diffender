import React, {useState} from 'react';
import styles from './Accordion.module.scss';

export default function Accordion(props = null) {
  // props展開
  const children = props.children;
  const className = props.className;
  const text = props.text;
  const isOpen = !!props.isOpen;

  // State定義
  const [isOpenAccordion, setIsOpenAccordion] = useState(isOpen);

  return (
    <React.Fragment>
      <div className={`${styles.accordionBlock} ${className}`}>
        <span className={`${styles.accordionToggle} ${(isOpenAccordion) ? styles.open : styles.close }`} 
          onClick={() => {setIsOpenAccordion(!isOpenAccordion)}}>{text}</span>
        <div className={`${styles.accordion} ${(isOpenAccordion) ? styles.open : styles.close }`}>
          {children}
        </div>
      </div>
    </React.Fragment>
  );
}
