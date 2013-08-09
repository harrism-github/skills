#!/bin/bash
echo "Start Coverage Report"
echo "[JSCoverage] Instrumenting Code (exclude node_modules)"
jscoverage --no-instrument=node_modules --no-instrument=test ./ ../instrumented-code/
echo "[Mocha] Generating Coverage Report"
mocha --compilers coffee:coffee-script ../instrumented-code/test/server -R html-cov > test/report.html
echo "[Bash] Removing Instrumented Code"
rm -rf ../instrumented-code/
echo "End Coverage Report"