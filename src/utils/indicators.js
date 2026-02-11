/**
 * Calculate Simple Moving Average (SMA) for a given period.
 * @param {number[]} prices - Array of prices (assumed chronological: [oldest, ..., newest])
 * @param {number} period - Number of periods to calculate average for
 * @returns {number|null} - The SMA value or null if insufficient data
 */
export const calculateSMA = (prices, period = 20) => {
    if (!prices || prices.length < period) return null;
    // Get the LAST 'period' items (most recent)
    const slice = prices.slice(-period);
    const sum = slice.reduce((a, b) => a + (b || 0), 0);
    return sum / period;
};

/**
 * Calculate RSI (Relative Strength Index) using Wilder's Smoothing.
 * @param {number[]} prices - Array of prices (assumed chronological: [oldest, ..., newest])
 * @param {number} period - RSI period (default 14)
 * @returns {number|null} - The RSI value or null if insufficient data
 */
export const calculateRSI = (prices, period = 14) => {
    if (!prices || prices.length < period + 1) return null;

    let gains = [];
    let losses = [];

    // 1. Calculate price changes
    for (let i = 1; i < prices.length; i++) {
        const change = prices[i] - prices[i - 1];
        gains.push(change > 0 ? change : 0);
        losses.push(change < 0 ? Math.abs(change) : 0);
    }

    // 2. Wilder's Smoothing
    // First value is Simple Average
    let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
    let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

    // Subsequent values: (PrevAvg * (period-1) + Current) / period
    for (let i = period; i < gains.length; i++) {
        avgGain = ((avgGain * (period - 1)) + gains[i]) / period;
        avgLoss = ((avgLoss * (period - 1)) + losses[i]) / period;
    }

    if (avgLoss === 0) return 100;

    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
};
