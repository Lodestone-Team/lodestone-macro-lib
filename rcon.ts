import { getInstanceGame, isRconAvailable, sendRconCommand, waitTillRconAvailable } from "./instance_control.ts";

export type RconAcquisitionError = "Unsupported" | "Unavailable" | "Unknown";

/**
 * A class that represents a Rcon connection to a Minecraft Java instance.
 * 
 * This class is a ZST (Zero-Sized-Type), meaning that it has no fields and is only used for type checking and to prove, to some degree, that the Rcon connection is valid.
 */
export class Rcon {
    private constructor() { }
    /**
     * Attempts to acquire a Rcon connection.
     * 
     * @throws RconAcquisitionError if the Rcon connection could not be acquired.
     * 
     * Some reasons for this error include:
     * 
     * - Rcon connection is not available.
     * 
     * - The instance is not a Minecraft Java instance.
     * 
     * - The instance did not have rcon enabled in its server.properties file.
     * 
     * @returns A Rcon instance if successful.
     * 
     */
    static async tryAcquire(): Promise<Rcon> {
        const game = await getInstanceGame();
        if (game.type !== "MinecraftJava") {
            throw "Unsupported";
        }
        if (await isRconAvailable()) {
            return new Rcon();
        } else {
            throw "Unavailable";
        }
    }

    /**
     * Acquires a Rcon instance, the promise will resolve when rcon is available.
     * 
     * @throws RconAcquisitionError if the underlying instance does not support rcon.
     * 
     * Note: This function will resolve only when rcon is available via busy polling.
     */
    static async acquire(): Promise<Rcon> {
        const game = await getInstanceGame();
        if (game.type !== "MinecraftJava") {
            throw "Unsupported";
        }
        await waitTillRconAvailable();
        return new Rcon();
    }


    async isOpen(): Promise<boolean> {
        return await isRconAvailable();
    }
    async send(command: string): Promise<string> {
        return await sendRconCommand(command);
    }
}

