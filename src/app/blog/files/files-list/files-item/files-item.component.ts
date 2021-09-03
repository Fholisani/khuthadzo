import { Component, Input, OnInit } from '@angular/core';
import { ImageUrl } from 'src/app/model/image.model';
import { UploadService } from 'src/app/service/upload.service';

@Component({
  selector: 'app-files-item',
  templateUrl: './files-item.component.html',
  styleUrls: ['./files-item.component.scss']
})
export class FilesItemComponent implements OnInit {


  @Input() image: ImageUrl; 
  @Input() index: number;
  @Input() imageUrl: string;
  @Input() componentUploading: string=null;
  constructor(private uploadService: UploadService) { }

  ngOnInit(): void {
  }
  cleanMessages(){
    this.uploadService.setErrorMessage(null);
    this.uploadService.setSuccessMessage(null);
  }

}
