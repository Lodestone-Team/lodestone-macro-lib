
import { startInstance, instanceExists, stopInstance, killInstance, restartInstance, getInstanceState, getInstancePlayerCount, getInstanceMaxPlayers, getInstancePlayerList, sendRconCommand, getInstanceGame, isRconAvailable, InstanceState, Player, waitTillRconAvailable, getCurrentInstanceUUID, getInstanceName, Game, getInstanceGameVersion, getInstanceDescription, getInstancePort, getInstancePath, setInstanceName, setInstanceDescription, setInstancePort, setInstanceAutoStart, trySendRconCommand } from 'https://raw.githubusercontent.com/Lodestone-Team/lodestone_core/dev/src/deno_ops/instance_control/instance_control.ts';

export class Instance {
    uuid!: string;
    public constructor(uuid: string) {
        if (instanceExists(uuid)) {
            this.uuid = uuid;
        } else {
            throw new Error("Instance does not exist");
        }
    }
    public static async current(): Promise<Instance> {
        return new Instance(getCurrentInstanceUUID()!)
    }
    public async start(block: boolean): Promise<void> {
        await startInstance(block, this.uuid);
    }
    public async stop(block: boolean): Promise<void> {
        await stopInstance(block, this.uuid);
    }
    public async restart(block: boolean): Promise<void> {
        await restartInstance(block, this.uuid);
    }
    public async kill(): Promise<void> {
        await killInstance(this.uuid);
    }
    public async state(): Promise<InstanceState> {
        return await getInstanceState(this.uuid);
    }
    public async isRunning(): Promise<boolean> {
        return (await this.state()) === "Running";
    }
    public async isStopped(): Promise<boolean> {
        return (await this.state()) === "Stopped";
    }
    public async isStarting(): Promise<boolean> {
        return (await this.state()) === "Starting";
    }
    public async isStopping(): Promise<boolean> {
        return (await this.state()) === "Stopping";
    }
    public async playerCount(): Promise<number> {
        return await getInstancePlayerCount(this.uuid);
    }
    public async maxPlayerCount(): Promise<number> {
        return await getInstanceMaxPlayers(this.uuid);
    }
    public async playerList(): Promise<Player[]> {
        return await getInstancePlayerList(this.uuid);
    }
    public async name(): Promise<string> {
        return await getInstanceName(this.uuid);
    }
    public async game(): Promise<Game> {
        return await getInstanceGame(this.uuid);
    }
    public async gameVersion(): Promise<string> {
        return await getInstanceGameVersion(this.uuid);
    }
    public async description(): Promise<string> {
        return await getInstanceDescription(this.uuid);
    }
    public async port(): Promise<number> {
        return await getInstancePort(this.uuid);
    }
    public async path(): Promise<string> {
        return await getInstancePath(this.uuid);
    }
    public async setName(name: string): Promise<void> {
        await setInstanceName(name, this.uuid);
    }
    public async setDescription(description: string): Promise<void> {
        await setInstanceDescription(description, this.uuid);
    }
    public async setInstancePort(port: number): Promise<void> {
        await setInstancePort(port, this.uuid);
    }
    public async setAutoStart(autoStart: boolean): Promise<void> {
        await setInstanceAutoStart(autoStart, this.uuid);
    }

}

export class MinecraftJavaInstance extends Instance {
    private constructor(uuid: string) {
        super(uuid);
    }
    public static override async current(): Promise<MinecraftJavaInstance> {
        return await this.new(getCurrentInstanceUUID()!);
    }

    public static async new(uuid: string): Promise<MinecraftJavaInstance> {
        if (await (await getInstanceGame(uuid)).type !== "MinecraftJava") {
            throw new Error("Current instance is not a MinecraftJava instance");
        }
        return new MinecraftJavaInstance(getCurrentInstanceUUID()!);
    }

    public async waitTillRconAvailable(): Promise<void> {
        await waitTillRconAvailable(this.uuid);
    }

    public async isRconAvailable(): Promise<boolean> {
        return await isRconAvailable(this.uuid);
    }

    public async trySendRconCommand(command: string): Promise<string | null> {
        return await trySendRconCommand(command, this.uuid)
    }

    public async sendRconCommand(command: string): Promise<string> {
        return await sendRconCommand(command, this.uuid);
    }
}
