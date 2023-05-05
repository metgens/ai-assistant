import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { OpenAiChatService } from '../shared/open-ai/open-ai-chat.service';
import { IShortcut, IState } from '../core/stores/state.dt';
import { StateService } from '../core/stores/state-service';
import { ShortcutsService } from '../core/shortcuts';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {

  currentState: IState | null = null;

  constructor(private stateService: StateService, private shortcutsService: ShortcutsService,
    private openAiChat: OpenAiChatService, private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    console.log('HomeComponent INIT');
    this.loadState();
    this.stateService.state$.subscribe(state => {
      this.currentState = state;
      this.changeDetectorRef.detectChanges();
    });
    window.addEventListener('keydown', (ev) => this.sendShortcut(ev));
  }

  ngOnDestroy(): void {
    this.currentState?.shortcuts.forEach(shortcut => {
      this.shortcutsService.unregisterKeystroke(shortcut);
    });
  }

  async sendShortcut(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.metaKey) {
      await this.ask();
    }
  }

  ask() {
    return this.openAiChat.ask(this.currentState as IState);
  }

  async updateApiKey(event: any) {
    const apiKey = event.target.value;
    if (apiKey) { await this.stateService.saveState({ apiKey }); }
  }

  updateQuery(event: any) {
    this.stateService.updateState({ query: event.target.value });
  }

  private loadState() {
    this.stateService.loadState().then((loadedState) => {
      loadedState?.shortcuts.forEach(shortcut => {
        this.shortcutsService.registerKeystroke(loadedState, shortcut);
      });
    });
  }

}


