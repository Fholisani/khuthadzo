import { OnDestroy } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { element } from 'protractor';
import { Subscription } from 'rxjs';
import { ContetFile } from 'src/app/model/content-file.model';
import { Image, ImageUrl } from 'src/app/model/image.model';
import { PostUpdate } from 'src/app/model/post-update.model';
import { Post } from 'src/app/model/post.model';
import { RemoveImg } from 'src/app/model/remove-img.model';
import { BlogService } from 'src/app/service/blog-service.service';
import { UploadService } from 'src/app/service/upload.service';
import { AlertMessageComponent } from 'src/app/shared/alert-message/alert-message.component';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { mimeType } from '../../portfolio/image/mime-type.validator';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit, OnDestroy {
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
  imageObj: Image;
  uploadedImageUrl: ImageUrl[] = [];
  uploadedBgImageUrl: ImageUrl[] = [];
  takeContentImage: Image;
  // hasSubmitedImages = false;
  hasComponentSubmitedBgImages = false;
  hasComponentSubmitedPostImages = false;
  componentUploadingImg: string = null;
  isMultipleUpload: boolean = true;
  isMultipleBgUpload: boolean = false;
  showMyContainer: boolean = false;

  // ViewChild is used to access the input element.

  @ViewChild('takeInput', { static: false })


  // this InputVar is a reference to our input.

  InputVarSingle: ElementRef;

  @ViewChild('takeMultipleInput', { static: false })
  InputVarMultiple: ElementRef;
  private subscriptionContetFileBg: Subscription;
  private subscriptionContetFileBgDelete: Subscription;
  private subscriptionFileImageBgObjDelete: Subscription;
  private subscriptionFileImagePostObjDelete: Subscription;
  private subscriptionContetFilePostDelete: Subscription;
  private subscriptionContetFilePost: Subscription;
  private contentImageListBgAddedSub: Subscription;
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
  private uploadedPostImageSub: Subscription;
  private uploadedBgImageSub: Subscription;
  componentBgUploading: string = 'backgroundImg';
  private subscription: Subscription;
  private subscriptionPostUpdateChanged: Subscription;
  private subscriptionComponent: Subscription;
  @ViewChild('app-alert-message') childAlertMessageComponent: AlertMessageComponent;
  uploadedContentImageBg: ContetFile[] = [];
  uploadedContentImagePost: ContetFile[] = [];
  contentImagesBgAddedSub: Subscription;
  contentImagesPostAddedSub: Subscription;
  updatedContent: ContetFile = null;
  constructor(private uploadService: UploadService,
    private fb: FormBuilder,
    private blogService: BlogService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private dataStorageService: DataStorageService,) { }
  ngOnDestroy(): void {
    console.log("=====POST EDIT GO AHEAD AND REMOVE SUSBCRIPTIONS=====");

    if (this.contentImagesBgAddedSub) {
      this.contentImagesBgAddedSub.remove;
      this.contentImagesBgAddedSub.unsubscribe();
    }
  
    if (this.contentImagesPostAddedSub) {
      this.contentImagesPostAddedSub.remove;
      this.contentImagesPostAddedSub.unsubscribe();
    }
    if(this.subscriptionContetFileBgDelete){
      this.subscriptionContetFileBgDelete.remove;
      this.subscriptionContetFileBgDelete.unsubscribe();
    }

  
    if(this.subscriptionFileImageBgObjDelete){
      this.subscriptionFileImageBgObjDelete.remove;
      this.subscriptionFileImageBgObjDelete.unsubscribe();
    }
    //
    if(this.subscriptionFileImagePostObjDelete){
      this.subscriptionFileImagePostObjDelete.remove;
      this.subscriptionFileImagePostObjDelete.unsubscribe();
    }
    if(this.subscriptionContetFilePostDelete){
      this.subscriptionContetFilePostDelete.remove;
      this.subscriptionContetFilePostDelete.unsubscribe();
    }
    // if(this.subscriptionContetFileBg){
    this.subscriptionContetFileBg.remove;
    this.subscriptionContetFileBg.unsubscribe();
    // } 
    // if(this.subscriptionContetFilePost){
    this.subscriptionContetFilePost.remove
    this.subscriptionContetFilePost.unsubscribe();
    // } 
    if (this.subscriptionComponent) {
      this.subscriptionComponent.unsubscribe();;
    }
    if (this.contentImageListBgAddedSub) {
      this.contentImageListBgAddedSub.unsubscribe();
    }

    if(this.subscriptionPostUpdateChanged){
      this.subscriptionPostUpdateChanged.unsubscribe();
    }

    this.subscription.remove
    this.subscription.unsubscribe();
    this.uploadedBgImageSub.remove;
    this.uploadedBgImageSub.unsubscribe();
    this.uploadedPostImageSub.remove;
    this.uploadedPostImageSub.unsubscribe();

  }

  ngOnInit(): void {



    console.log();
    //TODO Below code might not be required
    this.subscriptionContetFileBg = this.uploadService.fileImageBgChanged.subscribe(
      (imageFileContent: ContetFile[]) => {

        // this.uploadedContentImageBg = imageFileContent;
        this.uploadedContentImageBg = this.uploadService.getBgFilesUploaded();

      }
    );
    //fileImageBgDelete
    this.subscriptionContetFileBgDelete = this.uploadService.fileImageBgDelete.subscribe(
      (imageFileContent: ContetFile[]) => {
        console.log("Deleted the image file by sending to the service : "  + imageFileContent);
       // this.successUploadMessage = "Succesfully deleted the Image!!";
        // this.uploadedContentImageBg = imageFileContent;
       // this.uploadedContentImageBg = this.uploadService.getBgFilesUploaded();


      }
    );
    //fileImageBgDeleteLocalIndex
    //fileImageBgDelete
    this.subscriptionContetFileBgDelete = this.uploadService.fileImageBgDeleteLocalIndex.subscribe(
      (removeImg: RemoveImg) => {
        console.log("Deleted the image file at local Index : "  + removeImg.index);

        // this.uploadedContentImageBg = imageFileContent;
        this.onDeleteImg(removeImg, 'backgroundImg');
     
       

      }
    );

    //
    this.subscriptionFileImageBgObjDelete = this.uploadService.fileImageBgObjDelete.subscribe(
      (contentFile: ContetFile) => {
        console.log("Deleted the image file at local Index : "  + contentFile);

   //     this.onDeleteImg(contentFile);
      }
    );

    this.subscriptionFileImagePostObjDelete = this.uploadService.fileImagePostObjDelete.subscribe(
      (contentFile: ContetFile) => {
        console.log("Deleted the image file at local Index : "  + contentFile);

      //  this.onDeleteImg(contentFile);
      }
    );

    this.subscriptionContetFilePost = this.uploadService.fileImagePostChanged.subscribe(
      (imageFileContent: ContetFile[]) => {

        // this.uploadedContentImagePost = imageFileContent;
        this.uploadedContentImagePost = this.uploadService.getPostFilesUploaded();

      }
    );

    //fileImageBgDelete
    this.subscriptionContetFilePostDelete = this.uploadService.fileImagePostDelete.subscribe(
      (imageFileContent: ContetFile[]) => {
        console.log("Deleted the image file by sending to the service : "  + imageFileContent);
       // this.successUploadMessage = "Succesfully deleted the Image!!";
        // this.uploadedContentImageBg = imageFileContent;
       // this.uploadedContentImageBg = this.uploadService.getBgFilesUploaded();


      }
    );
    //fileImageBgDeleteLocalIndex
    //fileImageBgDelete
    this.subscriptionContetFilePostDelete = this.uploadService.fileImagePostDeleteLocalIndex.subscribe(
      (removeImg: RemoveImg) => {
        console.log("Deleted the image file at local Index : "  + removeImg.index);

        // this.uploadedContentImageBg = imageFileContent;
        this.onDeleteImg(removeImg,'postImg');
       
       

      }
    );
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
     
      this.initForm();
    });
    // let uplImage =[];
    // if(this.uploadedContentImage){
    //   for(let el of this.uploadedContentImage){
    //    // this.uploadedContentImage.push(el);
    //     uplImage.push(el);
    //     break;

    //   }
    // }
    // this.uploadedContentImage = uplImage;
    this.contentImageListBgAddedSub = this.uploadService.contentImageListBgAdded.subscribe(
      (imageFileContent: ContetFile) => {
        if (imageFileContent) {
          imageFileContent.postId = this.id;
          this.uploadService.addFileBg(imageFileContent);
          //this.uploadService.
        }
      }
    );

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
    this.subscriptionPostUpdateChanged = this.blogService.postUpdateChanged
      .subscribe(
        (post: PostUpdate) => {
          //Call the serice to updateCall
          
          this.onUpdateData();
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
          if (image !== null) {

            console.log("Post image only if its the correct component" + this.componentUploadingImg);
            if (this.componentUploadingImg === 'backgroundImg') {
              if (this.uploadedBgImageUrl.length < 1) {
                this.imageObj = image;
                this.onSaveDataImg();
              } else {

                this.errorUploadBgMessage = "Only one backgroud image can be uploaded!";
                if(this.successUploadBgMessage){
                  this.successUploadBgMessage = null;
                }
              }


            }
            if (this.componentUploadingImg === 'postImg') {

              this.imageObj = image;
              this.onSaveDataImg();
            }

          } else {
            console.log("Should not upload -Images just cleaned up - " + this.componentUploadingImg);
          }
        }
      );
    // this.imageObj = this.uploadService.getImagesAdded();


    this.uploadedPostImageSub = this.uploadService.imagesPostAdded
      .subscribe(
        (image: Image) => {
          if (image !== null) {
            console.log("Post image only if its the correct component - navItem" + this.componentUploadingImg);
            if (this.componentUploadingImg === 'postImg'
              || this.componentUploadingImg === 'backgroundImg') {

              this.imageObj = image;
              this.onSaveDataImg();
            }
          } else {
            console.log("Should not upload -Images just cleaned up - " + this.componentUploadingImg);
          }
        }
      );


    this.subscription = this.uploadService.isLoadingChanged
      .subscribe(
        (isLoading: boolean) => {
          this.isUploadLoading = false;
          this.isUploadBgLoading = false;
          if (this.componentUploadingImg === 'postImg') {
            this.isUploadLoading = isLoading;

          }
          if (this.componentUploadingImg === 'backgroundImg') {
            this.isUploadBgLoading = isLoading;
          }

        }
      );

    this.subscription = this.uploadService.errorMessageChanged
      .subscribe(
        (errorMessage: string) => {
          if (this.componentUploadingImg === 'postImg') {
            this.errorUploadMessage = errorMessage;
          }
          if (this.componentUploadingImg === 'backgroundImg') {
            this.errorUploadBgMessage = errorMessage;
          }
          // if(this.errorUploadBgMessage){
          //   this.errorUploadBgMessage = null;
          // }

        }
      );

    this.subscription = this.uploadService.successMessageChanged
      .subscribe(
        (successMessage: string) => {
          if (this.componentUploadingImg === 'postImg') {
            this.successUploadMessage = successMessage;
          }
          if (this.componentUploadingImg === 'backgroundImg') {
            this.successUploadBgMessage = successMessage;
          }

        }
      );

    this.subscriptionComponent = this.uploadService.componentCallingFileEdit
      .subscribe(
        (componentCalling: string) => {
          this.componentUploadingImg = componentCalling;
        }
      );
      
    this.contentImagesBgAddedSub = this.uploadService.contentImagesBgAdded
      .subscribe(
        (image: ContetFile) => {
          if (image !== null) {
            console.log("Post image only if its the correct component - navItem" + this.componentUploadingImg);
            if (this.componentUploadingImg === 'backgroundImg') {

              // this.imageObj = image;
              this.onUpdateContentImg();
            }
          } else {
            console.log("Should not upload -Images just cleaned up - " + this.componentUploadingImg);
          }
        }
      );


      this.contentImagesPostAddedSub = this.uploadService.contentImagesPostAdded
      .subscribe(
        (image: ContetFile) => {
          if (image !== null) {
            console.log("Post image only if its the correct component - navItem" + this.componentUploadingImg);
            if (this.componentUploadingImg === 'postImg') {

              // this.imageObj = image;
              this.onUpdateContentImg();
            }
          } else {
            console.log("Should not upload -Images just cleaned up - " + this.componentUploadingImg);
          }
        }
      );

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


  onUpdateContentImg() {
    console.log(" ======Calling from POST-EDIT Image component======= : " + this.componentUploadingImg);

    this.subscription = this.dataStorageService.updateContentImages(this.componentUploadingImg)
      .subscribe(
        (response: ContetFile) => {
          console.log(response + " : Testing 1 0 1");

          let ms = response;

          if (this.componentUploadingImg === 'postImg') {


            this.uploadService.setLoadingIndicator(false);
            this.uploadService.setSuccessMessage("Uploaded successfully");
            this.uploadService.setErrorMessage(null);
            this.uploadedContentImagePost.forEach(el => {
              if (el.contentId === response.contentId) {
                el.tittle = response.tittle;
                el.description = response.description;
              }
            });

          }

          if (this.componentUploadingImg === 'backgroundImg') {


            this.uploadService.setLoadingIndicator(false);
            this.uploadService.setSuccessMessage("Uploaded successfully");
            this.uploadService.setErrorMessage(null);
            this.uploadedContentImageBg.forEach(el => {
              if (el.contentId === response.contentId) {
                el.tittle = response.tittle;
                el.description = response.description;
              }
            });
          }

       

        },
        errorMessage => {
          console.log('HTTP Error', errorMessage)
          let errMsg = `Unable to post due to `;
          if (errorMessage == undefined) {

            errMsg += ' service unavailable! '
          } else {
            errMsg += `${errorMessage.message}`
          }

          this.uploadService.setErrorMessage(errMsg);
          this.uploadService.setSuccessMessage(null);
          this.uploadService.setLoadingIndicator(false);

        });


    // this.router.navigate(['../'], { relativeTo: this.route });
  }


  onUpdateData() {
    this.dataStorageService.updatePost()
      .subscribe(
        response => {
          console.log(response);        
          this.blogService.setLoadingIndicator(false);
          this.blogService.setSuccessMessage("Update successfully");
          this.blogService.setErrorMessage(null);
          //Fire another event to get latest ResponseDetails
          //this.onFetchData(this.id);
        },
        errorMessage => {
          console.log('HTTP Error', errorMessage)
          let errMsg = `Unable to save due to  ${errorMessage.message}()`;
          this.blogService.setErrorMessage(errMsg);
          this.blogService.setLoadingIndicator(false);
          this.blogService.setSuccessMessage(null);
          
        });
  }

  onSaveDataImg() {
    console.log(" ======Calling from POST-NEW component======= : " + this.componentUploadingImg);

    this.subscription = this.dataStorageService.saveImages(this.componentUploadingImg)
      .subscribe(
        response => {
          console.log(response[0][0] + " : Testing 1 0 1");

          let ms = response[0][0];

          if (this.componentUploadingImg === 'postImg') {
            ms.imageUrls.forEach(element => {
              console.log(element + " : Testing 1 0 1 element");
              element.description = ms.description;
              this.uploadedImageUrl.push(element);

              
              this.uploadedContentImagePost.push(new ContetFile(+element.contentId,this.id,
                element.reference,element.url,element.description,ms.portfolioType,ms.tittle));
              
            });

            this.uploadService.uploadedImgDataSource(this.uploadedImageUrl);
            this.uploadService.cleanImages();
            this.uploadService.cleanPostImages();
            this.uploadService.cleanBgImages();
            this.uploadService.setLoadingIndicator(false);
            this.uploadService.setSuccessMessage("Uploaded successfully");
            this.uploadService.setErrorMessage(null);

          }

          if (this.componentUploadingImg === 'backgroundImg') {
            ms.imageUrls.forEach(element => {
              console.log(element + " : Testing 1 0 1 element");
              element.description = ms.description;
              this.uploadedBgImageUrl.push(element);
              
              this.uploadedContentImageBg.push(new ContetFile(+element.contentId,this.id,
                element.reference,element.url,element.description,ms.portfolioType,ms.tittle));
            });
            this.takeContentImage = this.uploadService.getImagesBgAdded();
            //this.uploadService.updateFileList(this.takeContentImage, this.componentUploadingImg, this.uploadedBgImageUrl[0]);
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
          if (errorMessage == undefined) {

            errMsg += ' service unavailable! '
          } else {
            errMsg += `${errorMessage.message}`
          }

          this.uploadService.setErrorMessage(errMsg);
          this.uploadService.setSuccessMessage(null);
          this.uploadService.setLoadingIndicator(false);

        });


    // this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDeleteImg(removeImg : RemoveImg,componentUploadingImg){
    this.subscription = this.dataStorageService.deleteImage(removeImg.contentFile)
    .subscribe(
      response => {
      
        this.uploadService.setLoadingIndicator(false);
        this.uploadService.setSuccessMessage(null);
        this.uploadService.setErrorMessage(null);
        if (componentUploadingImg === 'postImg') {
          this.removeImagePostV2(removeImg.index);
          this.successUploadMessage = "Succesfully deleted the Image!!";
        }
        if (componentUploadingImg === 'backgroundImg') {
          this.removeImageBackgroundV2(removeImg.index);
          this.successUploadBgMessage = "Succesfully deleted the Image!!";
        }


      },
      errorMessage => {
        console.log('HTTP Error', errorMessage)
        let errMsg = `Unable to delete due to `;
        if (errorMessage == undefined) {

          errMsg += ' service unavailable! '
        } else {
          errMsg += `${errorMessage.message}`
        }

        this.uploadService.setErrorMessage(errMsg);
        this.uploadService.setSuccessMessage(null);
        this.uploadService.setLoadingIndicator(false);
        if (componentUploadingImg === 'postImg') {
          this.errorUploadMessage = "Failed to delete the image!!";
        }
        if (componentUploadingImg === 'backgroundImg') {
          this.errorUploadBgMessage = "Failed to delete the image!!";
        }
        

      });
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

    this.uploadService.cleanAddFileBg();
    this.uploadService.cleanAddFilePost();

    if (this.editMode) {
      const postData = this.blogService.getPostDetailResponse();

      postData.contentFilesBg.forEach(element => {
        this.uploadService.addFileBg(element);
        this.uploadedBgImageUrl.push(new ImageUrl(element.tittle, element.url, element.reference,element.contentId+''));

      });
      postData.contentFilesPost.forEach(element => {
        this.uploadService.addFilePost(element);
        //this.uploadedImageUrl.push(new ImageUrl(element.tittle,element.url, element.reference));
      });

      postId = +postData.postId;
      // postSlug = postData.slug;
      postHeading = postData.heading;
      postSubHeading = postData.subHeading;
      // postMeta = postData.meta;
      postBody = postData.body;

      // if (postData.backgroundImage) {
      //   for (let bgImage of postData.backgroundImage) {
      //     this.urlsBackground.push(bgImage.url);
      //     postBackgroundImage.push(
      //       new FormGroup({
      //         name: new FormControl(bgImage.name, Validators.required),
      //         url: new FormControl(bgImage.url, Validators.required),
      //       })
      //     );
      //   }
      // }

      // if (postData['imageurls']) {
      //   for (let url of postData.imageUrls) {
      //     this.imageUrlsLocal.push({ base64String: url.url, });
      //     postImageUrls.push(
      //       new FormGroup({
      //         name: new FormControl(url.name, Validators.required),
      //         url: new FormControl(url.url, Validators.required),
      //         //reference: new FormControl(url.reference, Validators.required),
      //       })
      //     );
      //   }
      // }
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

    (<FormArray>this.newPostForm.get('imageUrls')).clear();
    for (let i = 0; i < this.uploadedContentImagePost.length; i++) {
      (<FormArray>this.newPostForm.get('imageUrls')).push(new FormGroup({
        reference: new FormControl(this.uploadedContentImagePost[i].reference, Validators.required),
        name: new FormControl(this.uploadedContentImagePost[i].tittle, Validators.required),
        url: new FormControl(this.uploadedContentImagePost[i].url, {
          validators: [Validators.required],
          // asyncValidators: [mimeType]
        })
      }));

    }
    this.newPostForm.get('imageUrls').updateValueAndValidity();
    // const postData = this.blogService.getPostDetailResponse();

    // postData.contentFilesBg.forEach(element => {

    //   this.uploadedBgImageUrl.push(new ImageUrl(element.tittle, element.url, element.reference, element.contentId+''));

    // });
    (<FormArray>this.newPostForm.get('backgroundImage')).clear();
    for (let i = 0; i < this.uploadedContentImageBg.length; i++) {
      (<FormArray>this.newPostForm.get('backgroundImage')).push(new FormGroup({
        reference: new FormControl(this.uploadedContentImageBg[i].reference, Validators.required),
        name: new FormControl(this.uploadedContentImageBg[i].tittle, Validators.required),
        url: new FormControl(this.uploadedContentImageBg[i].url, {
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
      this.errorUploadBgMessage = null;
        this.errorUploadMessage = null;
        this.successUploadBgMessage = null;
        this.successUploadMessage = null;
       
      if (this.editMode) {
        
        this.blogService.updatePost(new PostUpdate(this.id, this.newPostForm.value));
       // this.router.navigate(['/search']);
      } else {

        this.blogService.createPost(this.newPostForm.value);
      }

      this.dataEmit()
      //this.onCancel();
     // this.reset();
        

    } else {
      this.successUploadBgMessage = null;
      this.successUploadMessage = null;
      if (this.newPostForm.controls.imageUrls.invalid && this.hasComponentSubmitedPostImages) {

        alert("Please, Make sure images POST are added!!");
        this.hasComponentSubmitedPostImages = false;
      }
      if (this.newPostForm.controls.backgroundImage.invalid && this.hasComponentSubmitedBgImages) {
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
    this.successUploadBgMessage = null;
    this.successUploadMessage = null;
    this.uploadedImageUrl = [];
    this.uploadedBgImageUrl = [];
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
  removeImageBackgroundV2(i) {
    this.uploadedBgImageUrl.splice(i,1);
    this.uploadedContentImageBg.splice(i,1);
   
  }

  removeImagePostV2(i) {
    this.uploadedImageUrl.splice(i,1);
    this.uploadedContentImagePost.splice(i,1);
   
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
  onNewRecipe() {
    this.router.navigate(['image'], { relativeTo: this.route });

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
      "Edit this is the child data displaying in parent component: componentUploadingImg : ",
      data
    );
    this.componentUploadingImg = data;
  }
  toggleShow() {

    this.showMyContainer = ! this.showMyContainer;
    
    }

    showImgPostContainer(){
  //    this.router.navigate(['postImg'],{relativeTo: this.route});
    }
    showImgBgContainer(){
 //     this.router.navigate(['backgroundImage'],{relativeTo: this.route});

    }

    onFetchData(postId: number) {
      this.blogService.setLoadingIndicator(true);
      return this.dataStorageService.fetchDetailPosts(postId).subscribe(postDetail => {
  
        this.blogService.setPostDetailResponse(postDetail);
      
        this.blogService.setLoadingIndicator(false);
        this.initForm();
      }, errorMessage => {
  
        console.log('HTTP Error', errorMessage)
        let errMsg = `Unable to retrieve blog post due to  ${errorMessage}()`;
        this.blogService.setErrorMessage(errMsg);
        this.blogService.setLoadingIndicator(false);
      });
    }
}
