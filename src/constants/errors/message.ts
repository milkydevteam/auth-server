import { t } from '../language';

function getErrorMessage(code: string) {
  return t(code) || code;
}

export default getErrorMessage;
