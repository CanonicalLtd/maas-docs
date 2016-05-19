
build:
	tools/mdbuild.py
	cp -R resources _build/
	cp -R media _build/
serve:
	python -m SimpleHTTPServer

plain:
	@if [ -d "_build" ];then rm -rf _build; fi
	tools/mdbuild.py --plain
	@cp -R resources _build/
	@cp -R media _build/
	@cp src/navigation.tpl _build/nav.html

publish: plain      
	cd _build ; git clone https://github.com/maas-docs/maas-docs
	cd _build/maas-docs; git checkout www-1.8 && git rm -rf * && \
cp -R ../en . && cp -R ../media . && cp ../nav.html . && \
git add * && git commit -m 'republish' && git push origin www-1.8

sysdeps:
	sudo apt-get install python-html2text python-markdown python-pip git
	sudo pip install mdx-anchors-away mdx-callouts mdx-foldouts

multi:
	tools/make_versions.sh

clean:
	if [ -d "_build" ];then rm -rf _build; fi

.PHONY: build serve sysdeps multi clean plain publish
