/* eslint-disable @typescript-eslint/no-implied-eval */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
export function scopeEval(scope: any, script: string): any {
  const innerScript = '"use strict";return (' + script + ')';
  return Function(innerScript).bind(scope)();
}
