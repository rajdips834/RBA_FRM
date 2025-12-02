// In-memory logger

const logs = [];

const logger = {
  logRequest: (request, response, isError = false) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      request,
      response,
      isError,
    };
    logs.unshift(logEntry); // Add to the beginning of the array

    // Optional: Keep logs from growing indefinitely
    if (logs.length > 2000) {
      logs.pop();
    }
  },
  getLogs: () => {
    return logs;
  },
  clearLogs: () => {
    logs.length = 0;
  },
};

export { logger };
