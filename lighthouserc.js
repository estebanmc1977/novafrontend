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
      assertions: {
        "categories:performance": ["warn", { minScore: 0.5 }],
        "categories:accessibility": ["warn", { minScore: 0.7 }],
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.25 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 10000 }],
        "first-contentful-paint": ["warn", { maxNumericValue: 5000 }],
        "interactive": ["warn", { maxNumericValue: 12000 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
}
