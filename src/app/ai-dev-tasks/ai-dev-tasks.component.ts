/* eslint-disable max-len */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IMessage, IState } from '../core/stores/state.dt';
import { StateService } from '../core/stores/state-service';
import { ShortcutsService } from '../core/shortcuts';
import { OpenAiChatService } from '../shared/open-ai/open-ai-chat.service';
import { TaskWrapperService } from '../shared/ai-dev/task-wrapper.service';
import { OpenAiService } from '../shared/open-ai/open-ai.service';
import Enumerable from 'linq'

@Component({
  selector: 'app-ai-dev-tasks',
  templateUrl: './ai-dev-tasks.component.html',
  styleUrls: ['./ai-dev-tasks.component.css']
})
export class AiDevTasksComponent implements OnInit {

  currentState: IState | null = null;
  task: any;
  response: any;

  constructor(private stateService: StateService, private openAi: OpenAiService, private taskWrapper: TaskWrapperService) {
  }

  ngOnInit(): void {
    console.log('AIDev INIT');
    this.stateService.state$.subscribe(state => {
      this.currentState = state;
    });
  }

  async doTask01() {
    const taskName = 'helloapi';
    const token = await this.taskWrapper.getAuthenticationToken(taskName);
    this.task = await this.taskWrapper.getTask(token);
    const answer = this.task.cookie;
    this.response = await this.taskWrapper.sendAnswer(token, answer);
  }

  async doTask03() {
    const taskName = 'inprompt';
    const token = await this.taskWrapper.getAuthenticationToken(taskName);
    this.task = await this.taskWrapper.getTask(token);

    const query = {
      prompt: `Wypisz imię i tylko imię z tego tekstu: "${this.task.question}"`,
      apiKey: this.currentState?.apiKey
    };

    const response = await this.openAi.openAICompletion(query);
    const name = response.choices[0].text.replace(/^\s+|\s+$/g, '');
    const inputForName = Enumerable.from(this.task.input).where(x => (x as string).includes(name)).toArray();

    const queryForPerson = {
      messages: [
        { role: 'user', content: this.task.question },
        { role: 'system', content: 'Odpowiedz jednym słowem, poprawnie odmienionym w j. polskim. Zadam ci pytanie dotyczące człowieka, opisanego tym zdaniem: "' + inputForName[0] + '"' }
      ],
      apiKey: this.currentState?.apiKey
    } as IState;

    const responseForName = await this.openAi.openAIChatCompletion(queryForPerson);
    if (responseForName.ok) {
      const responseForNameJson = await responseForName.json();
      const answer = responseForNameJson.choices[0].message.content;
      this.response = await this.taskWrapper.sendAnswer(token, answer);
    }
  }

  async doTask05() {
    const taskName = 'blogger';
    const token = await this.taskWrapper.getAuthenticationToken(taskName);
    this.task = await this.taskWrapper.getTask(token);

    const queryForPerson = {
      messages: [
        { role: 'user', content: `[${this.task.blog.toString()}]` },
        {
          role: 'system',
          content: `You are polish-speaker blog writer. 
Please write a blog post with chapters which will be provided in array.
The response should be an stringified json array with strings, where each chapter text is a separate string (max 3 sentences per each chapter). 
It should have the same amount of elements as input array. Chapter title shouldn't be separate string in this array.

###
Input Example
###
["chapterTitle1", "chapterTitle2"]

###
Response Example
###
'["Tekst na temat chapterTitle1 po polsku","Tekst na temat chapterTitle2 po polsku"]'
` }
      ],
      apiKey: this.currentState?.apiKey
    } as IState;

    const response = await this.openAi.openAIChatCompletion(queryForPerson);
    const responseJson = await response.json();
    this.response = responseJson;
    let answer = responseJson.choices[0].message.content;
    answer = JSON.parse(answer);
    this.response = await this.taskWrapper.sendAnswer(token, answer);
  }

  async updateApiKey(event: any) {
    const apiKey = event.target.value;
    if (apiKey) { await this.stateService.saveState({ apiKey }); }
  }


  async updateAiDevApiKey(event: any) {
    const aiDevApiKey = event.target.value;
    if (aiDevApiKey) { await this.stateService.saveState({ aiDevApiKey }); }
  }
}
