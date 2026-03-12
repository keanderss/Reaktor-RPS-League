import { EventSource } from "eventsource";
import * as app from "./app.ts";

const getMatchHistory = async (): Promise<void> => {
  const decoder = new TextDecoder();
  let path = "/history";
  while (true) {
    console.log(`Fetching batch: ${path}`);
    const res = await fetch(`${process.env.BAD_API_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });

    const reader = res.body?.getReader();

    let jsonString = "";
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        jsonString += decoder.decode(value, { stream: true });
      }
      const { cursor, data } = JSON.parse(jsonString);
      path = cursor;
      if (data && data.length > 0) {
        await app.insertMatchBatch(data);
      }
      if (!cursor) {
        console.log("Processed entire history.");
        break;
      }
    }
  }
};

getMatchHistory();

const es = new EventSource(`${process.env.BAD_API_URL}/live`, {
  fetch: (input, init) =>
    fetch(input, {
      ...init,
      headers: {
        ...init.headers,
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    }),
});

es.addEventListener("error", (err) => {
  console.log(err);
});

es.addEventListener("message", (event) => {
  app.onMessage(JSON.parse(event.data));
});
