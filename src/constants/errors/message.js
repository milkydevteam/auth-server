const codes = require('./code');

function getErrorMessage(code) {
  switch (code) {
    case codes.USER_ALREADY_EXISTS:
      return 'Tài khoản đã tồn tại!';
    case codes.NOT_ACCESSED:
      return 'Bạn không được phép thực hiện công việc!';
    case codes.NOT_FOUND_EMAIL:
      return 'Email của bạn chưa đúng!';
    case codes.DIFFERENT_PASSWORD:
      return 'Mật khẩu của bạn chưa đúng!';
    case codes.USER_NOT_FOUND:
      return 'Người dùng không tồn tại';
    case codes.BLOCK_USER:
      return 'Tài khoản của bạn đã bị khóa';
    case codes.ACCOUNT_NOT_FOUND:
      return 'Tài khoản hoặc mật khẩu không đúng';
    default:
      return null;
  }
}

module.exports = getErrorMessage;
