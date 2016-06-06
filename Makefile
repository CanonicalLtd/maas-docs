build:
	tools/mdbuild.py

clean:
	find . -name '*.bak' -exec rm -f {} +
	find . -name '*~' -exec rm -f {} +
	rm -rf htmldocs/en

serve:
	tools/serve.py htmldocs 8000

todo:
	tools/mdbuild.py --todo
sysdeps:
	sudo apt-get install python-html2text python3-markdown python3-pip git spell ispell ibritish python3-setuptools
	sudo pip3 install mdx-anchors-away mdx-callouts mdx-foldouts

multi:
	tools/make_versions.sh

spell:
	spell -b `find src/en -name "*.md" | grep -v commands.md` | sort | uniq

spell-commands:
	spell -b src/en/commands.md | sort | uniq

.PHONY: build clean multi serve spell spell-commands sysdeps
