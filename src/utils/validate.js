export const validatePassword = (password = '') => {
    if (!password) return false;
    if (!password.length >= 8) {
        return false;
    }
    if (!(/[A-Z]/.test(password))) return false;
    if (!(/[^A-Za-z0-9]/.test(password) && !/\s/.test(password))) return false;
    if (!/\d/.test(password)) return false;
    return true;
}