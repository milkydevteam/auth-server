const authService = require('../services/auth');

async function login(req, res) {
  try {
    const { userName, password } = req.body;
    const accessToken = await authService.login(userName, password);
    res.send({ status: 1, result: { accessToken } });
  } catch (error) {
    console.log('login error', error);
    res.send({ status: 0, message: error.message });
  }
}

async function register(req, res) {
  try {
    await authService.register(req.body);
    res.send({ status: 1 });
  } catch (error) {
    console.log('register error', error);
    res.send({ status: 0, message: error.message });
  }
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
