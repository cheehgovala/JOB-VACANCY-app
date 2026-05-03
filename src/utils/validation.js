export const getEmailError = (email) => {
  if (!email || email.trim() === '') return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format';
  return '';
};

export const getPhoneError = (phone) => {
  if (!phone || phone.trim() === '') return 'Phone number is required';
  return '';
};
