PREFIX = .

SRC_DIR = ${PREFIX}/src
CSS_DIR = ${PREFIX}/css
TESTS_DIR = ${PREFIX}/tests
OUT_DIR = ${PREFIX}/web

JS_ENGINE ?= `which node nodejs 2>/dev/null`
COMPRESSOR ?= `which yui-compressor 2>/dev/null`

JS_FILES = ${SRC_DIR}/armycalc.js\
	${SRC_DIR}/jquery.js\
	${SRC_DIR}/instance.js\
	${SRC_DIR}/template.js\
	${SRC_DIR}/element.template.js\
	${SRC_DIR}/group.template.js\
	${SRC_DIR}/twrreader.js\
	${SRC_DIR}/printer.js\
	${SRC_DIR}/sandbox.js

CSS_FILES = ${CSS_DIR}/style.css\
	${CSS_DIR}/unitslist.css\
	${CSS_DIR}/validation.css\
	${CSS_DIR}/submenu.css

	
TEST_FILES = ${TESTS_DIR}/twrreader.js

AC = ${OUT_DIR}/armycalc.js
AC_CSS = ${OUT_DIR}/armycalc.css
AC_MIN = ${OUT_DIR}/armycalc.min.js
AC_CSS_MIN = ${OUT_DIR}/armycalc.min.css


VERSION ?= `git describe --abbrev=0`





all: ${AC_MIN} ${AC_CSS_MIN} version

version:
	@@echo ${VERSION} > ${OUT_DIR}/VERSION;

${AC}: ${JS_FILES}
	@@echo "Building" ${AC}
	@@cat ${JS_FILES} > ${AC};


${AC_MIN}: ${AC}
	@@if test ! -z ${COMPRESSOR}; then \
		echo "Minifying jsArmyCalc" ${AC_MIN}; \
		${COMPRESSOR} ${AC} -o ${AC_MIN}; \
	else \
		echo "You must have yui-compressor installed in order to minify jsArmyCalc."; \
	fi
	
	
${AC_CSS}: ${CSS_FILES}
	@@echo "Building" ${AC_CSS}
	@@cat ${CSS_FILES} > ${AC_CSS};


${AC_CSS_MIN}: ${AC_CSS}
	@@if test ! -z ${COMPRESSOR}; then \
		echo "Minifying jsArmyCalc" ${AC_CSS_MIN}; \
		${COMPRESSOR} ${AC_CSS} -o ${AC_CSS_MIN}; \
	else \
		echo "You must have yui-compressor installed in order to minify jsArmyCalc."; \
	fi
	
	
test: ${TESTS_DIR}
	@@echo "Testing"
	
doc:
	@@echo "TODO"
	
clean:
	@@echo "Cleaning up"
	@@rm ${AC}
	
