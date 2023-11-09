import { serveFile } from 'https://deno.land/std@0.202.0/http/file_server.ts';
import { parseFeed } from 'https://deno.land/x/rss/mod.ts';

import { ConfigFeed, DisplayFeed } from './lib/interfaces.ts';
import { getItemsHtml, getTitleHtml, loadFeeds } from './lib/functions.ts';
import { error, info, warn } from './lib/console.ts';

// const response = await fetch('https://thenewstack.io/blog/feed/');
// const xml = await response.text();
// const feed = await parseFeed(xml);

// const d: DisplayFeed = {
//   title: feed.title.value,
//   type: feed.type as string,
// };

const RUN_SERVER = true;

//
// main
//
if (import.meta.main) {
  console.log(import.meta.url);

  //
  // Load feeds
  //
  const text = await Deno.readTextFile('feeds.json');
  const configFeeds = JSON.parse(text) as ConfigFeed[];
  //console.log(configFeeds);
  const displayFeeds = await loadFeeds(configFeeds);
  console.log(displayFeeds);

  //
  // Web server
  //
  const port = 8080;
  // const BOOK_ROUTE = new URLPattern({ pathname: '/books/:id' });
  // const MESSAGES_ROUTE = new URLPattern({ pathname: '/messages' });
  const TITLE_ROUTE = new URLPattern({ pathname: '/title/:id' });
  const ITEMS_ROUTE = new URLPattern({ pathname: '/items/:id' });

  const handler = async (request: Request): Promise<Response> => {
    console.log(request);

    const pathname = new URL(request.url).pathname;
    console.log(pathname);

    if (pathname === '/') {
      console.log('server index.html');
      return await serveFile(request, './webroot/index.html');
    }

    if (pathname === '/app.js') {
      info('app.js');
      return await serveFile(request, './webroot/app.js');
    }

    let match = TITLE_ROUTE.exec(request.url);
    if (match) {
      console.log(match);
      return new Response(getTitleHtml(displayFeeds, match.pathname.groups.id as string));
    }

    match = ITEMS_ROUTE.exec(request.url);
    if (match) {
      console.log(match);
      return new Response(getItemsHtml(displayFeeds, match.pathname.groups.id as string));
    }

    const body = `Your user-agent is:\n\n${request.headers.get('user-agent') ?? 'Unknown'}`;
    return new Response(body, { status: 200 });
  };

  if (RUN_SERVER) {
    console.log(`HTTP server running. Access it at: http://localhost:8080/`);
    Deno.serve({ port }, handler);
  } else {
    warn('Web server no t running');
  }
}
