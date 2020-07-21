import codes from './code';
import { t } from '../language';

function getErrorMessage(code: number) {
  switch (code) {
    case codes.USER_ALREADY_EXISTS:
      return t('USER_ALREADY_EXISTS');
    case codes.NOT_ACCESSED:
      return t('NOT_ACCESSED');
    case codes.NOT_FOUND_EMAIL:
      return t('NOT_FOUND_EMAIL');
    case codes.DIFFERENT_PASSWORD:
      return t('DIFFERENT_PASSWORD');
    case codes.USER_NOT_FOUND:
      return t('USER_NOT_FOUND');
    case codes.BLOCK_USER:
      return t('BLOCK_USER');
    case codes.ACCOUNT_NOT_FOUND:
      return t('ACCOUNT_NOT_FOUND');
    case codes.REGISTER_INCLUDE:
      return t('REGISTER_INCLUDE');
    default:
      return null;
  }
}

export default getErrorMessage;
