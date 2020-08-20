import CustomError from '../constants/errors/CustomError';

export const checkAuthField = (data, type: 'create' | 'login') => {
  let exist;
  if (type === 'create') {
    exist = ['userId', 'passwordMaxRetrieve', 'realDate', 'activeDate'].every(
      param => {
        return Object.keys(data).includes(param);
      },
    );
    if (exist) {
      if (!data.roles && !data.roleCode) exist = false;
      if (!data.useDefaultPwd && (!data.password || !data.confirmPassword))
        exist = false;
    }
  }
  if (!exist) throw new CustomError('NOT_FULL_INFO');
};
