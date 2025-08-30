/**
 * Generates a user-friendly error message from an Axios error object.
 * @param {Error} error - The error object, typically from an Axios catch block.
 * @param {string} [context='perform the operation'] - A description of the action that failed.
 * @returns {string} A user-friendly error message.
 */
export const getApiErrorMessage = (error, context = 'load data') => {
  // Log the full error for debugging purposes
  console.error(`API Error while trying to ${context}:`, error);

  // Handle network errors (e.g., backend server is down)
  if (error.code === 'ERR_NETWORK' || !error.response) {
    return 'Network Error: Could not connect to the API. Please ensure the backend server is running.';
  }

  // Handle specific HTTP status codes
  if (error.response.status === 403) {
    return 'Permission Denied: You do not have the required permissions to perform this action.';
  }
  if (error.response.status === 401) {
    return 'Authentication Error: Your session may have expired. Please log in again.';
  }

  // Handle specific API error responses
  const { data } = error.response;
  if (data) {
    if (typeof data.detail === 'string') {
      return data.detail;
    }
    // Handle DRF validation errors (e.g., { "field": ["error message"] })
    const firstKey = Object.keys(data)[0];
    if (firstKey && Array.isArray(data[firstKey]) && data[firstKey].length > 0) {
      return `${firstKey.charAt(0).toUpperCase() + firstKey.slice(1)}: ${data[firstKey][0]}`;
    }
    if (typeof data === 'string') {
        return data;
    }
  }

  return `Failed to ${context}. Please try again.`;
};
