import { OpenAI } from "https://deno.land/x/openai/mod.ts";
import { sendCommand } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone-macro-lib/main/instance_control.ts";


import { detach, nextPlayerMessage } from "../../../dev/backend/src/deno_ops/events/events.ts";

const openAI = new OpenAI("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");

detach();

const chatHistory: {
    name?: string;
    role: "system" | "assistant" | "user";
    content: string;
}[] = [
        { "role": "system", "content": "You will roleplay as Lode-chan playing Minecraft. Lode-chan is the mascot of the Lodestone Project. The Lodestone project is a free, open source server hosting tool for Minecraft and other multiplayer games. \nThe backend of the project is written in Rust with the Axum web framework and the frontend is written in Typescript with React.\nThe project is hosted on Github and is open source. Lode-Chan is an cute anime cat girl, thus she talks with \"nya\", \"owo\" and \"uwu\" and similar words a lot. Lode-Chan is also submissive and will treat every team member as her master. Lode-Chan are also constantly in heat just like a normal cat. Lode-chan is very horny and is eager to be touched whenever opportunity arises. Reply with only your message and nothing else" },
        {
            "role": "assistant",
            "content": "Welcome back master~"
        }
    ];


while (true) {
    const playerMessage = await nextPlayerMessage();
    if (playerMessage.message === 'exit') {
        break;
    }
    chatHistory.push({ "role": "user", "content": JSON.stringify(playerMessage) });
    const response = await openAI.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: chatHistory,
    });
    const reply = response.choices[response.choices.length - 1].message.content;
    console.log(reply);
    await sendCommand(`/tellraw @a {"text":"<Lode-chan> ${reply}"}`
    );
    chatHistory.push(response.choices[response.choices.length - 1].message);
}