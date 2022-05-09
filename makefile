build-participants:
	rm -rf node_modules
	yarn install --frozen-lockfile
	yarn run build
	rm -rf node_modules
	yarn install --frozen-lockfile --production
	cp -r node_modules "$(ARTIFACTS_DIR)"
	cp -r dist "$(ARTIFACTS_DIR)"
	cp -r package.json "$(ARTIFACTS_DIR)"