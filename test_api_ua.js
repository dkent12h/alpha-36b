import axios from 'axios';

async function test() {
    const symbol = 'NVDL';
    // Use interval=15m this time
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=15m&range=5d&includePrePost=true`;

    try {
        const res = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const result = res.data.chart.result[0];
        const meta = result.meta;
        const closes = result.indicators.quote[0].close;
        const timestamps = result.timestamp;

        console.log('Symbol:', meta.symbol);
        console.log('RegularPrice:', meta.regularMarketPrice);
        console.log('PostPrice:', meta.postMarketPrice);
        console.log('PrePrice:', meta.preMarketPrice);

        const lastIdx = closes.length - 1;
        console.log('Last Close:', closes[lastIdx]);
        console.log('Last Time:', new Date(timestamps[lastIdx] * 1000).toLocaleString());

    } catch (e) {
        console.error(e.message);
    }
}
test();
