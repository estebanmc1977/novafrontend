// novafrontend/lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        "https://www.novapatch.care/mx",
        "https://www.novapatch.care/mx/tienda",
      ],
      numberOfRuns: 3,
      settings: {
        chromeFlags: "--no-sandbox --headless",
      },
    },
    assert: {
      preset: "lighthouse:no-pwa",
      assertions: {
        "categories:performance": ["warn", { minScore: 0.7 }],
        "categories:accessibility": ["warn", { minScore: 0.8 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 4000 }],
        "first-contentful-paint": ["warn", { maxNumericValue: 3000 }],
        "interactive": ["warn", { maxNumericValue: 5000 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
}
