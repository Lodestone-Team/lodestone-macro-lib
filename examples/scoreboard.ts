import { lodestoneVersion } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone-macro-lib/main/prelude.ts";
import { EventStream } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone-macro-lib/main/events.ts";
import { MinecraftJavaInstance } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone-macro-lib/main/instance.ts";


const current = await MinecraftJavaInstance.current();

if (lodestoneVersion() !== "0.5.0-beta.2") {
    throw new Error("This macro requires lodestone version 0.5.0-beta.2");
}

async function nextTick() {
    await new Promise((resolve) => setTimeout(resolve, 50));
}

EventStream.emitDetach();

await current.waitTillRconAvailable();

let count = 0;

while (true) {
    const res = await current.sendRconCommand("scoreboard players get CheatCod3 test");
    // res is "CheatCod3 has 1 [test]"
    const score = parseInt(res.split(" ")[2]);
    if (score > count) {
        count = score;
        await current.sendCommand(`say ${count}`);
    }
    await nextTick();
}