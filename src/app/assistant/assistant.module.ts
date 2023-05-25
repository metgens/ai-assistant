import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './assistant-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { AiDevTasksComponent } from '../ai-dev-tasks/ai-dev-tasks.component';
import { AssistantComponent } from './assistant.component';

@NgModule({
  declarations: [HomeComponent, AssistantComponent],
  imports: [CommonModule, SharedModule, HomeRoutingModule]
})
export class AssistantModule {}
