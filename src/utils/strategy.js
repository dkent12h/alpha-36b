/**
 * Alpha 3.6B Strategy Engine (Korean Ver.)
 * Enhanced with Super Strong Buy (초강력 매수) logic
 */

export const getStrategyFeedback = (data, tickerInfo = {}) => {
    const { price, ma20, ma200, rsi14, rsi21, bollinger, volumeRatio, status } = data;
    const { strategy: strategyType = 'CORE', group = 'US_SINGLE' } = tickerInfo;

    // Convert inputs
    const p = parseFloat(price);
    const m = parseFloat(ma20);
    const r14 = parseFloat(rsi14);
    const r21 = parseFloat(rsi21);
    const volRatio = parseFloat(volumeRatio) || 0;
    const m200 = parseFloat(ma200) || null;

    if (isNaN(p) || isNaN(m) || isNaN(r14)) {
        return {
            action: "로딩 중...",
            reason: "데이터를 불러오는 중입니다...",
            color: "text-slate-500",
            type: 'LOADING'
        };
    }

    const disparity = ((p - m) / m) * 100;
    const disparity200 = m200 ? ((p - m200) / m200) * 100 : null;

    // Helper: Global Indices (VIX/VKOSPI) from data if available, 
    // but strategy currently receives individual ticker data. 
    // We expect the caller to pass indices or we assume they are checked elsewhere.
    // In this app, VIX and VKOSPI are tracked as tickers.
    // For now, let's assume we pass them in or fetch from global state.
    const vix = parseFloat(window.vix_value) || 20; // Fallback to 20 if not set
    const vkospi = parseFloat(window.vkospi_value) || 20;

    // ---------------------------------------------------------
    // 1. SUPER STRONG BUY (초강력 매수) - Groups Specific
    // ---------------------------------------------------------
    let isSuperStrong = false;
    let ssbReason = "";

    const bbBroken = bollinger && p <= bollinger.lower;

    if (group === 'US_ETF') {
        if (r14 <= 30 && bbBroken && vix >= 30 && volRatio >= 2.0 && (disparity200 !== null && disparity200 >= -7)) {
            isSuperStrong = true;
            ssbReason = "대형 ETF 초강력 타점: RSI 30이하 + BB하단이탈 + VIX 30이상 + 거래량 2배 + 200일선 -7%이내.";
        }
    } else if (group === 'US_SINGLE') {
        if (r14 <= 30 && bbBroken && vix >= 25 && volRatio >= 2.0 && (disparity200 !== null && disparity200 >= -10)) {
            isSuperStrong = true;
            ssbReason = "대형주 초강력 타점: RSI 30이하 + BB하단이탈 + VIX 25이상 + 거래량 2배 + 200일선 -10%이내.";
        }
    } else if (group === 'US_SMALL') {
        if (r21 <= 25 && bbBroken && vix >= 35 && volRatio >= 3.0) {
            isSuperStrong = true;
            ssbReason = "소형주 초강력 타점: RSI(21) 25이하 + BB하단이탈 + VIX 35이상 + 거래량 3배.";
        }
    } else if (group === 'KR_KOSPI') {
        if (r14 <= 30 && bbBroken && vkospi >= 25 && volRatio >= 2.0) {
            isSuperStrong = true;
            ssbReason = "코스피 초강력 타점: RSI 30이하 + BB하단이탈 + VKOSPI 25이상 + 거래량 2배.";
        }
    } else if (group === 'KR_KOSDAQ_MID') {
        if (r21 <= 25 && bbBroken && vkospi >= 30 && volRatio >= 3.0) {
            isSuperStrong = true;
            ssbReason = "코스닥 중형주 초강력 타점: RSI(21) 25이하 + BB하단이탈 + VKOSPI 30이상 + 거래량 3배.";
        }
    }

    if (isSuperStrong) {
        return {
            action: "초강력 매수 (All-In)",
            reason: ssbReason,
            color: "text-yellow-400 font-black animate-bounce",
            type: 'SUPER_BUY'
        };
    }

    // ---------------------------------------------------------
    // 2. STRONG SELL (강력 매도) - 초과열 상태
    // ---------------------------------------------------------
    if (r14 >= 75 && disparity >= 10) {
        return {
            action: "강력 매도 (초과열)",
            reason: `RSI ${r14.toFixed(1)} 단기 폭등 및 이격도 과다(+${disparity.toFixed(1)}%). 전량 익절을 고려하세요.`,
            color: "text-red-500 font-extrabold animate-pulse",
            type: 'SELL'
        };
    }

    // ---------------------------------------------------------
    // 3. SELL (Harvest)
    // ---------------------------------------------------------
    if (r14 >= 70) {
        return {
            action: "매도 (익절)",
            reason: `RSI ${r14.toFixed(1)} (과열). 분할 매도로 수익을 챙기세요.`,
            color: "text-red-500 font-bold",
            type: 'SELL'
        };
    }

    // ---------------------------------------------------------
    // 4. STRONG STOP LOSS (강력 손절)
    // ---------------------------------------------------------
    if (disparity <= -10.0 && r14 < 35) {
        return {
            action: "강력 손절 (폭락)",
            reason: `20일선 -10% 이상 폭락 및 RSI ${r14.toFixed(1)}. 데드캣 바운스도 위험한 구간입니다. 즉시 대피하세요.`,
            color: "text-red-600 font-extrabold animate-bounce",
            type: 'SELL'
        };
    }

    if (disparity <= -5.0 && r14 < 40) {
        return {
            action: "손절 (하방열림)",
            reason: `20일선 -5% 이탈 및 RSI ${r14.toFixed(1)}📉. 추가 급락 위험이 큽니다. 비중 조절을 권장합니다.`,
            color: "text-rose-500 font-bold animate-pulse",
            type: 'SELL'
        };
    }

    // ---------------------------------------------------------
    // 5. WAIT (Danger Zone)
    // ---------------------------------------------------------
    if (p < m) {
        return {
            action: "관망 (대기)",
            reason: `20일선 이탈 (이격도 ${disparity.toFixed(1)}%). 확실한 반등 전까지 매수 금지.`,
            color: "text-slate-500",
            type: 'WAIT'
        };
    }

    // ---------------------------------------------------------
    // 6. STRONG BUY (강력 매수) - 공통 규칙
    // ---------------------------------------------------------
    if ((r14 <= 32 && disparity > -10) || (disparity >= 0 && disparity <= 1.0 && r14 >= 40 && r14 <= 50)) {
        return {
            action: "강력 매수 (바닥/돌파)",
            reason: (r14 <= 32)
                ? `RSI ${r14.toFixed(1)} 과매도. 반등을 노리는 적극 매수 타점입니다.`
                : `20일선 안착 후 상승 전환 시작. 강력한 매수 타이밍입니다.`,
            color: "text-purple-400 font-extrabold animate-pulse",
            type: 'BUY'
        };
    }

    // ---------------------------------------------------------
    // 7. BUY STRATEGIES (Conditional)
    // ---------------------------------------------------------
    if (strategyType === 'CORE' || strategyType === 'SAFE' || strategyType === 'INCOME') {
        if (disparity >= 0 && disparity <= 3.5 && r14 < 60) {
            return {
                action: "매수 (눌림목)",
                reason: `20일선 지지 (이격 +${disparity.toFixed(1)}%). 분할 매수 적기입니다.`,
                color: "text-emerald-400 font-bold",
                type: 'BUY'
            };
        }
    }

    if (strategyType === 'ALPHA') {
        if (r14 >= 60 && r14 < 70) {
            return {
                action: "매수 (돌파)",
                reason: `강한 상승 추세 (RSI ${r14.toFixed(1)}). 전고점 돌파 시 추가 매수.`,
                color: "text-blue-400 font-bold",
                type: 'BUY'
            };
        }
        if (disparity >= 0 && disparity <= 4.0 && r14 < 60) {
            return {
                action: "매수 (지지)",
                reason: `추세선 지지 확인 (이격 +${disparity.toFixed(1)}%).`,
                color: "text-emerald-400 font-bold",
                type: 'BUY'
            };
        }
    }

    // ---------------------------------------------------------
    // 8. HOLD (보유)
    // ---------------------------------------------------------
    return {
        action: "홀딩 (지속)",
        reason: "20일선 위에서 안정적인 흐름을 유지 중입니다.",
        color: "text-amber-400",
        type: 'HOLD'
    };
};

