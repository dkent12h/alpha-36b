export const MARKETS = {
    // ------------------------------------------------------------
    // 1. INDICES (Market Overview)
    // ------------------------------------------------------------
    INDICES: [
        { ticker: '^KS11', name: 'KOSPI' },
        { ticker: '^IXIC', name: 'NASDAQ' },
        { ticker: '^GSPC', name: 'S&P 500' },
        { ticker: 'BTC-USD', name: 'Bitcoin' },
        { ticker: 'GC=F', name: 'Gold' },
        { ticker: 'DX-Y.NYB', name: 'Dollar Index' },
        { ticker: '^KS200', name: 'KOSPI 200 Futures (Proxy)' },
        { ticker: 'NQ=F', name: 'Nasdaq 100 Futures' },
        { ticker: 'ES=F', name: 'S&P 500 Futures' },

    ],

    // ------------------------------------------------------------
    // 2. PORTFOLIO - KOREA (KR Port Tab)
    // ------------------------------------------------------------
    PORTFOLIO_KR: [
        // Core Stocks
        { ticker: '005930.KS', name: '삼성전자', strategy: 'CORE', target: 500 },
        { ticker: '000660.KS', name: 'SK하이닉스', strategy: 'ALPHA', target: 50 },
        { ticker: '052710.KS', name: '아모텍', strategy: 'ALPHA' },

        // Index ETFs
        { ticker: '102110.KS', name: 'TIGER 200', strategy: 'CORE', target: 500 },

        // Sector ETFs
        { ticker: '466420.KS', name: 'KODEX K-조선Top10', strategy: 'ALPHA' },
        { ticker: '487250.KS', name: 'KODEX 미국AI전력', strategy: 'ALPHA' },
        { ticker: '139280.KS', name: 'TIGER 원자력', strategy: 'ALPHA' },
        { ticker: '464000.KS', name: 'KODEX K-방산', strategy: 'ALPHA' },
        { ticker: '091170.KS', name: 'KODEX 은행', strategy: 'INCOME' },
        { ticker: '445290.KS', name: 'KODEX 로봇 Active', strategy: 'ALPHA' },
        { ticker: '305720.KS', name: 'TIGER 2차전지소재', strategy: 'ALPHA' },
        { ticker: '143860.KS', name: 'TIGER 헬스케어', strategy: 'ALPHA' },
    ],

    // ------------------------------------------------------------
    // 3. PORTFOLIO - US (US Port Tab)
    // ------------------------------------------------------------
    PORTFOLIO_US: [
        // Core Stocks
        { ticker: 'NVDA', name: '엔비디아 (NVIDIA)', strategy: 'ALPHA', earningsDate: '2026-02-26' },
        { ticker: 'ARM', name: 'ARM 홀딩스', strategy: 'ALPHA', earningsDate: '2026-02-08' },
        { ticker: 'MSFT', name: '마이크로소프트', strategy: 'CORE', earningsDate: '2026-04-25' },
        { ticker: 'GOOGL', name: '구글 (Alphabet)', strategy: 'ALPHA', earningsDate: '2026-04-24' },
        { ticker: 'AAPL', name: '애플 (Apple)', strategy: 'CORE' },
        { ticker: 'TSLA', name: '테슬라 (Tesla)', strategy: 'ALPHA', earningsDate: '2026-04-22' },

        // ETFs
        { ticker: 'POWR', name: 'POWR (전력 ETF)', strategy: 'ALPHA' },
        { ticker: 'VOO', name: 'VOO (S&P500)', strategy: 'CORE' },
        { ticker: 'QQQM', name: 'QQQM (나스닥100)', strategy: 'CORE' },
        { ticker: 'SOXX', name: 'SOXX (반도체)', strategy: 'ALPHA' },
        { ticker: 'TLT', name: 'TLT (미국장기채)', strategy: 'CORE' },

        // Crypto & Commodities
        { ticker: 'BTC-USD', name: '비트코인 (BTC)', strategy: 'ALPHA' },
        { ticker: 'IAU', name: 'IAU (금)', strategy: 'SAFE' },
        { ticker: 'SLV', name: 'SLV (은)', strategy: 'SAFE' },

        // Strategy & Leverage
        { ticker: 'SOXL', name: 'SOXL (3x Semi)', strategy: 'ALPHA' },
        { ticker: 'TQQQ', name: 'TQQQ (3x Tech)', strategy: 'ALPHA' },
        { ticker: 'NVDL', name: 'NVDL (2x NVDA)', strategy: 'ALPHA' },
        { ticker: 'TSLL', name: 'TSLL (2x TSLA)', strategy: 'ALPHA' },

        // Cash
        { ticker: 'SGOV', name: 'SGOV / KOFR (현금)', strategy: 'SAFE' },
    ],

    // ------------------------------------------------------------
    // 4. BLUE CHIP (Previously CORE)
    // - Stable, Large Cap, Lower Volatility
    // ------------------------------------------------------------
    BLUE_CHIP: [
        { ticker: 'AAPL', name: 'Apple (AAPL)', strategy: 'CORE' },
        { ticker: 'MSFT', name: 'Microsoft (MSFT)', strategy: 'CORE' },
        { ticker: 'VOO', name: 'Vanguard S&P 500', strategy: 'CORE' },
        { ticker: 'SGOV', name: 'iShares 0-3 Month Treasury (Cash)', strategy: 'SAFE' },
        { ticker: 'TLT', name: 'iShares 20+ Year Treasury', strategy: 'CORE' },
        { ticker: 'SCHD', name: 'Schwab US Dividend Equity', strategy: 'INCOME' },
        { ticker: 'O', name: 'Realty Income', strategy: 'INCOME' },
        { ticker: 'PFE', name: 'Pfizer', strategy: 'INCOME' },
        { ticker: 'ACN', name: 'Accenture', strategy: 'CORE' },
        { ticker: 'AXP', name: 'American Express', strategy: 'CORE' },
        { ticker: 'FDX', name: 'FedEx', strategy: 'CORE' },
        { ticker: 'EMR', name: 'Emerson Electric', strategy: 'CORE' },
        { ticker: 'KO', name: 'Coca-Cola', strategy: 'INCOME' },
        { ticker: 'EDY', name: 'Vanguard Extended Duration (EDV)', strategy: 'CORE' },
        { ticker: 'LLY', name: 'Eli Lilly', strategy: 'CORE' },
        { ticker: 'INTC', name: 'Intel', strategy: 'CORE' },
        { ticker: 'BRK-B', name: 'Berkshire Hathaway', strategy: 'CORE' },
        { ticker: 'IBM', name: 'IBM', strategy: 'INCOME' },
        { ticker: 'NKE', name: 'Nike', strategy: 'CORE' },
        { ticker: 'XLV', name: 'Health Care Select Sector SPDR', strategy: 'CORE' },
        { ticker: 'XLU', name: 'Utilities Select Sector SPDR', strategy: 'INCOME' },
        { ticker: 'XLP', name: 'Consumer Staples Select Sector SPDR', strategy: 'INCOME' },
    ],

    // ------------------------------------------------------------
    // 5. GROWTH (Previously ALPHA)
    // - High Growth, Tech, Higher Volatility
    // ------------------------------------------------------------
    GROWTH: [
        { ticker: 'POWR', name: 'POWR (Power ETF)', strategy: 'ALPHA' },
        { ticker: 'NVDA', name: 'NVIDIA', strategy: 'ALPHA', earningsDate: '2026-02-26' },
        { ticker: 'TSLA', name: 'Tesla', strategy: 'ALPHA', earningsDate: '2026-04-22' },
        { ticker: 'AMD', name: 'AMD', strategy: 'ALPHA', earningsDate: '2026-04-30' },
        { ticker: 'GOOGL', name: 'Alphabet (Google)', strategy: 'ALPHA', earningsDate: '2026-04-24' },
        { ticker: 'AMZN', name: 'Amazon', strategy: 'ALPHA', earningsDate: '2026-04-28' },
        { ticker: 'META', name: 'Meta Platforms', strategy: 'ALPHA', earningsDate: '2026-04-29' },
        { ticker: 'BTC-USD', name: 'Bitcoin', strategy: 'ALPHA' },
        { ticker: 'MSTR', name: 'MicroStrategy', strategy: 'ALPHA' },
        { ticker: 'ORCL', name: 'Oracle', strategy: 'ALPHA' },
        { ticker: 'ISRG', name: 'Intuitive Surgical', strategy: 'ALPHA' },
        { ticker: 'UNH', name: 'UnitedHealth Group', strategy: 'ALPHA' },
        { ticker: 'PLTR', name: 'Palantir', strategy: 'ALPHA' },
        { ticker: 'ANET', name: 'Arista Networks', strategy: 'ALPHA' },
        { ticker: 'MU', name: 'Micron Technology', strategy: 'ALPHA' },
        { ticker: 'AMAT', name: 'Applied Materials', strategy: 'ALPHA' },
        { ticker: 'TSM', name: 'TSMC', strategy: 'ALPHA' },
        { ticker: 'RGTI', name: 'Rigetti Computing', strategy: 'ALPHA' },
        { ticker: 'IONQ', name: 'IonQ', strategy: 'ALPHA' },
        { ticker: 'SMCI', name: 'Super Micro Computer', strategy: 'ALPHA' },
        { ticker: 'RKLB', name: 'Rocket Lab', strategy: 'ALPHA' },
        { ticker: 'ASML', name: 'ASML', strategy: 'ALPHA' },
        { ticker: 'ARM', name: 'Arm Holdings', strategy: 'ALPHA' },
        { ticker: 'IAUM', name: 'iShares Gold Trust Micro', strategy: 'ALPHA' },
        { ticker: 'SIVR', name: 'abrdn Physical Silver', strategy: 'ALPHA' },
        { ticker: 'QQQM', name: 'Invesco NASDAQ-100', strategy: 'ALPHA' },
        { ticker: 'V', name: 'Visa', strategy: 'ALPHA' },
        { ticker: 'AVGO', name: 'Broadcom', strategy: 'ALPHA' },
        { ticker: 'QCOM', name: 'Qualcomm', strategy: 'ALPHA' },
        { ticker: 'CRWD', name: 'CrowdStrike', strategy: 'ALPHA' },
        { ticker: 'CSCO', name: 'Cisco Systems', strategy: 'ALPHA' },
        { ticker: 'ZETA', name: 'Zeta Global', strategy: 'ALPHA' },
        { ticker: 'CRM', name: 'Salesforce', strategy: 'ALPHA' },
        { ticker: 'QQQ', name: 'Invesco QQQ Trust', strategy: 'ALPHA' },
        { ticker: 'MRVL', name: 'Marvell Technology', strategy: 'ALPHA' },
        { ticker: 'ADBE', name: 'Adobe', strategy: 'ALPHA' },
        { ticker: 'U', name: 'Unity Software', strategy: 'ALPHA' },
        { ticker: 'LAES', name: 'SEALSQ (실스크)', strategy: 'ALPHA' },
        { ticker: 'NOW', name: 'ServiceNow', strategy: 'ALPHA' },
        { ticker: 'LITP', name: 'Sprott Lithium Miners ETF', strategy: 'ALPHA' },
        { ticker: 'BOTZ', name: 'Global X Robotics & AI ETF', strategy: 'ALPHA' },
    ],

    // ------------------------------------------------------------
    // 6. KOREA (Domestic Stocks) - NEW
    // - All KR stocks and ETFs
    // ------------------------------------------------------------
    KOREA: [
        { ticker: '005930.KS', name: '삼성전자', strategy: 'CORE' },
        { ticker: '000660.KS', name: 'SK하이닉스', strategy: 'ALPHA' },
        { ticker: '052710.KQ', name: '아모텍', strategy: 'ALPHA' },
        { ticker: '102110.KS', name: 'TIGER 200', strategy: 'CORE' },
        { ticker: '015760.KS', name: '한국전력', strategy: 'CORE' },
        { ticker: '034020.KS', name: '두산에너빌리티', strategy: 'ALPHA' },
        { ticker: '005380.KS', name: '현대차', strategy: 'CORE' },
        { ticker: '000270.KS', name: '기아', strategy: 'CORE' },
        { ticker: '035420.KS', name: 'NAVER', strategy: 'ALPHA' },
        { ticker: '035720.KS', name: '카카오', strategy: 'ALPHA' },
        { ticker: '196170.KQ', name: '알테오젠', strategy: 'ALPHA' },
        // 새로 추가된 종목들
        { ticker: '007660.KS', name: '이수페타시스', strategy: 'ALPHA' },
        { ticker: '042660.KS', name: '한화오션', strategy: 'ALPHA' },
        { ticker: '042700.KS', name: '한미반도체', strategy: 'ALPHA' },
        { ticker: '086790.KS', name: '하나금융지주', strategy: 'INCOME' },
        { ticker: '101490.KQ', name: '에스앤에스텍', strategy: 'ALPHA' },
        { ticker: '033640.KQ', name: '네패스', strategy: 'ALPHA' },
        { ticker: '108320.KQ', name: 'LX세미콘', strategy: 'ALPHA' },
        { ticker: '008350.KS', name: '남선알미늄', strategy: 'ALPHA' },
        { ticker: '105560.KS', name: 'KB금융', strategy: 'INCOME' },
        { ticker: '055550.KS', name: '신한지주', strategy: 'INCOME' },
        { ticker: '005490.KS', name: '포스코홀딩스', strategy: 'CORE' },
        { ticker: '439320.KQ', name: '코칩', strategy: 'ALPHA' },
        { ticker: '178320.KQ', name: '서진시스템', strategy: 'ALPHA' },
        { ticker: '200880.KS', name: '서연이화', strategy: 'ALPHA' },
        { ticker: '205100.KQ', name: '엑셈', strategy: 'ALPHA' },
        { ticker: '161390.KS', name: '한국타이어앤테크놀로지', strategy: 'CORE' },
        { ticker: '207940.KS', name: '삼성바이오로직스', strategy: 'CORE' },
        { ticker: '222800.KQ', name: '심텍', strategy: 'ALPHA' },
        { ticker: '249420.KS', name: '일동제약', strategy: 'ALPHA' },
        { ticker: '251350.KS', name: 'KODEX 선진국MSCI World', strategy: 'CORE' },
        { ticker: '319660.KQ', name: '피에스케이', strategy: 'ALPHA' },
        { ticker: '329200.KS', name: 'TIGER 리츠부동산인프라', strategy: 'INCOME' },
        { ticker: '373220.KS', name: 'LG에너지솔루션', strategy: 'ALPHA' },
        { ticker: '454910.KS', name: '두산로보틱스', strategy: 'ALPHA' },
        { ticker: '418670.KS', name: 'ACE 미국30년국채액티브(H)', strategy: 'SAFE' },
    ],

    // ------------------------------------------------------------
    // 7. LEVERAGE (Strategy Tab)
    // ------------------------------------------------------------
    LEVERAGE: [
        { ticker: 'SOXL', name: 'SOXL (3x Semi)', strategy: 'ALPHA' },
        { ticker: 'TQQQ', name: 'TQQQ (3x Tech)', strategy: 'ALPHA' },
        { ticker: 'NVDL', name: 'NVDL (2x NVDA)', strategy: 'ALPHA' },
        { ticker: 'TSLL', name: 'TSLL (2x TSLA)', strategy: 'ALPHA' },

    ],

    // ------------------------------------------------------------
    // 8. WATCHLIST (Sectors Tab) -- Keeping leftovers or merging?
    // User asked for "Domestic" menu. 
    // I already moved the contents of SECTORS to KOREA above.
    // I'll keep the SECTORS key just in case, or maybe repurpose it?
    // The user didn't ask to delete "Sectors", but "Sector menu -> .. KODEX Top10". 
    // Wait, the previous request was about "Sector Menu". 
    // I should probably keep "SECTORS" specifically for these Thematic ETFs if the user wants purely sector view.
    // But "Domestic" menu should probably include them too.
    // I'll keep SECTORS as a separate list for now to avoid breaking too much, but I'll focus the new menus as requested.
    // ------------------------------------------------------------
    SECTORS: [
        { ticker: '466940.KS', name: 'TIGER 은행고배당플러스TOP10' },
        { ticker: '487240.KS', name: 'KODEX AI전력핵심설비' },
        { ticker: '0091P0.KS', name: 'TIGER 원자력' },
        { ticker: '445290.KS', name: 'KODEX 로봇액티브' },
        { ticker: '463250.KS', name: 'KoAct K-방산' },
        { ticker: '364970.KS', name: 'TIGER 바이오TOP10' },
        { ticker: '0115D0.KS', name: 'KODEX K-조선Top10' },
        { ticker: '305720.KS', name: 'TIGER 2차전지소재' },
    ],

    // ------------------------------------------------------------
    // 9. ISA (Income)
    // ------------------------------------------------------------
    ISA: [
        { ticker: '498400.KS', name: 'KODEX 200타겟위클리커버드콜', strategy: 'INCOME' },
        { ticker: '472150.KS', name: 'TIGER 배당커버드콜액티브', strategy: 'INCOME' },
        { ticker: '498410.KS', name: 'KODEX 금융고배당TOP10타겟위클리커버드콜', strategy: 'INCOME' },
        { ticker: '483290.KS', name: 'KODEX 미국배당다우존스타겟커버드콜', strategy: 'INCOME' },
        { ticker: '489030.KS', name: 'PLUS 고배당주위클리커버드콜', strategy: 'INCOME' },
        { ticker: '480030.KS', name: 'ACE 미국500데일리타겟커버드콜(합성)', strategy: 'INCOME' },
        { ticker: '473330.KS', name: 'SOL 미국30년국채커버드콜(합성)', strategy: 'INCOME' },
        { ticker: '0005A0.KS', name: 'KODEX 미국S&P500데일리커버드콜OTM', strategy: 'INCOME' },
        { ticker: '480020.KS', name: 'ACE 미국빅테크7+데일리타겟커버드콜(합성)', strategy: 'INCOME' },
        { ticker: '486290.KS', name: 'TIGER 미국나스닥100타겟데일리커버드콜', strategy: 'INCOME' },
    ],

    // ------------------------------------------------------------
    // 10. PENSION (연금저축)
    // ------------------------------------------------------------
    PENSION: [
        { ticker: '379800.KS', name: 'KODEX 미국S&P500TR' },
        { ticker: '379810.KS', name: 'KODEX 미국나스닥100TR' },
        { ticker: '481190.KS', name: 'SOL 미국테크TOP10' },
    ]
};
