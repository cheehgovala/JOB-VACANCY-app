export const getEmailError = (email) => {
  if (!email || email.trim() === '') return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format';
  return '';
};

export const getPhoneError = (phone) => {
  if (!phone || phone.trim() === '') return 'Phone number is required';
  const phoneClean = phone.replace(/\s+/g, '');
  const phoneRegex = /^\+?[0-9]{9,15}$/;
  if (!phoneRegex.test(phoneClean)) return 'Phone number must be between 9 and 15 digits';
  return '';
};
