import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription } from 'rxjs';
import { Image, ImageUrl } from 'src/app/model/image.model';
import { UploadService } from 'src/app/service/upload.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';
 

@Component({
  selector: 'app-image-upload-impl',
  templateUrl: './image-upload-impl.component.html',
  styleUrls: ['./image-upload-impl.component.scss']
})
export class ImageUploadImplComponent implements OnInit, OnDestroy {
  subscriptionImg: Subscription;
  private subscriptionUploadImg: Subscription;
  isLoading = false;
  errorMessage: string=null;
  successMessage: string=null;
  imageLink: string=null;
  hasSubmitedImages = false;
  componentUploadingImg : string =null;
  portfolioUploadingImg: string =null;
  uploadedImageUrl: ImageUrl[] =[];
  imageObj: Image;
  isMultipleUpload: boolean=true;
  portfolioTypes: any = ['HandDrawing', 'Architecture', 'Blog','Carousel', ]
  constructor(private uploadService: UploadService,
    private dataStorageService: DataStorageService, private clipboardApi: ClipboardService) { }

  ngOnInit(): void {
    this.subscriptionImg = this.uploadService.isLoadingChanged
    .subscribe(
      (isLoading: boolean) => {
        this.isLoading = isLoading;
      }
    );

    this.subscriptionImg = this.uploadService.errorMessageChanged
    .subscribe(
      (errorMessage: string) => {
         this.errorMessage = errorMessage;
      }
    );

    this.subscriptionImg = this.uploadService.successMessageChanged
    .subscribe(
      (successMessage: string) => {
         this.successMessage = successMessage;
      }
    );
    this.subscriptionUploadImg = this.uploadService.imagesAdded
    .subscribe(
      (image: Image) => {
        if(image !== null){
          console.log("Upload image only if its the correct" + this.componentUploadingImg);
        if(this.componentUploadingImg==='upload'){

          this.imageObj = image;
          this.onSaveDataImg();
          }
        }else{
          console.log("Should not upload -Images just cleaned up - " + this.componentUploadingImg);
        }
        
      }
    );
    
  }

  acceptData(data) {
    console.log(
      "this is the child data displaying in parent component: hasSubmitedImages : ",
      data
    );
    this.hasSubmitedImages = data;
  }
  componentUploading(data) {
    console.log(
      "this is the child data displaying in parent component: componentUploading : ",
      data
    );
    this.componentUploadingImg = data;
  }
  portfolioUploading(data) {
    console.log(
      "this is the child data displaying in parent component: portfolioUploadingImg : ",
      data
    );
    this.portfolioUploadingImg = data;
  }
  onSaveDataImg() {
    console.log(" ======Calling from IMAGE-UPLOAD component======= : "+ this.componentUploadingImg);
    

   
    this.subscriptionImg=  this.dataStorageService.saveImages(this.componentUploadingImg) 
    .subscribe(
      response => {
        console.log(response[0][0] + " : Testing 1 0 1");
       
        let ms =  response[0][0];

        if(this.componentUploadingImg === 'upload'){
          ms.imageUrls.forEach(element => {
            console.log(element + " : Testing 1 0 1 element");
            element.description = ms.description;
            if(this.portfolioUploadingImg ==='Blog'){
              this.imageLink = element.url;
            }else{
              this.imageLink = null;
            }
          
            this.uploadedImageUrl.push(element);
            
           });
           this.uploadService.uploadedImgDataSource(this.uploadedImageUrl);
      
        
      
  
        this.uploadService.cleanImages();
        this.uploadService.cleanPostImages();
        this.uploadService.cleanBgImages();
        this.uploadService.setLoadingIndicator(false);
        this.uploadService.setSuccessMessage("Uploaded successfully");
        this.uploadService.setErrorMessage(null);
        
          }
      },
      errorMessage => {
        console.log('HTTP Error', errorMessage)
        let errMsg = `Unable to post due to `;
        if(errorMessage == undefined){

          errMsg += ' service unavailable! '
        }else{
          errMsg += `${errorMessage.message}`
        }
        
        this.uploadService.setErrorMessage(errMsg);
        this.uploadService.setSuccessMessage(null);
        this.uploadService.setLoadingIndicator(false);
        
      });
 
   // this.router.navigate(['../'], { relativeTo: this.route });
  }
  ngOnDestroy() {
    console.log("=========== unsubscribe image upload impl 1  =================");
    this.subscriptionImg.remove;
    this.subscriptionImg.unsubscribe();
    this.subscriptionUploadImg.remove;
    this.subscriptionUploadImg.unsubscribe();
    
   
  }

}
