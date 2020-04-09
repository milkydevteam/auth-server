const authService = require('../services/auth');

async function login(req, res) {
  const { email, password } = req.body;
  const accessToken = await authService.login(email, password);
  return res.send({ status: 1, result: { accessToken } });
}

async function register(req, res) {
  await authService.register(req.body);
  return res.send({ status: 1 });
}

async function logout(req, res) {
  const { accessToken } = req;
  await authService.logout(accessToken);
  req.accessToken = null;
  req.user = null;
  req.userId = null;
  return res.send({ status: 1 });
}

async function verifyAccessToken(req, res) {
  const { accessToken } = req;
  if (accessToken) {
    const { user } = await authService.verifyAccessToken(accessToken);
    if (user) {
      return res.send({
        status: 1,
        result: {
          user: {
            name: user.name,
            email: user.email,
            id: user._id,
            roles: user.roles,
          },
        },
      });
    }
  }
  return res.send({
    status: -1,
    message: 'Unauthorized',
  });
}

async function changePassword(req, res) {
  const { password, newPassword, userId } = req.body;
  await authService.changePassword(userId, password, newPassword);
  return res.send({ status: 1 });
}

module.exports = {
  login,
  register,
  logout,
  verifyAccessToken,
  changePassword,
};
