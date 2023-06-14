import { Rcon } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone-macro-lib/main/rcon.ts"
import { sendCommand } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone-macro-lib/main/instance_control.ts";

export const info = (msg: string) => sendCommand(`tellraw @a ["",{"text":"[i] ","color":"aqua"},{"text":"${msg}"}]`);
export const warn = (msg: string) => sendCommand(`tellraw @a ["",{"text":"[!] ","color":"gold"},{"text":"${msg}"}]`);
export const err = (msg: string) => sendCommand(`tellraw @a ["",{"text":"[!!!] ","color":"red"},{"text":"${msg}"}]`);


export const sleep = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

let RCON: Rcon | null = null;

export async function init() {
    RCON = await Rcon.acquire();
}

export type Vec3 = {
    x: number;
    y: number;
    z: number;
}
export type Vec2 = {
    x: number;
    z: number;
};

export const getPos = async (player: string): Promise<[Vec3, string]> => {
    const posString = await RCON!.send(`data get entity ${player} Pos`);
    const dimension = await getDimension(player);
    // extract the coordinates from the string
    // CheatCod3 has the following entity data: [-98.51983541953149d, 84.0d, -110.08810934723235d]
    const pos = posString.split("[")[1].split("]")[0].split(",");
    return [{
        x: parseFloat(pos[0]),
        y: parseFloat(pos[1]),
        z: parseFloat(pos[2])
    }, dimension]
}

export const getRotation = async (player: string): Promise<Vec2> => {
    const rotString = await RCON!.send(`data get entity ${player} Rotation`);
    // extract the coordinates from the string
    // CheatCod3 has the following entity data: [0.0f, 0.0f]
    const rot = rotString.split("[")[1].split("]")[0].split(",");
    return {
        x: parseFloat(rot[0]),
        z: parseFloat(rot[1])
    }
}

export const getDimension = async (player: string): Promise<string> => {
    const dimString = await RCON!.send(`data get entity ${player} Dimension`);
    // extract the dimension from the string
    // CheatCod3 has the following entity data: minecraft:overworld
    const dimension = dimString.split(" ")[dimString.split(" ").length - 1].replace(/"/g, "")
    return dimension
}

export const swapPlayers = async (player1: string, player2: string) => {
    const [pos1, dim1] = await getPos(player1);
    const [pos2, dim2] = await getPos(player2);
    await RCON!.send(`execute in ${dim1} run tp ${player1} ${pos2.x} ${pos2.y} ${pos2.z}`);
    await RCON!.send(`execute in ${dim2} run tp ${player2} ${pos1.x} ${pos1.y} ${pos1.z}`);
}

export async function getPlayers(): Promise<Array<string>> {
    const players = await RCON!.send("list");
    return players.split(": ")[1].split(", ");
}
