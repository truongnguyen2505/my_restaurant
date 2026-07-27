import { APP_CONFIG } from "./config.js";

export class HttpClient {

    static async request(url, options = {}) {

        const controller = new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
        }, APP_CONFIG.API_TIMEOUT);

        try {

            const response = await fetch(
                `${APP_CONFIG.API_BASE_URL}${url}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        ...(options.headers || {})
                    },
                    ...options,
                    signal: controller.signal
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Request failed.");
            }

            return result;

        } finally {

            clearTimeout(timeout);

        }

    }

}