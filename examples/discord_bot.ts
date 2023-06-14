
import { createBot, Intents } from "https://deno.land/x/discordeno@18.0.1/mod.ts";

import { sendMessage } from "https://deno.land/x/discordeno@18.0.1/mod.ts";

import { detach, nextInstanceConsoleOut } from "/home/peter/dev/backend/src/deno_ops/events/events.ts";

import { getInstanceName } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone_core/dev/src/deno_ops/instance_control/instance_control.ts";

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

detach();

const instanceName = await getInstanceName();

while (true) {
    const msg = await nextInstanceConsoleOut();
    sendMessage(bot, CHANNEL_ID, {
        content: `[${instanceName}] ${msg}`
    });
}