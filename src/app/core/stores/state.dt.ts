export interface IState {
    apiKey: string;
    model: 'gpt-4' | 'gpt-3.5-turbo';
    maxTokens: number;
    temperature: number;
    stream: boolean;
    messages: IMessage[];
    shortcuts: IShortcut[];
    query: string;
    answer: string;
}

export interface IShortcut {
    id: number;
    name: string;
    system: string;
    keystroke: string;
}

export interface IMessage {
    role: 'assistant' | 'user' | 'system';
    content: string;
}
