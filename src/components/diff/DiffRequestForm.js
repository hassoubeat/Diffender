import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from "react-hook-form";
import UtilInput from 'components/util/input/Input';

import {  
  setResult,
  selectResults
} from 'app/domainSlice';

import { 
  originResultFilter,
  targetResultFilter,
  requestDiffScreenshot,
 } from 'lib/diff/model';
 import { sort } from 'lib/result/model';

import _ from 'lodash';
import * as toast from 'lib/util/toast';

import styles from './DiffRequestForm.module.scss';

export default function DiffRequestForm(props = null) {
  // props setup
  const selectedOriginId = props.selectedOriginId;

  // hook setup
  const dispatch = useDispatch();

  // redux-state setup
  const resultList = sort(
    _.cloneDeep(useSelector(selectResults({})
  )));

  // ReactHookForm setup
  const {register, errors, watch, setValue, handleSubmit} = useForm({
    mode: 'onChange',
    defaultValues: {
      name: "",
      description: "",
      originResultId: "",
      targetResultId: "",
    }
  });
  const originResultId = watch("originResultId");

  // submit hander
  const onSubmit = async (data) => {
    const result = await requestDiffScreenshot(data);
    if (result) dispatch( setResult(result) );
  }

  // submit error hander
  const onSubmitError = (error) => {
    console.table(error);
    console.log(error)
    toast.errorToast(
      { message: "入力エラーが存在します" }
    )
  }

  return (
    <React.Fragment>
      <div className={styles.diffRequestForm}>
        <div className={styles.inputArea}>
          {/* 比較元ギャラリーの入力セレクタ */}
          <div className={styles.inputItem}>
            <label className={styles.inputLabel}>
              比較元のギャラリー
            </label>
            <div className={styles.inputSelect} >
              <select 
                type="select"
                name="originResultId"
                defaultValue={selectedOriginId}
                ref={ register({
                  required: "比較元ギャラリーを選択してください",
                })}
                onChange={() => {
                  // 比較先ギャラリーをクリアする
                  setValue('targetResultId', "");
                }}
              >
                <option value=""> --比較元ギャラリーを選択してください-- </option>
                { originResultFilter(resultList).map( (result) => (
                  <option 
                    key={result.id} 
                    value={result.id}
                  >{result.name}</option>　  
                ))}
              </select>
              { errors.originResultId && 
                <div className={styles.error}>
                  {errors.originResultId.message}
                </div>
              }
            </div>
          </div>
          {/* 比較先ギャラリーの入力セレクタ */}
          <div className={styles.inputItem}>
            <label className={styles.inputLabel}>
              比較先のギャラリー
            </label>
            <div className={styles.inputSelect} >
              <select 
                type="select"
                name="targetResultId"
                disabled={(originResultId === "")}
                ref={ register({
                  required: "比較先ギャラリーを選択してください",
                })}
              >
                <option value=""> --比較先ギャラリーを選択してください-- </option>
                { targetResultFilter(resultList, originResultId).map( (result) => (
                  <option 
                    key={result.id} 
                    value={result.id}
                  >{result.name}</option>　  
                ))}
              </select>
              { errors.targetResultId && 
                <div className={styles.error}>
                  {errors.targetResultId.message}
                </div>
              }
            </div>
          </div>
          {/* ギャラリー名の入力フォーム */}
          <UtilInput
            label="ギャラリー名" 
            placeholder="20200701の定期チェック_example.com" 
            type="text" 
            name="name" 
            errorMessages={ (errors.name) && [errors.name.message] } 
            inputRef={ register({
              maxLength : {
                value: 30,
                message: '最大30文字で入力してください'
              }
            })}
          />
          {/* ギャラリー名の説明フォーム */}
          <UtilInput
            label="ギャラリーの説明" 
            placeholder="2020年7月分の差分チェック用" 
            type="text" 
            name="description" 
            errorMessages={ (errors.description) && [errors.description.message] } 
            inputRef={ register({
              maxLength : {
                value: 50,
                message: '最大50文字で入力してください'
              }
            })}
          />
          <div className={styles.actionArea}>
            <span 
              className={styles.postButton} 
              onClick={
                handleSubmit(onSubmit, onSubmitError)
              } 
            >取得</span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}