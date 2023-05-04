import { Injectable } from '@angular/core';
import { APP_CONFIG } from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskWrapperService {
  constructor() { }

  async getAuthenticationToken(taskName: string): Promise<string> {
    const apiUrl = `https://zadania.aidevs.pl/token/${taskName}`;

    const requestData = { apikey: APP_CONFIG.aiDevApiKey };
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
    const apiUrl = `https://zadania.aidevs.pl/task/${token}`;

    const response = await fetch(apiUrl);
    const responseBody = await response.json();
    return responseBody;
  }

  async sendAnswer(token: string, answerValue: string): Promise<any> {

    const apiUrl = `https://zadania.aidevs.pl/answer/${token}`;
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