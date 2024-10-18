interface AxiosErrorResponse {
  message: string | string[]; // Измените в зависимости от вашей структуры
}
export interface AxiosCustomError {
  response?: {
    data?: AxiosErrorResponse;
  };
  message: string;
}
export const getHeaders = () => ({
  'Content-Type': 'application/json',
  Accept: 'application/json',
});

export const errorCatch = (error: AxiosCustomError): string => {
  const message = error.response?.data?.message;

  return message
    ? Array.isArray(message)
      ? message[0]
      : message
    : error.message;
};
