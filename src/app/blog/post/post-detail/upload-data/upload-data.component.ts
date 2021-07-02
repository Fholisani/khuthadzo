import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from 'src/app/service/blog-service.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-upload-data',
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.css']
})
export class UploadDataComponent implements OnInit {

  @Input() numberOfPosts: number;
  @Input() isPostAvailable: boolean;
  @Input() isCreatePost: boolean;

  @Input() isImageUpload: boolean;
  @Input() isImgAvailable: boolean;
  @Input() isCreateImg: boolean;

  constructor(private dataStorageService: DataStorageService,
     private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
  
   
  }
  onSaveData() {
    this.dataStorageService.storePosts();
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onFetchData() {
    this.dataStorageService.fetchPosts().subscribe();
  }

  onSaveDataImg() {
    this.dataStorageService.storeImage();
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onFetchDataImg() {
    this.dataStorageService.fetchImages().subscribe();
  }
}
