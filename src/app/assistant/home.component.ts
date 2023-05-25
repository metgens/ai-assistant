import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

  assistantShortcuts: IShortcut[] | undefined;
  currentState: IState | undefined | null;

  constructor(private route: ActivatedRoute,
    private stateService: StateService,
    private shortcutsService: ShortcutsService) {

      console.log(route.data);
  }

  ngOnInit(): void {
    console.log('HomeComponent INIT');

    this.stateService.loadState().then((loadedState) => {
      this.assistantShortcuts = loadedState?.shortcuts;
      this.currentState = loadedState;

      this.assistantShortcuts?.forEach(shortcut => {
        shortcut.localKeystroke = `Meta+${shortcut.id}`
      })
    });

    window.addEventListener('keydown', (ev) => this.sendShortcut(ev));
  }

  async sendShortcut(event: KeyboardEvent) {

    this.assistantShortcuts?.forEach(shortcut => {
      if (event.key === shortcut.id.toString() && event.metaKey) {
        this.openAssistantRole(shortcut);
      }
    })


  }

  openAssistantRole(shortcut: IShortcut | null) {
    this.shortcutsService.runManualShortcut(this.currentState as IState, shortcut);
  }

}


