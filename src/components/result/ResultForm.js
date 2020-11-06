import React, { useEffect, useState } from 'react';
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

  // state setup
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (isSubmitting) return;

    setIsSubmitting(true);

    let resResult = null;
    if (isUpdate){
      resResult = await putResult({
        ...result,
        ...inputResult
      })
    } else {
      // TODO
      throw new Error("テスト結果登録処理は未実装です");
    }
    if (resResult) dispatch( setResult(resResult) );

    setIsSubmitting(false);

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
    <form onSubmit={ handleSubmit(onSubmit, onSubmitError)}>
      <input type="submit" className="hidden" />
      <div className={styles.resultForm}>
        <div className={styles.inputArea}>
          <UtilInput
            label="テスト名" 
            placeholder="202008 example.com ブラウザテスト" 
            type="text" 
            name="name" 
            errorMessages={ (errors.name) && [errors.name.message] } 
            inputRef={ register({
              required: "テスト名は必須です",
              maxLength : {
                value: 100,
                message: '最大100文字で入力してください'
              }
            })}
          />
          <UtilInput
            label="テストの説明" 
            placeholder="example.comの2020年8月分のブラウザテスト" 
            type="text" 
            name="description" 
            errorMessages={ (errors.description) && [errors.description.message] } 
            inputRef={ register({
              maxLength : {
                value: 400,
                message: '最大400文字で入力してください'
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
    </form>
  );
}
