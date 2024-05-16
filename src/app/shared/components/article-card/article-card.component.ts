import { Component, Input } from '@angular/core';
import { ArticlesType } from 'src/types/articles.type';

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent  {


  @Input() article!: ArticlesType;

  constructor() { }



}
