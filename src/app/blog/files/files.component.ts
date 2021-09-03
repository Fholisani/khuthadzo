import { OnDestroy } from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContetFile } from 'src/app/model/content-file.model';
import { ImageUrl } from 'src/app/model/image.model';
import { UploadService } from 'src/app/service/upload.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit , OnDestroy {
  @Input() componentUploading: string=null;
  @Input() isMultipleUpload: boolean=true;
  @Input() uploadedContentImage:  ContetFile[] =[];
  @Input() portfolioTypes: any =[]
  //subscription: Subscription;
  constructor(private uploadService: UploadService) { }
  ngOnDestroy(): void {
 //   this.subscription.unsubscribe();
  }

  ngOnInit(): void {

  }
 
  

}
