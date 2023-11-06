import { colors } from 'https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts';
import { sleep } from 'https://deno.land/x/sleep@v1.2.1/mod.ts';

import { parseFeed } from 'https://deno.land/x/rss/mod.ts';

import { ConfigFeed } from './lib/interfaces.ts';

const error = colors.bold.red;
const warn = colors.bold.yellow;
const info = colors.bold.blue;
//const magenta = colors.bold.magenta;
//const green = colors.bold.green;

//
// main
//
if (import.meta.main) {
  console.log(import.meta.url);

  //   let text = await Deno.readTextFile('feeds.json');
  //   const x = JSON.parse(text) as ConfigFeed[];
  //   console.log(x);

  const url = 'https://buttondown.email/denonews/rss';
  //const url = 'https://www.digginoakisland.com/feed.xml';

  const response = await fetch(url);
  const xml = await response.text();
  const feed = await parseFeed(xml);

  //console.log(feed);

  //feed.entries.forEach((element) => {
  //  console.log(element);
  //});

  console.log('---------------------------------------');
  console.log(`${feed.title.value} | ${feed.type}`);
  console.log(feed.categories);

  feed.entries.forEach((element) => {
    // console.log(element.title.value);
    console.log(element);
  });

  /*
  const port = 8080;

  const handler = (request: Request): Response => {
    console.log(request);
    const body = `Your user-agent is:\n\n${request.headers.get('user-agent') ?? 'Unknown'}`;

    return new Response(body, { status: 200 });
  };

  console.log(`HTTP server running. Access it at: http://localhost:8080/`);
  Deno.serve({ port }, handler);
  */
}
