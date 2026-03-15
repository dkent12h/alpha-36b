import { onRequest as __api_yahoo_html_quote__symbol__js_onRequest } from "C:\\Users\\dkent\\.gemini\\antigravity\\scratch\\alpha-36b\\functions\\api\\yahoo-html\\quote\\[symbol].js"
import { onRequest as __api_yahoo_chart_js_onRequest } from "C:\\Users\\dkent\\.gemini\\antigravity\\scratch\\alpha-36b\\functions\\api\\yahoo-chart.js"
import { onRequest as __api_yahoo_quote_js_onRequest } from "C:\\Users\\dkent\\.gemini\\antigravity\\scratch\\alpha-36b\\functions\\api\\yahoo-quote.js"

export const routes = [
    {
      routePath: "/api/yahoo-html/quote/:symbol",
      mountPath: "/api/yahoo-html/quote",
      method: "",
      middlewares: [],
      modules: [__api_yahoo_html_quote__symbol__js_onRequest],
    },
  {
      routePath: "/api/yahoo-chart",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_yahoo_chart_js_onRequest],
    },
  {
      routePath: "/api/yahoo-quote",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_yahoo_quote_js_onRequest],
    },
  ]