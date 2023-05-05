import { Injectable } from '@angular/core';
import { Store } from 'tauri-plugin-store-api';
import { IState } from './state.dt';
import { BehaviorSubject, Observable } from 'rxjs';

export const defaultSystemPrompt = 'You\'re a helpful assistant named Angela';

@Injectable({
    providedIn: 'root'
})
export class StateService {

    public state$: Observable<IState>;
    private stateSubject: BehaviorSubject<IState>;
    private store: Store;
    private currentState: IState | null = null;

    constructor() {
        this.store = new Store('_angela.dat');
        this.stateSubject = new BehaviorSubject<IState>({
            apiKey: '',
            model: 'gpt-3.5-turbo',
            maxTokens: 1500,
            temperature: 0.8,
            stream: true,
            answer: '',
            query: '',
            messages: [{
                role: 'system',
                content: defaultSystemPrompt
            }],
            shortcuts: [
                {
                    id: 1,
                    system: 'Answer yes or no.',
                    name: 'Yes or no',
                    keystroke: 'CommandOrControl+Shift+K'
                }
            ]
        } as IState);
        this.state$ = this.stateSubject.asObservable();

        this.state$.subscribe(value => this.currentState = value);
    }

    public async saveState(newState: Partial<IState>): Promise<Partial<IState>> {
        this.updateState(newState);

        try {
            await this.store.set('state', this.currentState);
        } catch (error) {
            console.error(error);
        }


        return newState;
    }

    public async loadState(): Promise<IState | null> {
        const savedState = await this.store.get('state') as IState;
        this.updateState({ apiKey: savedState.apiKey });
        return this.currentState;
    }

    public updateState(newState: Partial<IState>) {
        Object.assign(this.currentState as IState, newState);
        this.stateSubject.next(this.currentState as IState);
    }
}
