import { Injectable } from '@angular/core';
import { OpenAiService } from './open-ai.service';

@Injectable({
  providedIn: 'root'
})
export class OpenAiChatService {

  constructor(private openAiService: OpenAiService) { }

  public async generateAnswer(currentState) {
    const response = await this.openAiService.openAICompletion({
      apikey: currentState.apikey,
      stream: currentState.stream,
      messages: currentState.messages,
    });
    if (response.ok) {
      await this.openAiService.displayAnswer({ stream: currentState.stream }, response);
    } else {
      console.error('An error occurred during OpenAI request', response.statusText);
    }
  }

  public async ask(currentState) {
    if (!currentState.query) {
      return;
    }
    const updatedState = {
      ...currentState,
      messages: [
        ...currentState.messages,
        {
          role: 'user',
          content: currentState.query
        }
      ]
    }
    await this.generateAnswer(updatedState);
  }

}