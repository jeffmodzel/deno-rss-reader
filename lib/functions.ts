import { parseFeed } from 'https://deno.land/x/rss/mod.ts';
import { ulid } from 'https://deno.land/x/ulid@v0.3.0/mod.ts';
import { Html5Entities } from 'https://deno.land/x/html_entities@v1.0/mod.js';
import { ConfigFeed, DisplayFeed } from './interfaces.ts';
import { error, info } from './console.ts';

export const loadFeeds = async (configFeeds: ConfigFeed[]): Promise<DisplayFeed[]> => {
  info('loadFeeds()');
  //console.log(configFeeds);

  const retval: DisplayFeed[] = [];

  for (const config of configFeeds) {
    console.log(config);
    if (config.enabled) {
      try {
        info(`Loading ${config.id} | ${config.url}`);
        const response = await fetch(config.url);
        const xml = await response.text();
        const feed = await parseFeed(xml);

        //console.log(feed);
        // Determine published date
        let published = 'UNKNOWN';
        if (feed.published) {
          published = feed.published.toLocaleString();
        } else if (feed.publishedRaw) {
          published = feed.publishedRaw;
        } else if (feed.updateDate) {
          published = feed.updateDate.toLocaleString();
        }

        // Get link
        let link = null;
        if (feed.links && feed.links.length > 0) {
          link = feed.links[0];
        }

        const d: DisplayFeed = {
          id: config.id,
          title: feed.title.value,
          type: feed.type as string,
          published,
          items: [],
          ...(link && { link }),
        };

        // deno-lint-ignore no-explicit-any
        feed.entries.forEach((entry: any) => {
          published = 'UNKNOWN';
          if (entry.published) {
            published = entry.published.toLocaleString();
          } else if (entry.publishedRaw) {
            published = entry.publishedRaw;
          } else if (entry.updateDate) {
            published = entry.updateDate.toLocaleString();
          }

          let description = 'No description available';
          if (entry.description && entry.description.value) {
            const tempDesc = entry.description.value as string;

            if (tempDesc.trim().startsWith('&lt;')) {
              description = Html5Entities.decode(tempDesc);
            } else {
              description = tempDesc;
            }
          }

          let link = null;
          if (entry.links && entry.links.length > 0) {
            if (entry.links[0].href) {
              link = entry.links[0].href;
            }
          }

          d.items.push({
            id: entry.id,
            title: entry.title.value,
            published,
            description,
            ...(link && { link }),
          });
        });

        retval.push(d);
      } catch (e) {
        error('Parsing feeds');
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
    <div><h3>ERROR - Missing ${id}</h3></div>
        `;
  }

  return `
  <div class="w3-display-container">
    <div onclick="hide('${id}_ITEMS');" class="pointer"><h3>${found.title} | ${found.type} | <a href="${found.link}">Link</a></h3></div>
    <div class="w3-display-right"><h3>${found.published}</h3></div>
  </div>
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
    const descriptionHtmlId = "a" + ulid(); // HTML4 ids must start with a letter
    const outerHtmlId = "a" + ulid(); // HTML4 ids must start with a letter

    html.push(`
    <div id="${outerHtmlId}" class="w3-display-container w3-border-bottom w3-hover-blue-gray">
       <div class="w3-display-top-left">
         <div class="w3-cell"><h4 class="pointer" onclick="hide('${descriptionHtmlId}');">${item.title} | <a href="${item.link}">Link</a></h4></div>
         <div class="w3-cell">&nbsp;<button class="w3-button w3-tiny w3-khaki" hx-post="/removeItem" hx-swap="delete" hx-target="#${outerHtmlId}" hx-vals='{"feedKey":"${id}","itemId":"${item.id}"}'>Remove</button></div>
       </div>
       <div id="${descriptionHtmlId}" class="w3-container w3-hide">${item.description}</div>
       <div class="w3-display-topright">${item.published}</div>
    </div>`);
  });

  return html.join('');
};

export const removeItem = (displayFeeds: DisplayFeed[], formData: FormData) => {
  info('removeItem()');
  console.log(formData);

  // for (const pair of formdata.entries()) {
  //   console.log(pair);
  // }

}
