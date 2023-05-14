import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { OpenAiChatService } from '../shared/open-ai/open-ai-chat.service';
import { IMessage, IShortcut, IState } from '../core/stores/state.dt';
import { StateService } from '../core/stores/state-service';
import { ShortcutsService } from '../core/shortcuts';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  currentState: IState | null = null;

  constructor(private stateService: StateService, private openAiChat: OpenAiChatService,
    private changeDetectorRef: ChangeDetectorRef, private route: ActivatedRoute) {

      console.log(route.data);
  }

  ngOnInit(): void {
    console.log('HomeComponent INIT');
    this.stateService.state$.subscribe(state => {
      this.currentState = state;
      this.changeDetectorRef.detectChanges();
    });
    window.addEventListener('keydown', (ev) => this.sendShortcut(ev));
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

}


