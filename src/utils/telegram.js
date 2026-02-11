const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

/**
 * Sends a message to the configured Telegram chat.
 * @param {string} message - The message text to send.
 * @returns {Promise<void>}
 */
export const sendTelegramAlert = async (message) => {
    if (!BOT_TOKEN || !CHAT_ID) {
        // console.warn("Telegram Bot Token or Chat ID is missing in .env");
        return;
    }

    // Basic Markdown escaping (optional, but good for tickers)
    // Telegram needs special chars escaped in MarkdownV2, but simple Markdown is easier.

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML' // Using HTML for simpler bolding <b>text</b>
            })
        });

        if (!response.ok) {
            console.error('Telegram API Error:', await response.text());
        }
    } catch (e) {
        console.error("Failed to send Telegram alert:", e);
    }
};
