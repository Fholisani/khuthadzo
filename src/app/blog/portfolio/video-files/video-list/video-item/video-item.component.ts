import { Component, Input, OnInit } from '@angular/core';
import { ContetFile } from 'src/app/model/content-file.model';

import { UploadService } from 'src/app/service/upload.service';

@Component({
  selector: 'app-video-item',
  templateUrl: './video-item.component.html',
  styleUrls: ['./video-item.component.scss']
})
export class VideoItemComponent implements OnInit {
  @Input() video: ContetFile; 
  @Input() index: number;
  constructor(private uploadService: UploadService) { }

  ngOnInit(): void {
  }

}
