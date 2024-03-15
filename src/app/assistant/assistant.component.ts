import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { OpenAiChatService } from '../shared/open-ai/open-ai-chat.service';
import { IMessage, IShortcut, IState } from '../core/stores/state.dt';
import { StateService } from '../core/stores/state-service';
import { ShortcutsService } from '../core/shortcuts';
import { ActivatedRoute } from '@angular/router';
import { clipboard } from '@tauri-apps/api';
import Enumerable from 'linq';

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.scss']
})

export class AssistantComponent implements OnInit, AfterViewInit {

  currentState: IState | null = null;
  @ViewChild('queryInput') queryInput: ElementRef | null = null;

  constructor(private stateService: StateService, private openAiChat: OpenAiChatService,
    private changeDetectorRef: ChangeDetectorRef, private route: ActivatedRoute) {

      console.log(route.data);
  }

  ngOnInit(): void {
    console.log('AssistantComponent INIT');
    this.stateService.state$.subscribe(state => {
      this.currentState = state;
      this.changeDetectorRef.detectChanges();
    });
    window.addEventListener('keydown', (ev) => this.sendShortcut(ev));

    this.route.params.subscribe(queryParams => {
      this.queryInput?.nativeElement.focus();
    });
  }

  ngAfterViewInit(): void {
    this.queryInput?.nativeElement.focus();
   }

  async sendShortcut(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.metaKey) {
      this.queryInput?.nativeElement.dispatchEvent(new Event('change'));
      this.ask();
    }
    if (event.key === 'c' && event.ctrlKey) {
      this.copyToClipboard();
    }
  }

  ask() {
    return this.openAiChat.ask(this.currentState as IState);
  }

  async updateApiKey(event: any) {
    const apiKey = event.target.value;
    if (apiKey) { await this.stateService.saveState({ apiKey }); }
  }

  async updateApiModel(event: any) {
    const model = event.target.value;
    if (model) { await this.stateService.saveState({ model }); }
  }

  updateQuery(event: any) {
    this.stateService.updateState({ query: event.target.value });
  }

  copyToClipboard(){
    var answer = Enumerable.from(this.currentState!.messages).where(x => x.role == "assistant").last().content;
    clipboard.writeText(answer?.trimEnd());
  }

}


