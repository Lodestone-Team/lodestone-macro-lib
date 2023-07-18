
import { ProgressionEventID } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone_core/dev/deno_bindings/ProgressionEventID.ts";
import * as EventOps from "https://raw.githubusercontent.com/Lodestone-Team/lodestone_core/dev/src/deno_ops/events/events.ts"
import { getCurrentTaskPid } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone_core/dev/src/deno_ops/prelude/prelude.ts";

export class ProgressionHandler {
    private progression_event_id: ProgressionEventID;
    // hard coded value in backend
    private total_progress = 100;
    private constructor(progression_event_id: ProgressionEventID) {
        this.progression_event_id = progression_event_id;
    }
    static __private__create(progression_event_id: ProgressionEventID) {
        return new ProgressionHandler(progression_event_id);
    }
    public update(progress: number, message: ProgressionEventID) {
        this.total_progress -= progress;
        EventOps.emitProgressiontEventUpdate(this.progression_event_id, message, progress);
    }
    public leftOverProgress(): number {
        return this.total_progress;
    }
}

export class EventStream {
    instanceUuid: string;
    instanceName: string;
    public constructor(instanceUuid: string, instanceName: string) {
        this.instanceUuid = instanceUuid;
        this.instanceName = instanceName;
    }
    /**
     * Gets the next event in the event stream
     * 
     * Note that the event stream is shared between all instances, so this function will return the next event in the stream, regardless of which instance it is for.
     * 
     * @returns The next event in the event stream.
     */
    public static async next(): Promise<EventOps.ClientEvent> {
        return await EventOps.nextEvent();
    }
    /**  Notifies the caller that the macro wishes to be run in the background.
    * 
    * This is a no-op if the macro is already running in the background, or called multiple times.

    * This function DOES NOT exit the macro.
    */
    public static async emitDetach(): Promise<void> {
        await EventOps.emitDetach(getCurrentTaskPid());
    }
    public async emitStateChange(state: EventOps.InstanceState): Promise<void> {
        await EventOps.emitStateChange(state, this.instanceName, this.instanceUuid);
    }
    public async emitConsoleOut(message: string): Promise<void> {
        await EventOps.emitConsoleOut(message, this.instanceUuid);
    }
    public async nextInstanceEvent(): Promise<EventOps.InstanceEvent> {
        return await EventOps.nextInstanceEvent(this.instanceUuid);
    }
    public async nextStateChange(): Promise<EventOps.InstanceState> {
        return await EventOps.nextInstanceStateChange(this.instanceUuid);
    }
    public async nextConsoleOut(): Promise<string> {
        return await EventOps.nextInstanceConsoleOut(this.instanceUuid);
    }
    public async nextSystemMessage(): Promise<string> {
        return await EventOps.nextInstanceSystemMessage(this.instanceUuid);
    }
    public async nextPlayerMessage(): Promise<EventOps.PlayerMessage> {
        return await EventOps.nextPlayerMessage(this.instanceUuid);
    }
}