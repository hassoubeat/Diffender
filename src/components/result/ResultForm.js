import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from "react-hook-form";
import UtilInput from 'components/util/input/Input';

import {  
  setResult,
  selectResult
} from 'app/domainSlice';

import {
  putResult,
} from 'lib/result/model';
import * as toast from 'lib/util/toast';

import styles from './ResultForm.module.scss';

export default function ResultForm(props = null) {
  // props setup
  const isUpdate = !!props.resultId;
  const resultId = props.resultId;
  const successPostCallback = props.successPostCallback;

  // hook setup
  const dispatch = useDispatch();

  // redux-state setup
  const result = useSelector(selectResult(resultId, isUpdate));

  // ReactHookForm setup
  const reactHookFormMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      name: "",
      description: ""
    }
  });
  const {register, errors, reset, handleSubmit} = reactHookFormMethods;

  useEffect( () => {
    if (isUpdate) reset(result);
  }, [isUpdate, result, reset]);

  const onSubmit = async (inputResult) => {
    let resResult = null;
    if (isUpdate){
      resResult = await putResult({
        ...result,
        ...inputResult
      })
    } else {
      // TODO
      throw new Error("リザルト登録処理は未実装です");
    }
    if (resResult) dispatch( setResult(resResult) );
    if (resResult && successPostCallback) successPostCallback();
  }

  const onSubmitError = (error) => {
    console.table(error);
    console.log(error)
    toast.errorToast(
      { message: "入力エラーが存在します" }
    )
  }

  return (
    <React.Fragment>
      <div className={styles.resultForm}>
        <div className={styles.inputArea}>
          <UtilInput
            label="リザルト名" 
            placeholder="20200701の定期チェック_example.com" 
            type="text" 
            name="name" 
            errorMessages={ (errors.name) && [errors.name.message] } 
            inputRef={ register({
              required: "リザルト名は必須です",
              maxLength : {
                value: 30,
                message: '最大30文字で入力してください'
              }
            })}
          />
          <UtilInput
            label="リザルトの説明" 
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
            <span className={styles.postButton} onClick={ 
              handleSubmit(onSubmit, onSubmitError)
            }>
              {(isUpdate) ? '更新' : '登録'}
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
