#!/bin/sh

cat class.element.js class.army.js class.armycalc.js > armycalc.js

yui-compressor armycalc.js -o armycalc.min.js

#rm armycalc.js

