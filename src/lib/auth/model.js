import * as cognitoAuth from 'lib/auth/cognitoAuth';
import * as toast from 'lib/util/toast';

// ユーザ情報の更新
export async function updateUserAttributes(updateAttributes) {
  try {
    let currentUser = await cognitoAuth.getCurrentUser();

    await cognitoAuth.updateUserAttributes(currentUser, updateAttributes);

    toast.successToast({
      message: 'ユーザ情報の変更が完了しました',
    });
  
    return await cognitoAuth.getCurrentUser();
  } catch(error) {
    let message = "ユーザ情報の変更に失敗しました"
    
    toast.errorToast({
      message: message
    });
  }
}

// パスワードの更新
export async function changePassword(updatePassword) {
  try {
    const currentUser = await cognitoAuth.getCurrentUser();
    await cognitoAuth.changePassword(
      currentUser,
      updatePassword.oldPassword,
      updatePassword.newPassword
    );
    toast.successToast({
      message: 'パスワードの変更が完了しました',
    });
  } catch(error) {
    let message = "パスワードの変更に失敗しました"
    if(error.code === "NotAuthorizedException") message = "現在のパスワードが誤っています";
    
    toast.errorToast({
      message: message
    });
  }
}