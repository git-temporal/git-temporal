#!/bin/sh

find . \
-regex '.*.md$' \
-not -regex '.*node_modules.*' \
-not -regex '.*packages/git-temporal-vscode/README.md$' \
| xargs npx doctoc