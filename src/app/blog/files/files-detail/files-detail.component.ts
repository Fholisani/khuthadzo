import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ContetFile } from 'src/app/model/content-file.model';
import { ImageUrl } from 'src/app/model/image.model';
import { UploadService } from 'src/app/service/upload.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-files-detail',
  templateUrl: './files-detail.component.html',
  styleUrls: ['./files-detail.component.css']
})
export class FilesDetailComponent implements OnInit {
  id: number;
  componentUploadingImg: string;
  imageContent: ContetFile;
  constructor(private uploadService: UploadService, private route: ActivatedRoute,
    private router: Router,) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) =>{
        this.id = +params['id'];
        this.componentUploadingImg=params['id2'];
        console.log("Componet to retrieve details : " + this.componentUploadingImg);
        if(this.componentUploadingImg==='postImg'){
          this.imageContent = this.uploadService.getPostFileUploaded(this.id);
        }
        if(this.componentUploadingImg==='upload'){

        }
        if(this.componentUploadingImg==='backgroundImg'){
          this.imageContent = this.uploadService.getBgFileUploaded(this.id);
        }
       
      }
    );
  }

  onEditFileUploaded(){
    this.router.navigate(['edit'],{relativeTo: this.route});
   //this.router.navigate(['../', this.id], {relativeTo: this.route});

  }

  onDeleteFileUploaded(){

    if(this.componentUploadingImg==='postImg'){
      this.uploadService.deletePostFileUploaded(this.id);  
    }
    if(this.componentUploadingImg==='upload'){

    }
    if(this.componentUploadingImg==='backgroundImg'){

      this.uploadService.deleteBgFileUploaded(this.id);
    }
    
    this.router.navigate(['/post', this.imageContent.postId,'edit']);

  }



}
