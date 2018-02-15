Xdockerpath = phpdocker

ifneq ("$(wildcard docker)","")
	Xdockerpath = docker
endif

default:
	@echo "No default action."

watch:
	cd ./skin/frontend/kapten/default && gulp watch

watchlive:
	cd ./skin/frontend/kapten/default && gulp watch --livereload

css:
	cd ./skin/frontend/kapten/default && gulp css

js:
	cd ./skin/frontend/kapten/default && gulp js

images:
	cd ./skin/frontend/kapten/default && gulp images

cssprod:
	cd ./skin/frontend/kapten/default && gulp css --production

jsprod:
	cd ./skin/frontend/kapten/default && gulp js --production

imagesprod:
	cd ./skin/frontend/kapten/default && gulp images --production

gulp:
	cd ./skin/frontend/kapten/default && gulp

gulpprod:
	cd ./skin/frontend/kapten/default && gulp --production

