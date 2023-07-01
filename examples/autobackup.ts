import { format } from "https://deno.land/std@0.177.1/datetime/format.ts";
import { copy } from "https://deno.land/std@0.191.0/fs/copy.ts";
import { sleep } from "https://deno.land/x/sleep@v1.2.1/mod.ts";
import { EventStream } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone-macro-lib/main/events.ts";
import { lodestoneVersion } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone-macro-lib/main/prelude.ts";
import { MinecraftJavaInstance } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone-macro-lib/main/instance.ts";

if (lodestoneVersion() !== "0.5.0-beta.1") {
    throw new Error("This macro requires lodestone version 0.5.0-beta.1");
}

const currentInstance = await MinecraftJavaInstance.current();

const eventStream = new EventStream(currentInstance.getUUID(), await currentInstance.name());

const backupFolderRelative = "backups";

const delaySec = 60 * 60;

const instancePath = await currentInstance.path();
const backupFolder = `${instancePath}/${backupFolderRelative}`;
EventStream.emitDetach();
while (true) {
    eventStream.emitConsoleOut("[Backup Macro] Backing up world...");
    if (await currentInstance.state() == "Stopped") {
        eventStream.emitConsoleOut("[Backup Macro] Instance stopped, exiting...");
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

