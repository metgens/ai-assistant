import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

import { HomeRoutingModule } from './assistant/assistant-routing.module';
import { AiDevTasksComponent } from './ai-dev-tasks/ai-dev-tasks.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'assistant',
    pathMatch: 'full'
  },
  {
    path: 'aiDevTasks',
    component: AiDevTasksComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {}),
    HomeRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
