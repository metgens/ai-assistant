import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { AssistantComponent } from './assistant.component';

const routes: Routes = [
  {
    path: 'assistant/:type',
    component: AssistantComponent
  },
  {
    path: 'assistant',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
