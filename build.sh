#!/bin/sh

# This simple script merges all files in src folder into armycalc.js and armycalc.css.
# then it uses yui-compressor to build minified versions

JS_FILES="src/ie.calc.js src/helpers.js src/class.sandbox.js src/class.ruleset.js src/class.instance.js src/class.armycalc.js"
CSS_FILES="src/style.css src/style.unitslist.css src/style.validation.css"


echo -n "merging js files..."
cat $JS_FILES > armycalc.js
echo "[OK]"

echo -n "merging css files..."
cat $CSS_FILES > armycalc.css
echo "[OK]"

echo -n "minifying armycalc.js..."
yui-compressor armycalc.js -o armycalc.min.js
echo "[OK]"

echo -n "minifying armycalc.css..."
yui-compressor armycalc.css -o armycalc.min.css
echo "[OK]"


echo "DONE"

