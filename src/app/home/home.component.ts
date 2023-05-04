import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { stateEventEmitter, state, saveState, loadState, updateState } from '../../../app/stores/main';
import { OpenAiChatService } from '../shared/open-ai/open-ai-chat.service';
import { IState } from '../../../app/stores/main.dt';
import { clipboard } from 'electron';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  currentState: IState;
  private ipcRenderer: any;

  constructor(private openAiChat: OpenAiChatService, private changeDetectorRef: ChangeDetectorRef) {
    this.ipcRenderer = window.require('electron').ipcRenderer;
  }

  ngOnInit(): void {
    console.log('HomeComponent INIT');
    this.loadState();
    stateEventEmitter.on('stateChanged', (stateChanged) => {
      this.currentState = stateChanged;
      this.changeDetectorRef.detectChanges();
    });
    window.addEventListener('keydown', (ev) => this.sendShortcut(ev));
  }

  async sendShortcut(event) {
    if (event.key === 'Enter' && event.metaKey) {
      await this.ask();
    }
  }

  ask() {
    return this.openAiChat.ask(this.currentState);
  }

  async updateApiKey(event) {
    const apiKey = event.target.value;
    if (apiKey) { await saveState({ apikey: apiKey }); }
    await this.loadState();
  }

  updateQuery(event) {
    state.query = event.target.value;
  }

  private loadState() {
    loadState(state).then((loadedState) => {
      this.currentState = loadedState;
      loadedState.shortcuts.forEach(shortcut => {
        this.ipcRenderer.on(`shortcut:${shortcut.id}`, this.createShortcutAction(shortcut));
      });
    });
  }


  private createShortcutAction(shortcut) {
    return () => {
      const clipboardText = clipboard.readText()?.toString()?.trim();
      console.log(clipboardText);
      const newState = {
        ...this.currentState,
        query: clipboardText ?? '',
        messages: [
          { role: 'system', content: shortcut.system },
        ]
      } as IState;
      updateState(newState);
      console.log(`Action executed`);
    };
  }

}


