import { format } from "https://deno.land/std@0.177.1/datetime/format.ts";
import { copy } from "https://deno.land/std@0.191.0/fs/copy.ts";
import { sleep } from "https://deno.land/x/sleep@v1.2.1/mod.ts";
import { detach, emitConsoleOut } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone_core/dev/src/deno_ops/events/events.ts";
import { getInstancePath, getInstanceState } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone_core/dev/src/deno_ops/instance_control/instance_control.ts";

const delaySec = 60 * 60;

const instancePath = await getInstancePath();
const backupFolder = `${instancePath}/backups`;
detach();
while (true) {
    emitConsoleOut("[Backup Macro] Backing up world...");
    if (await getInstanceState() == "Stopped") {
        emitConsoleOut("[Backup Macro] Instance stopped, exiting...");
        break;
    }

    const now = new Date();
    const now_str = format(now, "yy-MM-dd_HH");
    try {
        await copy(`${instancePath}/world`, `${backupFolder}/backup_${now_str}`);
    } catch (e) {
        console.log(e)
    }

    await sleep(delaySec);
}