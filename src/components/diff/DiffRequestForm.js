import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from "react-hook-form";
import UtilInput from 'components/util/input/Input';

import {  
  setResult,
  selectResults
} from 'app/domainSlice';

import { sort } from 'lib/result/model';

import _ from 'lodash';
import * as api from 'lib/api/api';
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
    toast.infoToast(
      { message: `差分取得リクエストを送信しました` }
    );
    try {
      dispatch(setResult(
        await api.DiffScreenshotQueingProject({
          request: {
            body: data
          }
        })
      ));
      toast.successToast(
        { message: `差分取得リクエストが完了しました` }
      );
    } catch (error) {
      console.log(error.response);
      toast.errorToast(
        { message: `差分取得リクエストに失敗しました` }
      );
    }
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
          {/* 比較元リザルトの入力セレクタ */}
          <div className={styles.inputItem}>
            <label className={styles.inputLabel}>
              比較元のリザルト
            </label>
            <div className={styles.inputSelect} >
              <select 
                type="select"
                name="originResultId"
                defaultValue={selectedOriginId}
                ref={ register({
                  required: "比較元リザルトを選択してください",
                })}
                onChange={() => {
                  // 比較先リザルトをクリアする
                  setValue('targetResultId', "");
                }}
              >
                <option value=""> --比較元リザルトを選択してください-- </option>
                { resultList.map( (result) => (
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
          {/* 比較先リザルトの入力セレクタ */}
          <div className={styles.inputItem}>
            <label className={styles.inputLabel}>
              比較先のリザルト
            </label>
            <div className={styles.inputSelect} >
              <select 
                type="select"
                name="targetResultId"
                disabled={(originResultId === "")}
                ref={ register({
                  required: "比較先リザルトを選択してください",
                })}
              >
                <option value=""> --比較先リザルトを選択してください-- </option>
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
          {/* リザルト名の入力フォーム */}
          <UtilInput
            label="リザルト名" 
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
          {/* リザルト名の説明フォーム */}
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

// 比較先リザルトのフィルタリング処理
function targetResultFilter (resultList, originResultId) {
  if (!originResultId) return [];

  // 比較元リザルトの取得
  const originResult = resultList.find( (result) => {
    return (result.id === originResultId);
  });

  return resultList.filter((targetResult) => {
    // 同じプロジェクトから出力されたリザルトのみ
    const isSameProject = (originResult.resultTieProjectId === targetResult.resultTieProjectId);
    // 比較元リザルトではない
    const isNotOriginResultId = (originResult.id !== targetResult.id);

    // 上記の条件すべてを満たすとき正(フィルターから除外しない)
    return (isSameProject && isNotOriginResultId);
  });
}


// プロジェクト一覧のフィルタリング処理
export function filterProjectList(projectList, searchWord) {
  return projectList.filter((project) => {
    // プロジェクト名に検索ワードが含まれる要素のみフィルタリング
    return project.name.match(searchWord);
  });
}