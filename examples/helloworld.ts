import { EventStream } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone-macro-lib/main/events.ts";
import { Instance } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone-macro-lib/main/instance.ts";

const current = await Instance.current()

const eventStream = new EventStream(current.getUUID(), await current.name());

console.log("Start macro");

eventStream.emitConsoleOut("Hello world!");

console.log("End macro");