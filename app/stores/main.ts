import { EventEmitter } from "events";
import type { IState } from "./main.dt";
import { safeStorage } from 'electron';


const Store = require('electron-store');
const store = new Store();

export const stateEventEmitter = new EventEmitter();
export const defaultSystemPrompt = "You\'re a helpful assistant named Angela";

export const saveState = async (newState: Partial<IState>) => {
    try {
        Object.assign(state, newState);
        await store.set('state', state);
        console.log('State saved');
    } catch (error) {
        console.error(error);
    }
    return newState;
}

export const loadState = async (state): Promise<IState | null> => {
    const savedState: IState = await store.get('state');
    state.apikey = savedState.apikey;
    console.log('State loaded');
    return state;
}

export const updateState = (newState: IState) =>{
    Object.assign(state, newState);
    stateEventEmitter.emit('stateChanged', state);
}

export const state = {
    apikey: '',
    model: 'gpt-3.5-turbo',
    max_tokens: 1500,
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
} as IState
