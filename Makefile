.PHONY: install
install:
	cd desktopexporter; npm install

.PHONY: build-go
build-go:
	go build

.PHONY: test-go
test-go:
	go test ./...
	
.PHONY: run-go
run-go:
	SERVE_FROM_FS=true go run ./...

.PHONY: build-js
build-js:
	cd desktopexporter; npx esbuild --bundle app/main.tsx app/main.css --outdir=static

.PHONY: watch-js
watch-js:
	cd desktopexporter; npx esbuild --watch --bundle app/main.tsx app/main.css --outdir=static

.PHONY: format-js
format-js:
	cd desktopexporter; npx prettier -w app

# esbuild will compile typescript files but will not typecheck them. This runs the
# typescript typechecker but does not build the files.
.PHONY: validate-typescript
validate-typescript:
	cd desktopexporter; npx tsc --noEmit

IMAGE_NAME=codeboten/collector-with-viewer
OCB=ocb
.PHONY: build-collector
build-collector:
# TODO: install OpenTelemetry Collector Builder
	GOOS=linux GOARCH=amd64 $(OCB) --config ./distribution/manifest.yaml --output-path ./distribution/linux/arm64
	GOOS=linux GOARCH=arm64 $(OCB) --config ./distribution/manifest.yaml --output-path ./distribution/linux/arm64
	docker rmi -f ${IMAGE_NAME}:latest
	docker buildx build -t ${IMAGE_NAME}:latest --platform=linux/arm64,linux/amd64 distribution/. --push
