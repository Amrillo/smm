import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogRoutingModule } from './blog-routing.module';
import { WeblogComponent } from './weblog/weblog.component';
import { ArticleComponent } from './article/article.component';


@NgModule({
  declarations: [
    WeblogComponent,
    ArticleComponent
  ],
  imports: [
    CommonModule,
    BlogRoutingModule
  ]
})
export class BlogModule { }
