import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContetFile } from 'src/app/model/content-file.model';
import { ImageUrl } from 'src/app/model/image.model';
import { UploadService } from 'src/app/service/upload.service';

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.scss']
})
export class FilesListComponent implements OnInit {
  @Input() componentUploading: string=null;
  @Input() isMultipleUpload: boolean=true;
  @Input() uploadedContentImage:  ContetFile[] =[];
  @Input() portfolioTypes: any =[]
  

  constructor(private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {


    
  
  }

  onNewFile(){

    this.router.navigate(['new',this.componentUploading], {relativeTo: this.route});
  }

}
