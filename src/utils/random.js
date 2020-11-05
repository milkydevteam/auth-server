function generateRandomString(length, allowedChars) {
  let text = '';
  const possible =
    allowedChars ||
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function generateRandomNumber(length) {
  let text = '';
  for (let i = 0; i < length; i += 1) {
    text += Math.floor(Math.random() *10);
  }
  return text;
} 

module.exports = { generateRandomString,generateRandomNumber };
