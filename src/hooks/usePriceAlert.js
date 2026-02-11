import { useEffect, useRef } from 'react';
import { sendTelegramAlert } from '../utils/telegram';

/**
 * Hook to check price targets and trigger Telegram alerts.
 * Uses localStorage to debounce alerts (prevent spam).
 * @param {string} ticker - The stock ticker symbol.
 * @param {object} data - Market data for the ticker ({ price: number, ... }).
 * @param {object} settings - Strategy settings ({ basePrice, target1, target2 }).
 */
export const usePriceAlert = (ticker, data, settings) => {
    // We use a ref to track if we've already checked recently to avoid spam on every render
    const lastCheckRef = useRef(0);

    useEffect(() => {
        if (!data || !data.price || !settings) return;
        if (!settings.enabled) return; // Optional enabled flag

        // Run check every 30 seconds max
        const now = Date.now();
        if (now - lastCheckRef.current < 30000) return;
        lastCheckRef.current = now;

        const currentPrice = parseFloat(data.price);
        const basePrice = parseFloat(settings.basePrice);

        // Skip if basePrice is invalid (e.g., 0)
        if (!basePrice || basePrice <= 0) return;

        const target1Percent = parseFloat(settings.target1) || 7;
        const target2Percent = parseFloat(settings.target2) || 14;

        const priceTarget1 = basePrice * (1 - target1Percent / 100);
        const priceTarget2 = basePrice * (1 - target2Percent / 100);

        // Simple check logic
        // If price <= target, send alert if not sent today
        const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        const checkAndSend = (targetPrice, label, levelKey) => {
            // Check condition: Price is at or below target
            if (currentPrice <= targetPrice) {
                const storageKey = `alert_sent_${ticker}_${levelKey}_${todayStr}`;
                const alreadySent = localStorage.getItem(storageKey);

                if (!alreadySent) {
                    const msg = `🚨 <b>${ticker} 매수 알림!</b> 🚨\n\n` +
                        `현재가: <b>$${currentPrice.toFixed(2)}</b>\n` +
                        `목표가(${label}): $${targetPrice.toFixed(2)}\n` +
                        `기준가 대비: -${((basePrice - currentPrice) / basePrice * 100).toFixed(2)}%`;

                    sendTelegramAlert(msg);
                    localStorage.setItem(storageKey, 'true');
                    console.log(`Telegram Alert Sent: ${ticker} ${label}`);
                }
            }
        };

        // Check Target 2 (Deeper pullback first)
        checkAndSend(priceTarget2, `2차 진입 -${target2Percent}%`, 'TARGET2');
        // Check Target 1
        checkAndSend(priceTarget1, `1차 진입 -${target1Percent}%`, 'TARGET1');

    }, [ticker, data, settings]);
};
