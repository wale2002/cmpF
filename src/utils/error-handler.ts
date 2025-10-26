// src/utils/error-handler.ts
export const handleApiError = (
  error: any,
  defaultMessage = "An error occurred"
) => {
  if (error instanceof Error) {
    return error.message.includes("HTTP")
      ? error.message
      : `${defaultMessage}: ${error.message}`;
  }
  return defaultMessage;
};
