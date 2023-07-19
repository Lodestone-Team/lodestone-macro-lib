
import { ProgressionEventID } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone/dev/core/deno_bindings/ProgressionEventID.ts";
import * as EventOps from "https://raw.githubusercontent.com/Lodestone-Team/lodestone/dev/core/src/deno_ops/events/events.ts"
import { getCurrentTaskPid } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone/dev/core/src/deno_ops/prelude/prelude.ts";

/**
 * A class to handle the life cycle of a progression event.
 * 
 * A progression event is a special type of event that is displayed in the notification area of the dashboard.
 * 
 * It consists of a title, a progress bar, and a progress message.
 * 
 * The progress bar is updated by calling the `addProgress` or `setProgress` methods, and completed by calling the `complete` method.
 * 
 * Note that it is very important to call the `complete` method for every progression event created. Failure to do so will result in the event being stuck in the dashboard.
 * 
 * It is ok if your elapsed progress is greater than the total progress or less than the total progress, as long as the `complete` method is called. Dashboard will automatically adjust the progress bar to 100%.
 * 
 * # Warning
 * Please do NOT update the progression event too frequently. The dashboard can only handle a limited number of events per second. The dashboard may experience performance issues if you update the progression event too frequently.
 */
export class ProgressionHandler {
    private progression_event_id: ProgressionEventID;
    // hard coded value in backend
    private _elapsedProgress = 0;
    public readonly TOTAL_PROGRESS: number | null;
    private constructor(progression_event_id: ProgressionEventID, total_progress: number) {
        this.progression_event_id = progression_event_id;
        this.TOTAL_PROGRESS = total_progress;
    }
    /**
     * Creates a progression event.
     * 
     * @param title The title of the progression event.
     * @param total_progress The total progress of the progression event. If null, the notification will not have a progress bar.
    */
    public static create(title: string, total_progress: number | null): ProgressionHandler {
        return new ProgressionHandler(EventOps.emitProgressionEventStart(title, total_progress, null), total_progress ?? 100);
    }
    /**
     * Updates the progression event.
     * 
     * Note that it is ok if your elapsed progress is greater than the total progress or less than the total progress, as long as the `complete` method is called. Dashboard will automatically adjust the progress bar to 100%.
     * 
     * @param progress Progress to add to the progression event.
     * @param message The message to display in the progression event. If a function is passed, the function will be called with the elapsed progress and remaining progress as arguments.
     */
    public addProgress(progress: number, message: string | ((elapsed: number, remaining: number | null) => string)) {
        this._elapsedProgress += progress;
        let msg;
        if (typeof message === "string") {
            msg = message;
        }
        else {
            msg = message(this._elapsedProgress, this.remainingProgress());
        }
        EventOps.emitProgressiontEventUpdate(this.progression_event_id, msg, progress);
    }
    /**
     * Set the progression event to a specific progress.
     * 
     * Note that it is ok if your elapsed progress is greater than the total progress or less than the total progress, as long as the `complete` method is called. Dashboard will automatically adjust the progress bar to 100%.
     * 
     * @param progress Progress to set the progression event to.
     * @param message The message to display in the progression event. If a function is passed, the function will be called with the elapsed progress and remaining progress as arguments.
     */
    public setProgress(progress: number, message: string | ((elapsed: number, remaining: number | null) => string)) {
        // calculate the difference between the current progress and the new progress
        const diff = progress - this._elapsedProgress;
        this.addProgress(diff, message);
    }

    /**
     * Gets the remaining progress of the progression event. 
     */
    public remainingProgress(): number | null {
        return this.TOTAL_PROGRESS && (this.TOTAL_PROGRESS - this._elapsedProgress);
    }
    /**
     * Gets the elapsed progress of the progression event.
     */
    public elapsedProgress(): number {
        return this._elapsedProgress;
    }

    /**
     * Completes the progression event.
     * 
     * Note you MUST call this method for every progression event created. Failure to do so will result in the event being stuck in the dashboard.
     */
    public complete(success: boolean, message: string) {
        EventOps.emitProgressionEventEnd(this.progression_event_id, success, message, null);
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