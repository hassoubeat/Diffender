import React, { useContext } from 'react';
import { useFormContext } from "react-hook-form";
import { PageContext } from './PageForm';
import styles from './_ScreenshotOptionsForm.module.scss';

export default function ScreenshotOptionsForm(props = null) {

  // Hook setup
  const {page} = useContext(PageContext);
  const {register} = useFormContext();

  return (
    <React.Fragment>
      <div className={styles.screenshotOptionsForm}>
          <input 
            name="screenshotOptions.fullPage"
            className={styles.checkBox} 
            type="checkBox" 
            defaultChecked={!!page.screenshotOptions.fullPage} 
            ref={register}
          />全画面撮影
      </div>
    </React.Fragment>
  );
}
