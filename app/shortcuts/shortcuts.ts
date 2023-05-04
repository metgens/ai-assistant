import type { IShortcut } from "../stores/main.dt";
import { state, updateState } from "../stores/main";
import { clipboard, globalShortcut } from 'electron';

const createAction = async (currentState, shortcut) => {
    return () => {
        console.log(`Action executed`);
        const clipboardText = clipboard.readText()?.toString()?.trim();
        const updatedState = {
            ...currentState,
            query: clipboardText ?? '',
            messages: [
                { role: 'system', content: shortcut.system },
            ]
        }
        updateState(updatedState);
    }
}

export const registerKeystroke = async (currentState, shortcut: IShortcut) => {
    if (globalShortcut.isRegistered(shortcut.keystroke))
        return;

    const action = await createAction(currentState, shortcut);
    const ret = globalShortcut.register(shortcut.keystroke, action)

    if (!ret) {
        console.log(`${shortcut.keystroke} registration failed`)
    }

    // Check whether a shortcut is registered.
    console.log(`${shortcut.keystroke} registration result: ${globalShortcut.isRegistered(shortcut.keystroke)}`)
}

export const unregisterKeystroke = async (shortcut: IShortcut) => {
    globalShortcut.unregister(shortcut.keystroke);
}

export const unregisterAll = () => {
    globalShortcut.unregisterAll();
}
