import { colors } from 'https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts';

const _error = colors.bold.red;
const _warn = colors.bold.yellow;
const _info = colors.bold.blue;

export const info = (msg: string) => {
  console.log(_info(`[INFO] ${msg}`));
};

export const error = (msg: string) => {
  console.log(_error(msg));
};

export const warn = (msg: string) => {
  console.log(_warn(`[WARN] ${msg}`));
};
