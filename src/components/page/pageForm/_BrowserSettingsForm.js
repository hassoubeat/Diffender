import React, { useContext } from 'react';
import { useFormContext } from "react-hook-form";
import { PageContext } from './PageForm';
import styles from './_BrowserSettingsForm.module.scss';

export default function BrowserSettingsForm(props = null) {
  // パラメータ取得
  const deviceList = props.deviceList;

  // Hook setup
  const {page} = useContext(PageContext);
  const {register, errors, watch} = useFormContext();

  // ReactHookForm watchs
  const deviceType = watch("browserSettings.deviceType");

  return (
    <React.Fragment>
      <div className={styles.browserSettingsForm}>
        <div className={styles.inputItem}>
          <label className={styles.inputLabel}>
            デバイスタイプ
          </label>
          <div>
            <select 
              name="browserSettings.deviceType"
              className={styles.inputSelect} 
              type="select" 
              defaultValue={page.browserSettings.deviceType}
              ref={register({
                required: 'デバイスタイプは必須です'
              })}
            >
            { deviceList.map( (device) => (　
              <option key={device} value={device} >
                {device}
              </option>
              )
            )}
            <option value="custom"> カスタマイズ </option>
          </select>
          {
            errors.browserSettings && 
            <div>
              {errors.browserSettings.deviceType.message}
            </div>
          }
          </div>
        </div>
        {
          (deviceType === "custom") &&
          <div className={styles.inputItem}>
            ※ TODO 画面サイズ指定
            <select 
              name="browserSettings.deviceSize"
              className={styles.inputSelect} 
              type="select" 
              defaultValue="1200x1080"
              ref={register({
                required: 'デバイスサイズは必須です'
              })}
            >
              <option value="1200x1080" >1080x900</option>
              <option value="1080x900" >1080x900</option>
            </select>
          </div>
        }
        
      </div>
    </React.Fragment>
  );
}
