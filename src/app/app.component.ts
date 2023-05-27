import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TauriService } from './core/services';
import { restoreStateCurrent, saveWindowState, StateFlags } from 'tauri-plugin-window-state-api';
import { StateService } from './core/stores/state-service';
import { ShortcutsService } from './core/shortcuts';
import { IShortcut, IState } from './core/stores/state.dt';
import { Position, moveWindow } from 'tauri-plugin-positioner-api';
import { Router } from '@angular/router';
declare const bootstrap: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit, AfterViewInit {
  currentState: IState | undefined;
  assistantShortcuts: IShortcut[] | undefined;

  constructor(
    private tauriService: TauriService,
    private translate: TranslateService,
    private stateService: StateService,
    private shortcutsService: ShortcutsService,
    public router: Router
  ) {
    this.initialize();
    this.loadState();
    this.shortcutsService.registerKeystroke("CommandOrControl+Alt+;",() => { this.router.navigateByUrl('/assistant')});
    this.stateService.state$.subscribe(state => {
      this.currentState = state;
    });
  }
  ngOnInit(): void {
    restoreStateCurrent(StateFlags.SIZE);
    moveWindow(Position.TopRight);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initializeTooltips(), 500);
  }

  ngOnDestroy(): void {
    saveWindowState(StateFlags.SIZE);
    this.currentState?.shortcuts.forEach(shortcut => {
      this.shortcutsService.unregisterShortcut(shortcut);
    });
  }

  openAssistantRole(shortcut: IShortcut | null) {
    this.shortcutsService.runManualShortcut(this.currentState as IState, shortcut);
  }

  private loadState() {
    this.stateService.loadState().then((loadedState) => {
      this.assistantShortcuts = loadedState?.shortcuts;
      loadedState?.shortcuts.forEach(shortcut => {
        this.shortcutsService.registerShortcut(loadedState, shortcut);
      });
    });
  }

  private initialize() {
    this.translate.setDefaultLang('en');

    this.initializeTooltips();

    if (this.tauriService.isTauri) {
      console.log('Run in Tauri');
      this.tauriService.callHelloWorld();
    } else {
      console.log('Run in browser');
    }
  }


  private initializeTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = tooltipTriggerList.forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  }
}

