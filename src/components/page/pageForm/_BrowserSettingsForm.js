import React from 'react';
import { useFormContext } from "react-hook-form";
import UtilInput from 'components/util/input/Input';
import styles from './_BrowserSettingsForm.module.scss';

import _ from 'lodash';

export default function BrowserSettingsForm(props = null) {
  // パラメータ取得
  const deviceList = props.deviceList;

  // Hook setup
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
              ref={register({
                required: 'デバイスタイプは必須です'
              })}
            >
              <option value="custom"> カスタマイズ </option>
              { deviceList.map( (device) => (　
                <option key={device} value={device} >
                  {device}
                </option>
                )
              )}
            </select>
          {
            errors.browserSettings && 
            <div>
              {_.get(errors, "browserSettings.deviceType.message")}
            </div>
          }
          </div>
        </div>
        {
          (deviceType === "custom") &&
            <React.Fragment>
              <UtilInput
                label="width(ピクセル)" 
                placeholder="1000" 
                type="number" 
                name="browserSettings.viewport.width" 
                errorMessages={ (_.get(errors, "browserSettings.viewport.width")) && [_.get(errors, "browserSettings.viewport.width.message")] } 
                inputRef={ register({
                  required: "widthの指定は必須です",
                  min : {
                    value: 1,
                    message: '1〜2000で値を入力してください'
                  },
                  max : {
                    value: 2000,
                    message: '1〜2000で値を入力してください'
                  }
                })}
              />
              <UtilInput
                label="height(ピクセル)" 
                placeholder="1000" 
                type="number" 
                name="browserSettings.viewport.height" 
                errorMessages={(_.get(errors, "browserSettings.viewport.height")) && [_.get(errors, "browserSettings.viewport.height.message")] } 
                inputRef={ register({
                  required: "heightの指定は必須です",
                  min : {
                    value: 1,
                    message: '1〜2000で値を入力してください'
                  },
                  max : {
                    value: 2000,
                    message: '1〜2000で値を入力してください'
                  }
                })}
              />
              <UtilInput
                label="UserAgent" 
                placeholder="Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12F70 Safari/600.1.4" 
                type="text" 
                name="browserSettings.userAgent" 
                errorMessages={ (_.get(errors, "browserSettings.userAgent")) && [_.get(errors, "browserSettings.userAgent.message")] } 
                inputRef={ register()}
              />
            </React.Fragment>
          
        }
      </div>
    </React.Fragment>
  );
}
