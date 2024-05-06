import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeblogComponent } from './weblog/weblog.component';
import { ArticleComponent } from './article/article.component';

const routes: Routes = [
  {path: 'blog', component:  WeblogComponent},
  {path: 'articles/:url', component:  ArticleComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
