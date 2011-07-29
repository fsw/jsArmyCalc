#!/bin/sh

# This simple script merges all files in src folder into armycalc.js and armycalc.css.
# then it uses yui-compressor to build minified versions

FILES="src/ie.calc.js src/helpers.js src/class.ruleset.js src/class.instance.js src/class.armycalc.js"
CSS_FILES="src/calc.css src/calc.unitslist.css"

cat $FILES > armycalc.js
cat $CSS_FILES > armycalc.css

yui-compressor armycalc.js -o armycalc.min.js
yui-compressor armycalc.css -o armycalc.min.css


