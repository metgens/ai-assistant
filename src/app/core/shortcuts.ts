import { Injectable } from '@angular/core';
import { isRegistered, register, unregister } from '@tauri-apps/api/globalShortcut';
import { readText } from '@tauri-apps/api/clipboard';
import { IShortcut, IState } from './stores/state.dt';
import { appWindow } from '@tauri-apps/api/window';
import { StateService } from './stores/state-service';

@Injectable({
    providedIn: 'root'
})
export class ShortcutsService {

    constructor(private stateService: StateService) { }

    public async registerKeystroke(currentState: IState, shortcut: IShortcut) {
        const action = await this.createAction(currentState, shortcut);
        const alreadyRegistered = await isRegistered(shortcut.keystroke);
        if (!alreadyRegistered) {
            await register(shortcut.keystroke, action);
            console.log(`Registered ${shortcut.keystroke}`);
        }
    }

    public async unregisterKeystroke(shortcut: IShortcut) {
        await unregister(shortcut.keystroke);
    }

    private async createAction(currentState: IState, shortcut: IShortcut) {
        return async () => {
            console.log(`Action started ${shortcut.name}`);
            appWindow.show();
            appWindow.setFocus();

            const clipboardText = (await readText())?.toString()?.trim();
            const updatedState = {
                ...currentState,
                query: clipboardText ?? '',
                messages: [
                    { role: 'system', content: shortcut.system },
                ]
            } as IState;

            this.stateService.updateState(updatedState);
        };
    }

}