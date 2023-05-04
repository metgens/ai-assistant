import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AiDevComponent } from './ai-dev.component';

const routes: Routes = [
  {
    path: 'aidev',
    component: AiDevComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AiDevRoutingModule {}
