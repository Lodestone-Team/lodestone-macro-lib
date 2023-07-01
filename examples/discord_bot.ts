
import { createBot, Intents } from "https://deno.land/x/discordeno@18.0.1/mod.ts";

import { sendMessage } from "https://deno.land/x/discordeno@18.0.1/mod.ts";

import { EventStream } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone-macro-lib/main/events.ts";

import { lodestoneVersion } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone-macro-lib/main/prelude.ts";
import { Instance } from "../instance.ts";

if (lodestoneVersion() !== "0.5.0-beta.2") {
    throw new Error("This macro requires lodestone version 0.5.0-beta.2");
}

const current = await Instance.current();
const eventStream = new EventStream(current.getUUID(), await current.name());
const instanceName = await current.name();

const TOKEN = '';
const CHANNEL_ID = '';

const bot = createBot({
    token: TOKEN,
    intents: Intents.Guilds | Intents.GuildMessages,
    events: {
        ready() {
            console.log("Successfully connected to gateway");
        },
    },
});

console.log("bot created")

EventStream.emitDetach();


while (true) {
    const msg = await eventStream.nextConsoleOut();
    sendMessage(bot, CHANNEL_ID, {
        content: `[${instanceName}] ${msg}`
    });
}