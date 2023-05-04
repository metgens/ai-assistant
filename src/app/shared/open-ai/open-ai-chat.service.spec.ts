/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OpenAiChatService } from './open-ai-chat.service';

describe('Service: OpenAiChat', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpenAiChatService]
    });
  });

  it('should ...', inject([OpenAiChatService], (service: OpenAiChatService) => {
    expect(service).toBeTruthy();
  }));
});
