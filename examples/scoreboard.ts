import { sendCommand } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone-macro-lib/main/instance_control.ts";
import { Rcon } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone-macro-lib/main/rcon.ts";
import { detach } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone-macro-lib/main/events.ts";

async function nextTick() {
    await new Promise((resolve) => setTimeout(resolve, 50));
}

detach();

let count = 0;

await sendCommand("scoreboard objectives add test minecraft.used:minecraft.grass_block \"test\"");

const rcon = await Rcon.waitForAcquisition();
while (true) {
    const res = await rcon.send("scoreboard players get CheatCod3 test");
    // res is "CheatCod3 has 1 [test]"
    const score = parseInt(res.split(" ")[2]);
    if (score > count) {
        count = score;
        await sendCommand(`say ${count}`);
    }
    await nextTick();
}