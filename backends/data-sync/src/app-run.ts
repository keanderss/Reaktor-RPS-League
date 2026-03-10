import { EventSource } from "eventsource";
import * as app from "./app.ts";
import { sleep } from "./utils/sleep.ts";

const getMatchHistory = async () => {
  const decoder = new TextDecoder();
  while (true) {
    const res = await fetch(`${process.env.BAD_API_URL}/history`, {
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
      const { cursor, ...data } = JSON.parse(jsonString);
      await app.onBatchPayload(data.data);
      if (!cursor) break;
    }
    await sleep(30000);
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
