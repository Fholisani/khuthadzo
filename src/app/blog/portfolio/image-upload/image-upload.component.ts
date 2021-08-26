import { EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UploadService } from 'src/app/service/upload.service';
import { Image, ImageUrl } from 'src/app/model/image.model';
import { mimeType } from '../image/mime-type.validator';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit, OnDestroy {

  title = 'Angular 10 Upload File';
  public formData = new FormData();
  public selectedFile: File = null;
  public imageSrc: string;
  form: FormGroup;
  imagePreviews = [];
  @ViewChild('takeInput', { static: false })
  InputVarSingle: ElementRef;
  numberOfPosts: number;
  isPostAvailable = false;
  isCreatePost = false;

  isImageUpload=true;
  isImgAvailable: boolean;

  isCreateImg=true;
  private subscription: Subscription;
  showMyContainer: boolean = false;
  
  // isLoading = false;
  // errorMessage: string=null;
  // successMessage: string=null;
  submitted = false;
  @Input() componentUploading: string=null;
  @Input() isMultipleUpload: boolean=true;
  @Input() uploadedImageUrl:  ImageUrl[] =[];
  @Output() submitedImages = new EventEmitter<boolean>();
  @Output() componentCalling = new EventEmitter<string>();
  @Output() portfolioUploading = new EventEmitter<string>();
  // uploadedImageUrl: ImageUrl[] =[];


  @Input() portfolioTypes: any = []



  constructor(private uploadService: UploadService) { }

  ngOnInit(): void {
    console.log("isMultipleUpload : " + this.isMultipleUpload)
    this.uploadService.uploadedDataSource.next([]);
    this.subscription = this.uploadService.isLoadingChanged
    .subscribe(
      (isLoading: boolean) => {
      //  this.isLoading = isLoading;
      }
    );

    this.subscription = this.uploadService.errorMessageChanged
    .subscribe(
      (errorMessage: string) => {
        // this.errorMessage = errorMessage;
      }
    );

    this.subscription = this.uploadService.successMessageChanged
    .subscribe(
      (successMessage: string) => {
        // this.successMessage = successMessage;
      }
    );
    // this.subscription = this.uploadService.imagesAdded
    // .subscribe(
    //   (images: Image) => {
    //     this.dataEmit();
    //   }
    // );
  //  this.uploadedImageSub =this.uploadService.uploadedDataSource 
  //  .subscribe(
  //   (imageUrls: ImageUrl[]) => {
  //     // this.uploadedImageUrl = imageUrls;
  //   }
  // );
    this.initForm();
  }

  dataEmit() {
    //const imageObj = this.uploadService.getImagesAdded();
    this.numberOfPosts = 0;
    this.isImgAvailable = false;
   
    // if (images.length > 0) {
    //   this.numberOfPosts = images.length;
    //   this.isImgAvailable = true;
    // } else {
    //   this.numberOfPosts = 0;
    //   this.isImgAvailable = false;
    // }
  }

  onSavePost() {
    this.submitted = true;
    if (!this.form.valid) {
      return;
    }

 
    this.componentCalling.emit(this.componentUploading);
    this.portfolioUploading.emit(this.form.value.portfolioType);
    this.form.setValue({
      id: 0,
      title: this.form.value.title,
      description: this.form.value.description,
      portfolioType: this.form.value.portfolioType,
      images: this.form.value.images
    });
    if(this.form.value.portfolioType === 'Blog'){
      
      if(this.form.value.images.length > 1){
        this.form.controls['images'].setErrors({'incorrect': true});
        alert("Only one image is allowed for portfolio type BLOG!");     
        return;
      }
    }
    this.uploadService.createImage(this.form.value,this.componentUploading);
    this.dataEmit()
    this.reset();
    this.submitedImages.emit(true);
    this.componentCalling.emit(this.componentUploading);
    this.toggleShow();
    
  }

  private initForm() {

    let imgId = 0;
    let imgTitle = '';
    let imgDescription = '';
    let imgPortfolioType = '';
    let imgImages = new FormArray([], [Validators.required]);

    this.form = new FormGroup({
      id: new FormControl(imgId),
      title: new FormControl(imgTitle, Validators.required),
      description: new FormControl(imgDescription, Validators.required),
      portfolioType: new FormControl(imgPortfolioType, Validators.required),
      images: imgImages,

    });
    this.dataEmit();
  }


  onSelect(event) {

    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {

        const file = (event.target as HTMLInputElement).files[i];
        (<FormArray>this.form.get('images')).push(new FormGroup({
          image: new FormControl(file, {
            validators: [Validators.required],
            asyncValidators: [mimeType]
          })
        }));
        var reader = new FileReader();
        reader.onload = (eventItem: any) => {
          if(!this.isMultipleUpload){
            this.imagePreviews = [];
          }
          this.imagePreviews.push(eventItem.target.result);
          this.form.get('images').updateValueAndValidity();
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }

  }


  changePortfolio(e) {
    console.log(e.value)
  
    this.form.value.portfolioType.setValue(e.target.value, {
      onlySelf: true
    })
  }
  removeImage(i) {
    this.imagePreviews.splice(i, 1);
    (<FormArray>this.form.get('images')).removeAt(i);

  }

  reset() {
    this.submitted = false;
    this.form.reset();
    this.imagePreviews = [];
    this.InputVarSingle.nativeElement.value = "";
    this.initForm();
  }

  isHovering: boolean;

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
    
      const file = files.item(i);
      (<FormArray>this.form.get('images')).push(new FormGroup({
        image: new FormControl(file, {
          validators: [Validators.required],
          asyncValidators: [mimeType]
        })
      }));

      var reader = new FileReader();
      reader.onload = (eventItem: any) => {
        if(!this.isMultipleUpload){
          this.imagePreviews = [];
        }
        this.imagePreviews.push(eventItem.target.result);
        this.form.get('images').updateValueAndValidity();
      }
      reader.readAsDataURL(file);
    }
  }
   // convenience getter for easy access to form fields
   get f() { return this.form.controls; }

   onNewRecipe(){
    // this.router.navigate(['image'], {relativeTo: this.route});

  }
  toggleShow() {

    this.showMyContainer = ! this.showMyContainer;
    
    }
    onCancel(){

      this.reset();
      this.toggleShow();
    }
  ngOnDestroy() {
    console.log("=========== unsubscribe image upload 1 =================");
    this.subscription.remove;
    this.subscription.unsubscribe();
    // this.uploadedImageSub.unsubscribe();
  }

}
