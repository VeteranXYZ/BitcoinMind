import routes from '../src/data/routes.json' with { type: 'json' };
import site from '../src/data/site.json' with { type: 'json' };

const host = new URL(site.url).host;
const key = 'd8d5739722e747404381ac0d549d2cf58514f5a3eb75fbb3ba235dde82a0f8b5';
const keyLocation = `${site.url}/${key}.txt`;
const urlList = routes.map(({ path }) => new URL(path, site.url).toString());

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation, urlList }),
});

if (!response.ok) {
  throw new Error(`IndexNow submission failed: ${response.status} ${await response.text()}`);
}

console.log(`IndexNow accepted ${urlList.length} URLs for ${host}.`);
