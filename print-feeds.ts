import { colors } from 'https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts';
import { sleep } from 'https://deno.land/x/sleep@v1.2.1/mod.ts';

import { parseFeed } from 'https://deno.land/x/rss/mod.ts';

import { ConfigFeed } from './lib/interfaces.ts';

const error = colors.bold.red;
const warn = colors.bold.yellow;
const info = colors.bold.blue;
//const magenta = colors.bold.magenta;
//const green = colors.bold.green;

const printFeed = async (config: ConfigFeed) => {
  //console.log(feed);
  console.log(`${info('URL:')} ${config.url}`);

  const response = await fetch(config.url);
  const xml = await response.text();
  const feed = await parseFeed(xml);

  console.log(`${info(feed.title.value)} | ${info(feed.type)}`);

  feed.entries.forEach((entry) => {
    console.log(warn(entry.title.value));
    if (entry.links && entry.links.length > 0) {
      console.log(entry.links[0].href);
    }
    console.log(entry.published);
  });
};

//
// main
//
if (import.meta.main) {
  console.log(import.meta.url);

  const text = await Deno.readTextFile('feeds.json');
  const feeds = JSON.parse(text) as ConfigFeed[];
  //console.log(feeds);

  for (const feed of feeds) {
    if (feed.enabled) {
      console.log('-----------------------------------------------------------------');
      await printFeed(feed);
    }
  }

  // const url = 'https://buttondown.email/denonews/rss';
  //const url = 'https://www.digginoakisland.com/feed.xml';

  //   const response = await fetch(url);
  //   const xml = await response.text();
  //   const feed = await parseFeed(xml);

  //console.log(feed);

  //feed.entries.forEach((element) => {
  //  console.log(element);
  //});

  //   console.log('---------------------------------------');
  //   console.log(`${feed.title.value} | ${feed.type}`);
  //   console.log(feed.categories);

  //   feed.entries.forEach((element) => {
  //     // console.log(element.title.value);
  //     console.log(element);
  //   });
}
