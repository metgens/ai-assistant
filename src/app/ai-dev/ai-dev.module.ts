import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiDevComponent } from './ai-dev.component';
import { SharedModule } from '../shared/shared.module';
import { AiDevRoutingModule } from './ai-dev-routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, AiDevRoutingModule],
  declarations: [AiDevComponent]
})
export class AiDevModule { }
