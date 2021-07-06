import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { BlogService } from 'src/app/service/blog-service.service';
import { UploadService } from 'src/app/service/upload.service';
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
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(private dataStorageService: DataStorageService,
     private route: ActivatedRoute,private router: Router,  private blogService: BlogService,
     private uploadService: UploadService,  private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      // console.log(!user);
      // console.log(!!user);
    });
   
  }
  onSaveData() {
    this.dataStorageService.storePosts()
       .subscribe(
        response => {
          console.log(response);
          this.blogService.cleanPosts()
          this.blogService.setLoadingIndicator(false);
          this.blogService.setSuccessMessage("Created successfully");
          this.blogService.setErrorMessage(null);
        },
        errorMessage => {
          console.log('HTTP Error', errorMessage)
          let errMsg = `Unable to save due to  ${errorMessage.message}()`;
          this.blogService.setErrorMessage(errMsg);
          this.blogService.setLoadingIndicator(false);
          this.blogService.setSuccessMessage(null);
          
        });
  }

  onFetchData() {
    this.dataStorageService.fetchPosts().subscribe(posts=>{
     
      this.blogService.setPosts(posts);
      this.blogService.setLoadingIndicator(false);
    },errorMessage =>{
   
      console.log('HTTP Error', errorMessage)
      let errMsg = `Unable to retrieve due to  ${errorMessage}()`;
      this.blogService.setErrorMessage(errMsg);
      this.blogService.setLoadingIndicator(false);
    });
  }

  onSaveDataImg() {
    this.dataStorageService.storeImage() 
    .subscribe(
      response => {
        console.log(response);
        this.uploadService.cleanImages()
        this.uploadService.setLoadingIndicator(false);
        this.uploadService.setSuccessMessage("Uploaded successfully");
        this.uploadService.setErrorMessage(null);
      },
      errorMessage => {
        console.log('HTTP Error', errorMessage)
        let errMsg = `Unable to post due to ${errorMessage.message}`;
        this.uploadService.setErrorMessage(errMsg);
        this.uploadService.setSuccessMessage(null);
        this.uploadService.setLoadingIndicator(false);
        
      });
   // this.router.navigate(['../'], { relativeTo: this.route });
  }

  onFetchDataImg() {
    this.dataStorageService.fetchImages().subscribe(images=>{
     
      this.uploadService.setImages(images);
      this.uploadService.setLoadingIndicator(false);
    },errorMessage =>{
   
      console.log('HTTP Error', errorMessage)
      let errMsg = `Unable to retrieve due to  ${errorMessage}()`;
      this.uploadService.setErrorMessage(errMsg);
      this.uploadService.setLoadingIndicator(false);
    });
  }
}
