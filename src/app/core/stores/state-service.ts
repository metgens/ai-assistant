/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { Store } from 'tauri-plugin-store-api';
import { IState } from './state.dt';
import { BehaviorSubject, Observable } from 'rxjs';

export const defaultSystemPrompt = 'You\'re a helpful assistant named Ben';

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
                    system: 'You are a Fullstack developer (C#, Typescript, Html/css). Provide only code and nothing more (no comments).',
                    name: 'Fullstack Dev',
                    keystroke: 'CommandOrControl+Shift+K',
                    icon: 'bi-keyboard'
                },
                {
                    id: 2,
                    system:
                        `Check and if needed correct or translate to English {user} text (grammar and vocabulary) taking apart context.
Everything that user sends needs to be only translated. Provide only corrected text, no explanations. If my text is correct, write only "OK!"
!!!Context: I am a cloud and mobile games developer.`,
                    name: 'Fix typos',
                    keystroke: 'CommandOrControl+Shift+L',
                    icon: 'bi-globe'
                },
                {
                    id: 2,
                    system:
                        `Translate to polish language.`,
                    name: 'Translate',
                    keystroke: null,
                    icon: 'bi-translate'
                },
                {
                    id: 3,
                    system:
                        `You are a fullstack developer (C#, Typescript, Html/css). Explain provided error.`,
                    name: 'Explain error',
                    keystroke: null,
                    icon: 'bi-bug'
                },
                {
                    id: 3,
                    system:
                        `Detect {language} and summarize {user} text in bullet points. Output only in detected {language}.`,
                    name: 'Summarize',
                    keystroke: null,
                    icon: 'bi-body-text'
                },
                {
                    id: 4,
                    system:
                        `
User will send you English {sentence} and {output format}. {sentence} is taken from mobile game for toddlers and kids. I want you to translate this {sentence} into:
- Norwegian- {language code} no
- Swedish - {language code} sw
- Dutch - {language code} nl
- Turkish - {language code} tr
- Japanese - {language code} ja
. Return results in provided {output format}. do not add any comments, headers, anything.
---Input Example
{sentence}: A lot of joy
{format}: <g id="{language code}"><text transform="matrix(1 0 0 1 160 477)"><tspan x="0" y="0" fill="#FFFFFF" font-family="'LuckiestGuy-Regular'" font-size="76">{sentence}</tspan></text></g>
---Output format
<g id="{language code}"><text transform="matrix(1 0 0 1 160 477)"><tspan x="0" y="0" fill="#FFFFFF" font-family="'LuckiestGuy-Regular'" font-size="76">{sentence}</tspan></text></g>`,
                    name: 'Svg Translation',
                    keystroke: null,
                    icon: 'bi-filetype-svg'
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
        this.updateState({ apiKey: savedState.apiKey, aiDevApiKey: savedState.aiDevApiKey });
        return this.currentState;
    }

    public updateState(newState: Partial<IState>) {
        Object.assign(this.currentState as IState, newState);
        this.stateSubject.next(this.currentState as IState);
    }
}
