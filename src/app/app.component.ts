import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TauriService } from './core/services';
import { restoreStateCurrent, saveWindowState, StateFlags } from 'tauri-plugin-window-state-api';
import { StateService } from './core/stores/state-service';
import { ShortcutsService } from './core/shortcuts';
import { IState } from './core/stores/state.dt';
import { Position, moveWindow } from 'tauri-plugin-positioner-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
  currentState: IState | undefined;

  constructor(
    private tauriService: TauriService,
    private translate: TranslateService,
    private stateService: StateService,
    private shortcutsService: ShortcutsService
  ) {
    this.initialize();
    this.loadState();
    this.stateService.state$.subscribe(state => {
      this.currentState = state;
    });
  }

  ngOnInit(): void {
    restoreStateCurrent(StateFlags.SIZE);
    moveWindow(Position.TopRight);
  }

  ngOnDestroy(): void {
    saveWindowState(StateFlags.SIZE);
    this.currentState?.shortcuts.forEach(shortcut => {
      this.shortcutsService.unregisterKeystroke(shortcut);
    });
  }

  private loadState() {
    this.stateService.loadState().then((loadedState) => {
      loadedState?.shortcuts.forEach(shortcut => {
        this.shortcutsService.registerKeystroke(loadedState, shortcut);
      });
    });
  }

  private initialize() {
    this.translate.setDefaultLang('en');

    if (this.tauriService.isTauri) {
      console.log('Run in Tauri');
      this.tauriService.callHelloWorld();
    } else {
      console.log('Run in browser');
    }
  }

}

