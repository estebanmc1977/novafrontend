#!/bin/bash
# novafrontend/scripts/run-lighthouse.sh
# Usage: bash scripts/run-lighthouse.sh

set -e
echo "Running Lighthouse CI against https://www.novapatch.care"
lhci autorun --config=lighthouserc.js
echo "Lighthouse CI complete. Check output above for pass/fail."
