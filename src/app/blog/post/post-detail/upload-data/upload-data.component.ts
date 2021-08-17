import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Image, ImageUrl } from 'src/app/model/image.model';
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
  @Input() portfolioType: String;
  isAuthenticated = false;
  private userSub: Subscription;
  uploadedImageUrl: ImageUrl[] =[];
  
  

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
    this.dataStorageService.fetchPosts().subscribe(postCards=>{
     
      this.blogService.setPostCards(postCards);
      this.blogService.setLoadingIndicator(false);
    },errorMessage =>{
   
      console.log('HTTP Error', errorMessage)
      let errMsg = `Unable to retrieve due to  ${errorMessage}()`;
      this.blogService.setErrorMessage(errMsg);
      this.blogService.setLoadingIndicator(false);
    });
  }

  onSaveDataImg() {
    // this.dataStorageService.saveImages() 
    // .subscribe(
    //   response => {
    //     console.log(response[0][0] + " : Testing 1 0 1");
       
    //     let ms =  response[0][0];

    //    ms.imageUrls.forEach(element => {
    //     console.log(element + " : Testing 1 0 1 element");
    //     element.description = ms.description;
    //     this.uploadedImageUrl.push(element);
       

    //    });
    //     this.uploadService.uploadedImgDataSource(this.uploadedImageUrl);
    //     this.uploadService.cleanImages()
    //     this.uploadService.setLoadingIndicator(false);
    //     this.uploadService.setSuccessMessage("Uploaded successfully");
    //     this.uploadService.setErrorMessage(null);
    //   },
    //   errorMessage => {
    //     console.log('HTTP Error', errorMessage)
    //     let errMsg = `Unable to post due to `;
    //     if(errorMessage == undefined){

    //       errMsg += ' unknown issue '
    //     }else{
    //       errMsg += `${errorMessage.message}`
    //     }
        
    //     this.uploadService.setErrorMessage(errMsg);
    //     this.uploadService.setSuccessMessage(null);
    //     this.uploadService.setLoadingIndicator(false);
        
    //   });
   // this.router.navigate(['../'], { relativeTo: this.route });
  }

  onFetchDataImg() {
    console.log("Upload - onFetchDataImg using portfolio : " + this.portfolioType);

    if(this.portfolioType === "Architecture"){
      this.dataStorageService.fetchImages(this.portfolioType).subscribe((images: Image[])=>{
        console.log('HTTP IMG' + images)
        this.uploadService.setImages(images);
        this.uploadService.setLoadingIndicator(false);
      },errorMessage =>{
     
        console.log('HTTP Error', errorMessage)
        let errMsg = `Unable to retrieve due to  ${errorMessage}()`;
        this.uploadService.setErrorMessage(errMsg);
        this.uploadService.setLoadingIndicator(false);
      });

    }else if(this.portfolioType === "Hand-Drawing"){
      this.dataStorageService.fetchImages(this.portfolioType).subscribe((images: Image[])=>{
        console.log('HTTP IMG' + images)
        this.uploadService.setHandDrawingImages(images);
        this.uploadService.setLoadingIndicator(false);
      },errorMessage =>{
     
        console.log('HTTP Error', errorMessage)
        let errMsg = `Unable to retrieve due to  ${errorMessage}()`;
        this.uploadService.setErrorMessage(errMsg);
        this.uploadService.setLoadingIndicator(false);
      });

    }

  }
}
