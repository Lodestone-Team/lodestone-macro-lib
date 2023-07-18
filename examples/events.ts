import { EventStream } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone-macro-lib/main/events.ts";
import { Instance } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone-macro-lib/main/instance.ts";

const current = await Instance.current()

const eventStream = new EventStream(current.getUUID(), await current.name());

EventStream.emitDetach();

while (true) {
    const {player, message} = await eventStream.nextPlayerMessage();
    console.log(`[${player}] ${message}`);
}