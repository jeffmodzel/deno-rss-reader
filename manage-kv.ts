//
// Example script to use as a starter.
//
import { parseFlags, ParseFlagsOptions } from 'https://deno.land/x/cliffy@v1.0.0-rc.3/flags/mod.ts';
import { ExcludeItem } from './lib/models.ts';
//import { sleep } from 'https://deno.land/x/sleep@v1.2.1/mod.ts';

//
// deno run -A --unstable manage-kv.ts --operation whatevs --kvfile app.kv
//

const parseOptions: ParseFlagsOptions = {
  flags: [{
    name: 'operation',
    type: 'string',
    required: true,
  }, {
    name: 'kvfile',
    type: 'string',
    required: true,
  }],
};

//
// main
//
if (import.meta.main) {
  console.log(import.meta.url);
  const { flags } = parseFlags(Deno.args, parseOptions);
  console.log(flags);

  const kv = await Deno.openKv(flags.kvfile);

  //   const prefs = {
  //     username: 'ada',
  //     theme: 'dark',
  //     language: 'en-US',
  //   };

  //const result = await kv.set(['preferences', 'ada'], prefs);
  //console.log(result);

  //const entry = await kv.get(['preferences', 'ada']);

  const a: ExcludeItem = {
    key: 'a',
    itemId: '111',
    createdOn: 'asdfasd',
  };
  const b: ExcludeItem = {
    key: 'b',
    itemId: '222',
    createdOn: 'sdfgsdfgsdf',
  };

  let result = await kv.set(['exclude', a.key, a.itemId], a);
  result = await kv.set(['exclude', b.key, b.itemId], b);

  const iter = kv.list<ExcludeItem>({ prefix: ['exclude'] });
  for await (const res of iter) {
    console.log(res);
  }
}
