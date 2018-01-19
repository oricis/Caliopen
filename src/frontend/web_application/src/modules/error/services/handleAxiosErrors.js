export const handleAxiosErrors = payload => Promise.reject(payload.error.response.data.errors);
