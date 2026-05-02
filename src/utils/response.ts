export const success = (data: unknown, message?: string) => ({
  success: true,
  message,
  data,
});

export const error = (message: string) => ({
  success: false,
  message,
});