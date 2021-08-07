import { OnDestroy } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Image, ImageUrl } from 'src/app/model/image.model';
import { Post } from 'src/app/model/post.model';
import { BlogService } from 'src/app/service/blog-service.service';
import { UploadService } from 'src/app/service/upload.service';
import { AlertMessageComponent } from 'src/app/shared/alert-message/alert-message.component';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { ImageUploadComponent } from '../../portfolio/image-upload/image-upload.component';
import { mimeType } from '../../portfolio/image/mime-type.validator';

@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css']
})
export class PostNewComponent implements OnInit, OnDestroy {

  post?: Post;
  newPostForm: FormGroup;
  imageUrlsLocal = [];
  urlsBackground = [];
  base64String: string;
  name: string;
  imagePath: string;
  editMode = false;
  id: number;
  numberOfPosts: number;
  isPostAvailable = false;
  isCreatePost = true;
  isImageUpload = false;
  isImgAvailable: boolean;
  isCreateImg = false;
  submitted = false;
  imageObj: Image ;
  uploadedImageUrl: ImageUrl[] =[];
  uploadedBgImageUrl: ImageUrl[] =[];
  // hasSubmitedImages = false;
  hasComponentSubmitedBgImages = false;
  hasComponentSubmitedPostImages = false;
  componentUploadingImg : string =null;
  isMultipleUpload: boolean=true;
  isMultipleBgUpload: boolean=false;


  // ViewChild is used to access the input element.

  @ViewChild('takeInput', { static: false })


  // this InputVar is a reference to our input.

  InputVarSingle: ElementRef;

  @ViewChild('takeMultipleInput', { static: false })
  InputVarMultiple: ElementRef;
  private subscription: Subscription;
  isLoading = false;
  errorMessage: string = null;
  successMessage: string = null;

  isUploadLoading = false;
  errorUploadMessage: string = null;
  successUploadMessage: string = null;

  isUploadBgLoading = false;
  errorUploadBgMessage: string = null;
  successUploadBgMessage: string = null;
  portfolioTypes: any = ['Post']
  bgPortfolioTypes: any = ['Background'];
  private  uploadedPostImageSub: Subscription;
  private  uploadedBgImageSub: Subscription;
  @ViewChild('app-alert-message') childAlertMessageComponent: AlertMessageComponent;



  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private uploadService: UploadService,
    private dataStorageService: DataStorageService,
  ) { }

  ngOnInit(): void {
    if (this.subscription) {
      console.log("===Unsubscribe after a check==== ");
      this.subscription.unsubscribe();
    }
    this.subscription = this.blogService.isLoadingChanged
      .subscribe(
        (isLoading: boolean) => {
          this.isLoading = isLoading;
        }
      );

    this.subscription = this.blogService.postsAdded
      .subscribe(
        (posts: Post[]) => {
          this.dataEmit();
        }
      );

    this.subscription = this.blogService.errorMessageChanged
      .subscribe(
        (errorMessage: string) => {
          this.errorMessage = errorMessage;
        }
      );

    this.subscription = this.blogService.successMessageChanged
      .subscribe(
        (successMessage: string) => {
          this.successMessage = successMessage;
        }
      );

    this.uploadedBgImageSub = this.uploadService.imagesBgAdded
    .subscribe(
      (image: Image) => {
        if(image !== null ){
          if(this.uploadedBgImageUrl.length < 1 ){
            console.log("Post image only if its the correct component" + this.componentUploadingImg);
            if(this.componentUploadingImg==='postImg'
            || this.componentUploadingImg==='backgroundImg'){
    
              this.imageObj = image;
              this.onSaveDataImg();
              }
          }else{
            
            this.errorUploadBgMessage = "Only one backgroud image can be uploaded!";
          }
        }else{
          console.log("Should not upload -Images just cleaned up - " + this.componentUploadingImg);
        }
      }
    );
   // this.imageObj = this.uploadService.getImagesAdded();


   this.uploadedPostImageSub = this.uploadService.imagesPostAdded
    .subscribe(
      (image: Image) => {
        if(image !== null){
          console.log("Post image only if its the correct component - navItem" + this.componentUploadingImg);
          if(this.componentUploadingImg==='postImg'
          || this.componentUploadingImg==='backgroundImg'){
  
            this.imageObj = image;
            this.onSaveDataImg();
            }
        }else{
          console.log("Should not upload -Images just cleaned up - " + this.componentUploadingImg);
        }
      }
    );
    
    
    this.subscription = this.uploadService.isLoadingChanged
    .subscribe(
      (isLoading: boolean) => {
        this.isUploadLoading = false;
        this.isUploadBgLoading = false;
        if(this.componentUploadingImg === 'postImg'){
          this.isUploadLoading = isLoading;
          
        }
        if(this.componentUploadingImg === 'backgroundImg'){
          this.isUploadBgLoading = isLoading;
        }
        
      }
    );

    this.subscription = this.uploadService.errorMessageChanged
    .subscribe(
      (errorMessage: string) => {
        if(this.componentUploadingImg === 'postImg'){
          this.errorUploadMessage = errorMessage;
        }
        if(this.componentUploadingImg === 'backgroundImg'){
          this.errorUploadBgMessage = errorMessage;
        }
         
      }
    );

    this.subscription = this.uploadService.successMessageChanged
    .subscribe(
      (successMessage: string) => {
        if(this.componentUploadingImg === 'postImg'){
          this.successUploadMessage = successMessage;
        }
        if(this.componentUploadingImg === 'backgroundImg'){
          this.successUploadBgMessage = successMessage;
        }
         
      }
    );

    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });


    if (this.post) {
      this.newPostForm.setValue({
        postId: this.post.id,
        heading: this.post.heading,
        subHeading: this.post.subHeading,
        backgroundImage: this.post.backgroundImage,
        body: this.post.body,
        imageUrls: this.post.imageUrls,
      });
    }
  }


  onSaveDataImg() {
    console.log(" ======Calling from POST-NEW component======= : "+ this.componentUploadingImg);

    this.subscription = this.dataStorageService.saveImages(this.componentUploadingImg) 
    .subscribe(
      response => {
        console.log(response[0][0] + " : Testing 1 0 1");
       
        let ms =  response[0][0];

        if(this.componentUploadingImg === 'postImg'){
          ms.imageUrls.forEach(element => {
            console.log(element + " : Testing 1 0 1 element");
            element.description = ms.description;
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

        if(this.componentUploadingImg === 'backgroundImg'){
          ms.imageUrls.forEach(element => {
            console.log(element + " : Testing 1 0 1 element");
            element.description = ms.description;
            this.uploadedBgImageUrl.push(element);
           });
           this.uploadService.uploadedImgDataSource(this.uploadedBgImageUrl); 
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
  private initForm() {
    let postId = 0;
    let postSlug = '';
    let postBackgroundImage = new FormArray([], [Validators.required]);
    let postHeading = '';
    let postSubHeading = '';
    let postMeta = '';
    let postBody = '';
    let postImageUrls = new FormArray([], [Validators.required]);


    if (this.editMode) {
      const postData = this.blogService.getPost(this.id);
      postId = postData.id;
      postSlug = postData.slug;
      postHeading = postData.heading;
      postSubHeading = postData.subHeading;
      postMeta = postData.meta;
      postBody = postData.body;
      if (postData.backgroundImage) {
        for (let bgImage of postData.backgroundImage) {
          this.urlsBackground.push(bgImage.url);
          postBackgroundImage.push(
            new FormGroup({
              name: new FormControl(bgImage.name, Validators.required),
              url: new FormControl(bgImage.url, Validators.required),
            })
          );
        }
      }

      if (postData['imageurls']) {
        for (let url of postData.imageUrls) {
          this.imageUrlsLocal.push({ base64String: url.url, });
          postImageUrls.push(
            new FormGroup({
              name: new FormControl(url.name, Validators.required),
              url: new FormControl(url.url, Validators.required),
            })
          );
        }
      }
    }


    this.newPostForm = new FormGroup({
      id: new FormControl(postId),
      heading: new FormControl(postHeading, Validators.required),
      subHeading: new FormControl(postSubHeading, Validators.required),
      backgroundImage: postBackgroundImage,
      body: new FormControl(postBody, Validators.required),
      imageUrls: postImageUrls,

    });
    this.dataEmit();
  }

  dataEmit() {
    const posts = this.blogService.getPostsAdded();

    if (posts.length > 0) {
      this.numberOfPosts = posts.length;
      this.isPostAvailable = true;
    } else {
      this.numberOfPosts = 0;
      this.isPostAvailable = false;
    }
  }

  onSubmit() {
    this.submitted = true;
    console.log('Push image file');

    
    for (let i = 0; i < this.uploadedImageUrl.length; i++) {
      (<FormArray>this.newPostForm.get('imageUrls')).push(new FormGroup({
        reference: new FormControl(this.uploadedImageUrl[i].reference, Validators.required),
        name: new FormControl(this.uploadedImageUrl[i].name, Validators.required),
        url: new FormControl(this.uploadedImageUrl[i].url, {
          validators: [Validators.required],
          // asyncValidators: [mimeType]
        })
      }));

    }
    this.newPostForm.get('imageUrls').updateValueAndValidity();


    for (let i = 0; i < this.uploadedBgImageUrl.length; i++) {
      (<FormArray>this.newPostForm.get('backgroundImage')).push(new FormGroup({
        reference: new FormControl(this.uploadedBgImageUrl[i].reference, Validators.required),
        name: new FormControl(this.uploadedBgImageUrl[i].name, Validators.required),
        url: new FormControl(this.uploadedBgImageUrl[i].url, {
          validators: [Validators.required],
          // asyncValidators: [mimeType]
        })
      }));

    }
    this.newPostForm.get('backgroundImage').updateValueAndValidity();
  
    // this.newPostForm.patchValue({
    //   imageUrls: myValue1, 
    //   // formControlName2: myValue2 (can be omitted)
    // });
    if (this.newPostForm.status === 'VALID') {
      if (this.editMode) {
        this.blogService.updatePost(this.id, this.newPostForm.value);
        this.router.navigate(['/search']);
      } else {

        this.blogService.createPost(this.newPostForm.value);
      }

      this.dataEmit()
      //this.onCancel();
      this.reset();

    }else{
      if(this.newPostForm.controls.imageUrls.invalid && this.hasComponentSubmitedPostImages ){

          alert("Please, Make sure images POST are added!!");
          this.hasComponentSubmitedPostImages = false;
        }
        if(this.newPostForm.controls.backgroundImage.invalid && this.hasComponentSubmitedBgImages){
          this.hasComponentSubmitedBgImages = false;
            alert("Please, Make sure images BG are added!!");
          }

    }

  }



  reset() {
    this.submitted = false;
    this.newPostForm.reset();
    this.imageUrlsLocal = [];
    this.urlsBackground = [];

    // this.InputVarSingle.nativeElement.value = "";
    // this.InputVarMultiple.nativeElement.value = "";
    this.errorMessage = null;
    this.successMessage = null;
    this.errorUploadBgMessage = null;
    this.errorUploadMessage = null;
    this.successUploadBgMessage =null;
    this.successUploadMessage=null;
    this.uploadedImageUrl =[];
    this.uploadedBgImageUrl=[];
    this.initForm();
  }




  onCancel() {
    this.router.navigate(['/search'], { relativeTo: this.route });
  }

  removeImage(i) {
    this.imageUrlsLocal.splice(i, 1);
    (<FormArray>this.newPostForm.get('imageUrls')).removeAt(i)
  }

  removeImageBackground(i) {
    this.urlsBackground.splice(i, 1);
    (<FormArray>this.newPostForm.get('backgroundImage')).removeAt(i)

  }



  onSelectFileBackground(event) {
    // if (event.target.files && event.target.files[0]) {
    //   var filesAmount = event.target.files.length;
    //   for (let i = 0; i < filesAmount; i++) {
    //     var reader = new FileReader();

    //     reader.onload = (event: any) => {
    //       if (this.urlsBackground.length > 0) {
    //         this.removeImageBackground(0);
    //       }
    //       this.urlsBackground.push(event.target.result);
    //       (<FormArray>this.newPostForm.get('backgroundImage')).push(new FormGroup({
    //         name: new FormControl("image" + (+1), Validators.required),
    //         url: new FormControl(event.target.result,
    //           Validators.required)
    //       }));
    //     }

    //     reader.readAsDataURL(event.target.files[i]);
    //   }
    // }


    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {

        const file = (event.target as HTMLInputElement).files[i];
        (<FormArray>this.newPostForm.get('backgroundImage')).push(new FormGroup({
          name: new FormControl("image" + (+1), Validators.required),
          url: new FormControl(file, {
            validators: [Validators.required],
            asyncValidators: [mimeType]
          })
        }));
        var reader = new FileReader();
        reader.onload = (eventItem: any) => {
          if (this.urlsBackground.length > 0) {
            this.removeImageBackground(0);
          }
          this.urlsBackground.push(eventItem.target.result);
          this.newPostForm.get('backgroundImage').updateValueAndValidity();
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  onSelectFile(event) {
    // if (event.target.files && event.target.files[0]) {
    //   var filesAmount = event.target.files.length;
    //   for (let i = 0; i < filesAmount; i++) {
    //     var reader = new FileReader();
    //     reader.onload = (event: any) => {
    //       this.imageUrlsLocal.push({ base64String: event.target.result, });
    //       (<FormArray>this.newPostForm.get('imageUrls')).push(new FormGroup({
    //         name: new FormControl("image" + (+1), Validators.required),
    //         url: new FormControl(event.target.result,
    //           Validators.required)
    //       }));

    //     }
    //     reader.readAsDataURL(event.target.files[i]);
    //   }

    // }


    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {

        const file = (event.target as HTMLInputElement).files[i];
        (<FormArray>this.newPostForm.get('imageUrls')).push(new FormGroup({
          name: new FormControl("image" + (+1), Validators.required),
          url: new FormControl(file, {
            validators: [Validators.required],
            asyncValidators: [mimeType]
          })
        }));
        var reader = new FileReader();
        reader.onload = (eventItem: any) => {
          this.imageUrlsLocal.push(eventItem.target.result);
          this.newPostForm.get('imageUrls').updateValueAndValidity();
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }


  }
  // convenience getter for easy access to form fields
  get f() { return this.newPostForm.controls; }

  onNewRecipe(){
    this.router.navigate(['image'], {relativeTo: this.route});

  }


  acceptData(data) {
    console.log(
      "this is the child data displaying in parent component: hasSubmitedImages : ",
      data
    );
    // this.hasSubmitedImages = data;
    this.hasComponentSubmitedBgImages = data;
  }
  acceptPostData(data) {
    console.log(
      "this is the child data displaying in parent component: hasSubmitedImages : ",
      data
    );
    // this.hasSubmitedImages = data;
    this.hasComponentSubmitedPostImages = data;
  }
  componentUploading(data) {
    console.log(
      "this is the child data displaying in parent component: componentUploadingImg : ",
      data
    );
    this.componentUploadingImg = data;
  }
  ngOnDestroy() {
    console.log("=========== unsubscribe post new  =================");
    this.subscription.remove
    this.subscription.unsubscribe();
    this.uploadedBgImageSub.remove;
    this.uploadedBgImageSub.unsubscribe();
    this.uploadedPostImageSub.remove;
    this.uploadedPostImageSub.unsubscribe();

  }

}
