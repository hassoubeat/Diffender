import React from 'react';
import styles from './_BrowserSettingsForm.module.scss';

export default function BrowserSettingsForm(props = null) {
  // パラメータ取得
  const {browserSettings, setBrowserSettings, deviceList} = props.payload;

  return (
    <React.Fragment>
      <div className={styles.browserSettingsForm}>
        <div className={styles.inputItem}>
          <label className={styles.inputLabel}>
            デバイスタイプ
          </label>
          <div>
            <select className={styles.inputSelect} type="select"
              onChange={(e) => { 
                browserSettings.deviceType = e.target.value;
                setBrowserSettings(Object.assign({}, browserSettings));
              }
            } >
              { deviceList.map( (device) => (　<option key={device} value={device} checked={(browserSettings.deviceType === device)}>{device}</option>　)) }
            <option value="custom"> カスタマイズ </option>
          </select>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
