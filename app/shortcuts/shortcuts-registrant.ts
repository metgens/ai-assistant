import type { IShortcut } from "../stores/main.dt";
import { state, updateState } from "../stores/main";
import { clipboard, globalShortcut, ipcRenderer } from 'electron';

export const registerKeystroke = async (win, shortcut: IShortcut) => {
    if (globalShortcut.isRegistered(shortcut.keystroke))
        return;
   
    const ret = globalShortcut.register(shortcut.keystroke, () => {
        const shortcutId = `shortcut:${shortcut.id}`;
        win.webContents.send(shortcutId);
        win.show();
        console.log("Sent" + shortcutId);
    }); 

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
