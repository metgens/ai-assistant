import { Injectable } from '@angular/core';
import { ShortcutHandler, isRegistered, register, unregister } from '@tauri-apps/api/globalShortcut';
import { readText } from '@tauri-apps/api/clipboard';
import { IShortcut, IState } from './stores/state.dt';
import { appWindow } from '@tauri-apps/api/window';
import { StateService, defaultSystemPrompt } from './stores/state-service';
import { Router } from '@angular/router';
@Injectable({
    providedIn: 'root'
})
export class ShortcutsService {

    constructor(private stateService: StateService, private router: Router) { }

    public async registerShortcut(currentState: IState, shortcut: IShortcut) {
        const action = await this.createAction(currentState, shortcut);
        this.registerKeystroke(shortcut.keystroke, action);
    }

    public async registerKeystroke(keystroke: string, action: any) {

      const actionWithOpeningApp = async () => {
            console.log(`Action started ${keystroke}`);
            await appWindow.show();
            await appWindow.unminimize();
            await appWindow.setFocus();
            action();
      }

      const alreadyRegistered = await isRegistered(keystroke);
      if (!alreadyRegistered) {
          await register(keystroke, actionWithOpeningApp);
          console.log(`Registered ${keystroke}`);
      }
  }

    public async unregisterShortcut(shortcut: IShortcut) {
        await unregister(shortcut.keystroke);
    }

    public runManualShortcut(currentState: IState, shortcut: IShortcut | null) {

        const updatedState = {
            ...currentState,
            query: '',
            messages: [
                { role: 'system', content: shortcut?.system ?? defaultSystemPrompt },
            ]
        } as IState;
        this.stateService.updateState(updatedState);
        this.router.navigateByUrl('/assistant/' + (shortcut?.name ?? 'assistant'));
    }

    private async createAction(currentState: IState, shortcut: IShortcut) {
        return async () => {

            const updatedState = {
                ...currentState,
                query: '',
                messages: [
                    { role: 'system', content: shortcut.system },
                ]
            } as IState;

            this.router.navigateByUrl('/assistant/' + (shortcut?.name ?? 'assistant'));
            this.stateService.updateState(updatedState);
        };
    }


}
