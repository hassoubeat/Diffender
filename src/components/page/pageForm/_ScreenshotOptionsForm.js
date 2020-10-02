import React from 'react';
import { useFormContext } from "react-hook-form";
import styles from './_ScreenshotOptionsForm.module.scss';

export default function ScreenshotOptionsForm(props = null) {

  // Hook setup
  const {register} = useFormContext();

  return (
    <React.Fragment>
      <div className={styles.screenshotOptionsForm}>
          <input 
            name="screenshotOptions.fullPage"
            className={styles.checkBox} 
            type="checkBox" 
            ref={register}
          />全画面撮影
      </div>
    </React.Fragment>
  );
}
