/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { clipboard } from 'electron';
import { defaultSystemPrompt, state } from '../../../../app/stores/main';
import { IState } from '../../../../app/stores/main.dt';

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {

  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private maxTokens = 1500;
  private temperature = 0.8;
  private model = 'gpt-3.5-turbo';

  constructor() { }


  async openAICompletion(query: Partial<IState>) {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${query.apikey}`,
        },
        body: JSON.stringify({
          model: query.model ?? this.model,
          max_tokens: query.max_tokens ?? this.maxTokens,
          temperature: query.temperature ?? this.temperature,
          messages: query.messages ?? [],
          stream: query.stream ?? false,
          stop: ['---']
        }),
      };

      return fetch(this.apiUrl, options);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  updateLatestMessage(stateChanged: IState, content) {
    const latestMessage = stateChanged.messages[stateChanged.messages.length - 1];
    if (latestMessage.role === 'assistant') {
      stateChanged.messages[stateChanged.messages.length - 1] = {
        role: 'assistant',
        content: latestMessage.content + content
      };
    } else {
      stateChanged.messages = [
        ...stateChanged.messages,
        {
          role: 'assistant',
          content,
        },
      ];
    }
    return stateChanged;
  }

  async displayAnswer(query: Partial<IState>, response: Response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let answer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      const lines = decoder.decode(value).split('\n').filter(line => line.trim() !== '');
      for (const line of lines) {
        const message = line.replace(/^data: /, '');
        if (message === '[DONE]') {
          await clipboard.writeText(answer);

          state.messages = state.messages.map(msg => {
            msg.content = msg.role === 'system' ? defaultSystemPrompt : msg.content;
            return msg;
          })
          state.query = '';

          return; // Stream finished
        }
        try {
          const parsed = JSON.parse(message);
          const content = (query.stream ? parsed.choices[0].delta.content : parsed.choices[0].message.content) ?? '';
          answer += content;
          this.updateLatestMessage(state, content);
        } catch (error) {
          console.error('Could not JSON parse stream message', message, error);
        }
      }
    }
  }

}
