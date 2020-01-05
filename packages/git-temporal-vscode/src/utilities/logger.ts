import { createProxies } from '@git-temporal/logger';

export const { error, warn, log, debug } = createProxies('git-temporal-vscode');
