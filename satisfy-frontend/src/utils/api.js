export const getApiErrorMessage = (error, fallback = 'Une erreur est survenue') => {
  const response = error?.response?.data;
  const fieldErrors = response?.errors;

  if (fieldErrors && typeof fieldErrors === 'object') {
    const firstFieldError = Object.values(fieldErrors)
      .flat()
      .find((message) => typeof message === 'string' && message.trim() !== '');

    if (firstFieldError) {
      return firstFieldError;
    }
  }

  return response?.message || error?.message || fallback;
};
