/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { APP_CONFIG } from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { StateService } from '../../core/stores/state-service';
import { IState } from '../../core/stores/state.dt';

@Injectable({
  providedIn: 'root'
})
export class TaskWrapperService {
  currentState: IState | undefined;

  constructor(private stateService: StateService) {

    this.stateService.state$.subscribe(state => {
      this.currentState = state;
    });
   }

  async getAuthenticationToken(taskName: string): Promise<string> {
    const apiUrl = `/token/${taskName}`;

    const requestData = { apikey: this.currentState?.aiDevApiKey };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    const responseBody = await response.json();
    return responseBody.token;
  }

  async getTask(token: string): Promise<any> {
    const apiUrl = `/task/${token}`;

    const response = await fetch(apiUrl);
    const responseBody = await response.json();
    return responseBody;
  }

  async sendAnswer(token: string, answerValue: string): Promise<any> {

    const apiUrl = `/answer/${token}`;
    const requestData = { answer: answerValue };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    const responseBody = await response.json();
    return responseBody;
  }
}
