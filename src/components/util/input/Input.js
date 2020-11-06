import React from 'react';
import styles from './Input.module.scss';

export default function Input(props = null) {
  // propsの展開
  const label = props.label || "Lable";
  const placeholder = props.placeholder || "";
  const type = props.type || "text";
  const name = props.name || "";
  const value = props.value;
  const defaultValue = props.defaultValue;
  const ref = props.inputRef || (() => {});
  const onChangeFunc = props.onChangeFunc || (() => {});
  const onKeyPressFunc = props.onKeyPressFunc || (() => {});  
  const onKeyDownFunc = props.onKeyDownFunc || (() => {});
  const errorMessages = props.errorMessages || [];
  const labelClass = props.labelClass || "";
  const inputClass = props.inputClass || "";
  const errorMessageClass = props.errorMessageClass || "";

  // エラー判定
  const isError = () => {
    return (errorMessages.length > 0);
  }

  return (
    <React.Fragment>
      <div className={`${styles.inputItem} ${labelClass}`}>
        <div className={styles.inputLabel}>
          {label}
        </div>
        <input 
          className={`${styles.inputText} ${inputClass} ${isError() && styles.error}`} 
          type={type} 
          name={name} 
          placeholder={placeholder} 
          onChange={ (e) => onChangeFunc(e) } 
          onKeyPress={ (e) => onKeyPressFunc(e) }
          onKeyDown={ (e) => onKeyDownFunc(e) }
          value={value}
          defaultValue={defaultValue}
          ref={ref}
        /> 
        {isError() && 
          errorMessages.map( (errorMessage, index) => (
            <div key={index} className={`${styles.errorMessage} ${errorMessageClass}`}>
              ・{errorMessage}
            </div>
          ))
        }
      </div>
    </React.Fragment>
  );
}