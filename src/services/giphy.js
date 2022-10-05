// API Key: PN02ITADjn1ry8YZDRMaG1no4h8emWiT

import { GiphyFetch } from "@giphy/js-fetch-api";

// use @giphy/js-fetch-api to fetch gifs, instantiate with your api key
const gf = new GiphyFetch("PN02ITADjn1ry8YZDRMaG1no4h8emWiT");

// configure your fetch: fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)
export const fetchTrending = async () => {
  const gifs = await gf.trending({ limit: 20 });

  return gifs;
};

// Render the React Component and pass it your fetchGifs as a prop
