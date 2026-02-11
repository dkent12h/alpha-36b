import axios from 'axios';

async function test() {
    const symbol = 'NVDL';
    const url = `https://finance.yahoo.com/quote/${symbol}`;

    try {
        const res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const html = res.data;

        console.log('Searching for fin-streamer tags...');

        // Find all fin-streamer tags related to NVDL
        const regex = /<fin-streamer[^>]*data-symbol="NVDL"[^>]*>/g;
        const matches = html.match(regex);

        if (matches) {
            console.log(`Found ${matches.length} matches.`);
            matches.forEach(m => {
                // Check if it's related to post market price
                if (m.includes('postMarketPrice') || m.includes('value="')) {
                    console.log('Match:', m);
                }
            });
        } else {
            console.log('No fin-streamer tags found.');
        }

    } catch (e) {
        console.error(e.message);
    }
}
test();
