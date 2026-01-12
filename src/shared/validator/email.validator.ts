export const isValidEmail = (email: string | undefined): boolean => {
  if (!email) return false;
  email = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
