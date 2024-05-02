import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogRoutingModule } from './blog-routing.module';
import { WeblogComponent } from './weblog/weblog.component';
import { ArticleComponent } from './article/article.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    WeblogComponent,
    ArticleComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BlogRoutingModule
  ]
})
export class BlogModule { }
