/**
 * Alpha 3.6B Strategy Engine (Korean Ver.)
 */

export const getStrategyFeedback = (price, ma20, rsi14, strategyType = 'CORE') => {
    // Convert inputs
    const p = parseFloat(price);
    const m = parseFloat(ma20);
    const r = parseFloat(rsi14);

    if (isNaN(p) || isNaN(m) || isNaN(r)) {
        return {
            action: "로딩 중...",
            reason: "데이터를 불러오는 중입니다...",
            color: "text-slate-500",
            type: 'LOADING'
        };
    }

    const disparity = ((p - m) / m) * 100;

    // ---------------------------------------------------------
    // 1. SELL (Harvest) - 공통 규칙
    // RSI 70 이상은 과열 구간 -> 매수 금지 및 분할 익절
    // ---------------------------------------------------------
    if (r >= 70) {
        return {
            action: "매도 (익절)",
            reason: `RSI ${r.toFixed(1)} (과열). 분할 매도로 수익을 챙기세요.`,
            color: "text-red-500 font-bold",
            type: 'SELL'
        };
    }

    // ---------------------------------------------------------
    // 2. WAIT (Danger Zone) - 공통 규칙
    // 20일선 아래는 하락 추세 -> 관망
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
    // 3. BUY STRATEGIES (Conditional)
    // ---------------------------------------------------------

    // Strategy 2: 눌림목 (CORE, SAFE, INCOME)
    // 안정적 종목은 20일선 근처에서 매수
    if (strategyType === 'CORE' || strategyType === 'SAFE' || strategyType === 'INCOME') {
        // 이격도 0 ~ 3% 이내 & RSI 60 미만 (과열 아님)
        if (disparity >= 0 && disparity <= 3.5 && r < 60) {
            return {
                action: "매수 (눌림목)",
                reason: `20일선 지지 (이격 +${disparity.toFixed(1)}%). 분할 매수 적기입니다.`,
                color: "text-emerald-400 font-bold",
                type: 'BUY'
            };
        }
    }

    // Strategy 1: 돌파 (ALPHA)
    // 성장주는 추세가 강할 때 불타기
    if (strategyType === 'ALPHA') {
        // RSI 60~70 사이 (상승 모멘텀 강함)
        if (r >= 60 && r < 70) {
            return {
                action: "매수 (돌파)",
                reason: `강한 상승 추세 (RSI ${r.toFixed(1)}). 전고점 돌파 시 추가 매수.`,
                color: "text-blue-400 font-bold",
                type: 'BUY'
            };
        }
        // Alpha 종목이라도 20일선 근처면 매수 기회 (Top-up)
        if (disparity >= 0 && disparity <= 4.0 && r < 60) {
            return {
                action: "매수 (지지)",
                reason: `추세선 지지 확인 (이격 +${disparity.toFixed(1)}%).`,
                color: "text-emerald-400 font-bold",
                type: 'BUY'
            };
        }
    }

    // ---------------------------------------------------------
    // 4. HOLD (보유)
    // ---------------------------------------------------------
    return {
        action: "홀딩 (지속)",
        reason: "20일선 위에서 안정적인 흐름을 유지 중입니다.",
        color: "text-amber-400",
        type: 'HOLD'
    };
};
