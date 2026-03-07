export async function onRequest(context) {
    const { request, params } = context;
    let symbol = params.symbol;

    if (!symbol) {
        // Fallback or handle missing...
        const url = new URL(request.url);
        const match = url.pathname.match(/\/api\/yahoo-html\/quote\/([^/]+)/);
        if (match && match[1]) {
            symbol = match[1];
        }
    }

    if (!symbol) {
        return new Response(JSON.stringify({ error: 'No symbol provided' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const yahooUrl = `https://finance.yahoo.com/quote/${symbol}`;

    try {
        const response = await fetch(yahooUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const html = await response.text();

        return new Response(html, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=60' // Cache HTML for 1 min
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
