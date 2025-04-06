export function useRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000
): Promise<T> {
    return new Promise((resolve, reject) => {
        let retries = 0;
        let lastError: Error | null = null;

        const attempt = async () => {
            try {
                const result = await operation();
                resolve(result);
            } catch (error) {
                lastError = error as Error;
                retries++;

                if (retries < maxRetries) {
                    const delay = initialDelay * Math.pow(2, retries - 1);
                    setTimeout(attempt, delay);
                } else {
                    reject(lastError);
                }
            }
        };

        attempt();
    });
}
