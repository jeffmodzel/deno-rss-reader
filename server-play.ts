import { serveFile } from 'https://deno.land/std@0.202.0/http/file_server.ts';
import { parseFeed } from 'https://deno.land/x/rss/mod.ts';

import { DisplayFeed } from './lib/interfaces.ts';

const response = await fetch('https://thenewstack.io/blog/feed/');
const xml = await response.text();
const feed = await parseFeed(xml);

const d: DisplayFeed = {
  title: feed.title.value,
  type: feed.type as string,
};

//
// main
//
if (import.meta.main) {
  console.log(import.meta.url);

  const port = 8080;

  const BOOK_ROUTE = new URLPattern({ pathname: '/books/:id' });
  const MESSAGES_ROUTE = new URLPattern({ pathname: '/messages' });
  const TITLE_ROUTE = new URLPattern({ pathname: '/title/:id' });

  const handler = (request: Request): Response => {
    console.log(request);

    const pathname = new URL(request.url).pathname;
    console.log(pathname);

    if (pathname === '/') {
      console.log('server index.html');
      return serveFile(request, './webroot/index.html');
    }

    let match = BOOK_ROUTE.exec(request.url);
    if (match) {
      const id = match.pathname.groups.id;
      return new Response(`Book ${id}`);
    }

    match = MESSAGES_ROUTE.exec(request.url);
    if (match) {
      return new Response('<div><h3>a message here</h3></div>');
    }

    match = TITLE_ROUTE.exec(request.url);
    if (match) {
      console.log(match);
      return new Response(`<div><h3>${feed.title.value} | ${feed.type}</h3></div>`);
    }

    const body = `Your user-agent is:\n\n${request.headers.get('user-agent') ?? 'Unknown'}`;

    return new Response(body, { status: 200 });
  };

  console.log(`HTTP server running. Access it at: http://localhost:8080/`);
  Deno.serve({ port }, handler);
}
