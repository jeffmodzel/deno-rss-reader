import { parseFeed } from 'https://deno.land/x/rss/mod.ts';

//
// main deno -A dump-feed.ts
//
if (import.meta.main) {
  console.log(import.meta.url);

  //   let text = await Deno.readTextFile('feeds.json');
  //   const x = JSON.parse(text) as ConfigFeed[];
  //   console.log(x);

  //const url = 'https://buttondown.email/denonews/rss';
  //const url = 'https://www.digginoakisland.com/feed.xml';
  const url = 'https://www.yahoo.com/news/rss';

  const response = await fetch(url);
  const xml = await response.text();
  const feed = await parseFeed(xml);

  console.log(feed);

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
