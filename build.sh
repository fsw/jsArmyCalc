#!/bin/sh

FILES="helpers.js class.ruleset.js class.instance.js class.armycalc.js"

cat $FILES > armycalc.js

yui-compressor armycalc.js -o armycalc.min.js

#rm armycalc.js

