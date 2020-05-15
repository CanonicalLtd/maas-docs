#! /usr/bin/env bash

documentation-builder --template-path template.html --base-directory . --output-path build --output-media-path 'build/media' --media-url '/media' --tag-manager-code 'GTM-K92JCQ' --search-url 'https://maas.io/docs/search' --search-placeholder 'Search MAAS docs' --no-link-extensions --build-version-branches --site-root https://maas.io/
