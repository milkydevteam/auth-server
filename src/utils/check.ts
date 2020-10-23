import CustomError from '../constants/errors/CustomError';

export const checkAuthField = (data, type: 'create' | 'login') => {
  let exist;
  if (type === 'create') {
    exist = ['email', 'realDate', 'activeDate', 'role'].every(
      param => {
        return Object.keys(data).includes(param);
      },
    );
    if (exist) {
      if (!data.useDefaultPwd && (!data.password || !data.confirmPassword))
        exist = false;
    }
  }
  if (!exist) throw new CustomError('NOT_FULL_INFO');
};

export const checkUserField = (data, type: 'create') => {
  let exist;
  if (type === 'create') {
    exist = [
      'firstName',
      'middleName',
      'lastName',
      'address',
      'email',
      'branchId',
    ].every(param => {
      return Object.keys(data).includes(param);
    });
  }
  if (!exist) throw new CustomError('NOT_FULL_INFO');
};
