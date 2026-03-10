import { EventSource } from 'eventsource'
import * as app from './app.ts'

const es = new EventSource(`${process.env.BAD_API_URL}/live`, {
    fetch: (input, init) => 
        fetch(input, {
            ...init,
            headers: {
                ...init.headers,
                Authorization: `Bearer ${process.env.API_KEY}`,
            },
        },
    ),
})

es.addEventListener("error", (err) => {
    console.log(err);
});

es.addEventListener('message', (event) => {
    app.onMessage(JSON.parse(event.data));
});