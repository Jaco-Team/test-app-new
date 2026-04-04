export async function importWithRetry(importer, { retries = 1, delayMs = 300 } = {}) {
  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await importer();
    } catch (error) {
      lastError = error;

      if (attempt >= retries) {
        break;
      }

      await new Promise((resolve) => {
        setTimeout(resolve, delayMs * (attempt + 1));
      });
    }
  }

  throw lastError;
}

