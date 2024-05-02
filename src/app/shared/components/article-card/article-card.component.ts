import { Component, Input, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { ArticlesType } from 'src/types/articles.type';

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit {


  @Input() article!: ArticlesType;   
  
  constructor(private articleS: ArticleService) { }

  ngOnInit(): void {

    this.articleS.getTopArticles
  }



}
