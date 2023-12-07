import { serveFile } from 'https://deno.land/std@0.202.0/http/file_server.ts';
import { ConfigFeed, DisplayFeed, ExcludeItem } from './lib/interfaces.ts';
import { getItemsHtml, getTitleHtml, loadFeeds, removeExcludeItems, removeItem } from './lib/functions.ts';
import { error, info, warn } from './lib/console.ts';

const RUN_SERVER = true;

//
// main
//
if (import.meta.main) {
  console.log(import.meta.url);

  //
  // Load feeds
  //
  let text = await Deno.readTextFile('feeds.json');
  const configFeeds = JSON.parse(text) as ConfigFeed[];
  //console.log(configFeeds);
  let displayFeeds = await loadFeeds(configFeeds);
  console.log(displayFeeds);

  text = await Deno.readTextFile('excludes.json');
  let excludeItems = JSON.parse(text) as ExcludeItem[];
  displayFeeds = removeExcludeItems(displayFeeds, excludeItems);

  const x = displayFeeds.find((x) => x.key === 'AWS_DEVELOPER');
  console.log(x);

  //
  // Web server
  //
  const port = 8080;
  const TITLE_ROUTE = new URLPattern({ pathname: '/title/:id' });
  const ITEMS_ROUTE = new URLPattern({ pathname: '/items/:id' });

  const handler = async (request: Request): Promise<Response> => {
    const pathname = new URL(request.url).pathname;
    info(`Request: ${pathname}`);
    console.log(request);

    if (pathname === '/') {
      console.log('server index.html');
      return await serveFile(request, './webroot/index.html');
    }

    if (pathname === '/app.js') {
      info('app.js');
      return await serveFile(request, './webroot/app.js');
    }

    if (pathname === '/removeItem') {
      const formdata = await request.formData();
      excludeItems = removeItem(excludeItems, formdata);
      //console.log(excludeItems);
      Deno.writeTextFile('excludes.json', JSON.stringify(excludeItems, null, 2));
      info(`New exclude list count: ${excludeItems.length}`);
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
    warn('Web server not running');
  }
}
