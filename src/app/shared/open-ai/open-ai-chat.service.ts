import { Injectable } from '@angular/core';
import { OpenAiService } from './open-ai.service';
import { IState } from '../../core/stores/state.dt';
import { StateService } from '../../core/stores/state-service';

@Injectable({
  providedIn: 'root'
})
export class OpenAiChatService {

  constructor(private stateService: StateService, private openAiService: OpenAiService) { }

  public async generateAnswer(currentState: IState) {
    const response = await this.openAiService.openAIChatCompletion({
      apiKey: currentState.apiKey,
      stream: currentState.stream,
      messages: currentState.messages,
    });
    if (response.ok) {
      await this.openAiService.displayAnswer({ stream: currentState.stream }, response);
    } else {
      console.error('An error occurred during OpenAI request', response.statusText);
    }
  }

  public async ask(currentState: IState) {
    if (!currentState.query) {
      return;
    }
    currentState = {
      ...currentState,
      messages: [
        ...currentState.messages,
        {
          role: 'user',
          content: currentState.query
        }
      ]
    } as IState;
    this.stateService.updateState(currentState);
    await this.generateAnswer(currentState);
  }

}
