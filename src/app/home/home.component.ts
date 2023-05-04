import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { stateEventEmitter, state, saveState, loadState } from '../../../app/stores/main'
import { OpenAiChatService } from '../shared/open-ai/open-ai-chat.service';
import { registerKeystroke } from '../../../app/shortcuts/shortcuts';
import { IState } from '../core/services/electron/stores/main.dt';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  currentState: IState;

  constructor(private openAiChat: OpenAiChatService) { }

  ngOnInit(): void {
    console.log('HomeComponent INIT');
    this.loadState();
    stateEventEmitter.on('stateChanged', (state) => { this.currentState = state });
    window.addEventListener('keydown', (ev) => this.sendShortcut(ev));
  }

  async sendShortcut(event) {
    if (event.key === 'Enter' && event.metaKey) {
      await this.ask();
    }
  }

  private loadState() {
    loadState(state).then((state) => {
      this.currentState = state;
      state.shortcuts.forEach(shortcut => {
        registerKeystroke(state, shortcut);
      });
    });
  }

  public ask() {
    return this.openAiChat.ask(this.currentState);
  }

  public async updateApiKey(event) {
    const apiKey = event.target.value;
    if (apiKey)
      await saveState({ apikey: apiKey });
    await this.loadState();
  }

  public updateQuery(event) {
    state.query = event.target.value;
  }
}


