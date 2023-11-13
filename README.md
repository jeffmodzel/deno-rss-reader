# deno-rss-reader
RSS reader based with Deno



https://deno.land/x/rss@1.0.0/mod.ts


https://jiripik.com/2021/09/02/list-of-all-amazon-aws-rss-feeds/


news feeds
https://gist.github.com/stungeye/fe88fc810651174d0d180a95d79a8d97




https://www.w3schools.com/w3css/w3css_layout.asp
https://www.w3schools.com/w3css/w3css_color_flat.asp


https://www.cnbc.com/rss-feeds/

# htmx links

https://htmx.org/docs/#introduction
https://hypermedia.systems/book/contents/

# TODO list

add date to feed title
add links to everything
figure out collapsible

add limit filter (for too many entries)





<script defer>
    document.addEventListener('htmx:configRequest', function (evt) {
      console.log({ configRequest: evt.detail });
      const redirect = 'https://otherdomain';
      evt.detail.path = `${redirect}${evt.detail.path}`;
    });
  </script>

  <button hx-get="/htmx" hx-swap="outerHTML">
    Click Me
  </button>