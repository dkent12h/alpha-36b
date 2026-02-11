import axios from 'axios';

async function test() {
    const symbol = 'NVDL';
    // Add includePrePost=true parameters
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=2m&range=1d&includePrePost=true`;
    try {
        const res = await axios.get(url);
        const result = res.data.chart.result[0];
        const meta = result.meta;
        const closes = result.indicators.quote[0].close;
        const timestamps = result.timestamp;

        console.log('Symbol:', meta.symbol);
        console.log('Reg End Time:', meta.currentTradingPeriod.regular.end);

        const lastIdx = closes.length - 1;
        const lastTime = timestamps[lastIdx];
        const lastPrice = closes[lastIdx];

        console.log('Last Data Time:', lastTime);
        console.log('Last Data Price:', lastPrice);

        if (lastTime > meta.currentTradingPeriod.regular.end) {
            console.log('Found POST MARKET data!');
        } else {
            console.log('No post market data found in chart series.');
        }

    } catch (e) {
        console.error(e.message);
    }
}
test();
