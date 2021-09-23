import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContetFile } from 'src/app/model/content-file.model';
import { UploadService } from 'src/app/service/upload.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.scss']
})
export class VideoDetailComponent implements  OnInit, OnDestroy {

  id: number;
  componentUploadingImg: string;
  videoContent: ContetFile;
  private subContentVideoChanged:  Subscription;
  private subscription: Subscription;
  
  private subscriptionError: Subscription;
  private subscriptionSuccess: Subscription;
  isLoading = false;
  errorMessage: string = null;
  successMessage: string = null;
  constructor(private uploadService: UploadService, private route: ActivatedRoute,
    private router: Router,
    private dataStorageService: DataStorageService) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) =>{
        this.id = +params['id'];
       
        let video = this.uploadService.getVideoPosterUploaded(this.id);
        if(video){
          this.onFetchVideo(video.reference);
        }
       
      }
    );
    this.subContentVideoChanged = this.uploadService.contentVideoChanged
    .subscribe(
      (image: ContetFile) => {
        if (image !== null) {

         
          this.videoContent = image;
            // this.imageObj = image;
           
         
        } else {
          console.log("No poster image available " );
        }
      }
    );
    this.subscription = this.uploadService.isLoadingChanged
    .subscribe(
      (isLoading: boolean) => {
        this.isLoading = isLoading;
      }
    );
    this.subscriptionError = this.uploadService.errorMessageChanged
    .subscribe(
      (errorMessage: string) => {
        this.errorMessage = errorMessage;
      }
    );
  this.subscriptionSuccess = this.uploadService.successMessageChanged
    .subscribe(
      (successMessage: string) => {
        this.successMessage = successMessage;

      }
    );

  }

  onFetchVideo(reference) {

    this.dataStorageService.fetchVideo('poster', reference).subscribe((video: ContetFile) => {
      // console.log('HTTP IMG' + images)
      this.uploadService.setContentVideo(video);

      this.uploadService.setLoadingIndicator(false);
    }, errorMessage => {

      console.log('HTTP Error', errorMessage)
      let errMsg = `Unable to retrieve due to  ${errorMessage}()`;
      this.uploadService.setErrorMessage(errMsg);
      this.uploadService.setLoadingIndicator(false);
    });
  }
  onEditFileUploaded(){
    this.router.navigate(['edit'],{relativeTo: this.route});
   //this.router.navigate(['../', this.id], {relativeTo: this.route});

  }

  onDeleteFileUploaded(){
    this.uploadService.deletePostFileUploaded(this.id);
    
    
    this.router.navigate(['/post', this.videoContent.postId,'edit']);

  }
  ngOnDestroy() {

    this.subContentVideoChanged.unsubscribe();
    this.subscription.unsubscribe();
 
    this.subscriptionError.unsubscribe();
    this.subscriptionSuccess.unsubscribe();

  }

}
