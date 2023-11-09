import { serveFile } from 'https://deno.land/std@0.202.0/http/file_server.ts';
import { parseFeed } from 'https://deno.land/x/rss/mod.ts';
import { colors } from 'https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts';
import { ConfigFeed, DisplayFeed } from './interfaces.ts';

const error = colors.bold.red;
const warn = colors.bold.yellow;
const info = colors.bold.blue;

export const loadFeeds = async (configFeeds: ConfigFeed[]): Promise<DisplayFeed[]> => {
  console.log('loadFeeds()');
  console.log(configFeeds);

  const retval: DisplayFeed[] = [];

  for (const config of configFeeds) {
    console.log(config);
    if (config.enabled) {
      try {
        console.log(info(`INFO - Loading ${config.id} | ${config.url}`));
        const response = await fetch(config.url);
        const xml = await response.text();
        const feed = await parseFeed(xml);

        //console.log(feed);

        const d: DisplayFeed = {
          id: config.id,
          title: feed.title.value,
          type: feed.type as string,
          items: [],
        };

        // deno-lint-ignore no-explicit-any
        feed.entries.forEach((entry: any) => {
          d.items.push({
            id: entry.id,
            title: entry.title.value,
            description: entry.description && entry.description.value
              ? entry.description.value as string
              : 'No description available',
          });
        });

        retval.push(d);
      } catch (e) {
        console.log(error('ERROR'));
        console.log(e);
      }
    }
  }

  return retval;
};

export const getTitleHtml = (displayFeeds: DisplayFeed[], id: string): string => {
  const found = displayFeeds.find((d) => d.id === id);

  if (!found) {
    return `
    <div "><h3>ERROR - Missing ${id}</h3></div>
        `;
  }

  return `
  <div onclick="hide('${id}_ITEMS');" class="pointer"><h3>${found.title} | ${found.type}</h3></div>
  `;
};

export const getItemsHtml = (displayFeeds: DisplayFeed[], id: string): string => {
  const found = displayFeeds.find((d) => d.id === id);

  if (!found) {
    return `
      <div><h3>ERROR - Missing ${id}</h3></div>
          `;
  }

  // what happens when entries is 0?

  const html: string[] = [];

  found.items.forEach((item) => {
    html.push(`
    <div>
       <h4 onclick="console.log('test test test');">${item.title}</h4>
       <div class="w3-container w3-hide">${item.description}</div>   
    </div>`);
  });

  return html.join('');
};
