import { Component, Input, OnInit } from '@angular/core';
import { Image, ImageUrl } from 'src/app/model/image.model';

@Component({
  selector: 'app-post-image-item',
  templateUrl: './post-image-item.component.html',
  styleUrls: ['./post-image-item.component.css']
})
export class PostImageItemComponent implements OnInit {

  @Input() image: ImageUrl; 
  @Input() index: number;
  @Input() imageUrl: string;
  constructor() { }

  ngOnInit(): void {
  }

}
