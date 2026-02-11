from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/quote/<symbol>')
def get_quote(symbol):
    try:
        ticker = yf.Ticker(symbol)
        
        # Determine if we need intraday data for extended hours
        # period='1d', interval='1m', include_prepost=True gives best real-time data
        hist = ticker.history(period="1d", interval="1m", prepost=True)
        
        if hist.empty:
            return jsonify({"error": "No data found"}), 404
            
        last_row = hist.iloc[-1]
        last_price = float(last_row['Close'])
        last_time = last_row.name # index
        
        # Get metadata
        info = ticker.info
        
        # Logic to determine PRE/POST/REGULAR
        # For simplicity, we trust yfinance's last price as the 'current' price
        # and info['previousClose'] as the baseline.
        
        prev_close = info.get('previousClose', 0.0)
        # However, yfinance 'previousClose' might be YESTERDAY's close.
        # If market is closed (Post-market), we might want TODAY's Regular Close as baseline.
        
        # yfinance info sometimes has 'regularMarketPrice'
        regular_close = info.get('regularMarketPrice', prev_close)
        
        # Use Python server time to determine market state if needed, 
        # but relying on yfinance data is safer.
        
        # Construct response compatible with frontend needs
        data = {
            "symbol": symbol,
            "price": last_price,
            "prevClose": prev_close, # Default to standard prev close
            "regularMarketPrice": regular_close,
            "postMarketPrice": info.get('postMarketPrice'),
            "preMarketPrice": info.get('preMarketPrice'),
            "marketState": info.get('marketState', 'REGULAR'),
            # "lastTradeTime": last_time.isoformat()
        }
        
        return jsonify(data)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting yfinance server on port 5000...")
    app.run(port=5000, debug=True)
