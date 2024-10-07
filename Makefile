
CMDS := zoekt ui

ALL: $(CMDS)

ui:
	yarn install

zoekt:
	mkdir -p bin
	go build -C vendor/zoekt -o $(PWD)/bin ./cmd/...
	export PATH=$(PWD)/bin:$(PATH)
	export CTAGS_COMMANDS=ctags

clean:
	rm -rf \
		bin \
		node_modules \
		packages/web/node_modules \
		packages/web/.next \
		.sourcebot

.PHONY: bin
