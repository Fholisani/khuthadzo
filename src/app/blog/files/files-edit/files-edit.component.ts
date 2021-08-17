import { EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UploadService } from 'src/app/service/upload.service';
import { mimeType } from '../../portfolio/image/mime-type.validator';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ContetFile } from 'src/app/model/content-file.model';


@Component({
  selector: 'app-files-edit',
  templateUrl: './files-edit.component.html',
  styleUrls: ['./files-edit.component.css']
})
export class FilesEditComponent implements OnInit, OnDestroy {

  Tittle = 'Angular 10 Upload File';
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

  isMultipleUpload: boolean=true;
  @Input() uploadedContentImage:  ContetFile[] =[];
  @Output() submitedImages = new EventEmitter<boolean>();
  @Output() componentCalling = new EventEmitter<string>();
  // uploadedImageUrl: ImageUrl[] =[];


  @Input() portfolioTypes: any = [];

  id: number;
  editMode = false;
  componentUploadingImg: string;
  extractedPostId: number = 0;
  public href: string = null;
  constructor(private route: ActivatedRoute,private router: Router,
    private uploadService: UploadService) { }

  ngOnInit(): void {
    console.log("isMultipleUpload : " + this.isMultipleUpload)

    this.href = this.router.url;
    console.log(this.router.url);
    if(this.href !== null){
      //Extract id after /post/0/...
      let extractedPt = this.href.split('/')[2];
      this.extractedPostId = +extractedPt;
    }
   

    this.uploadService.uploadedDataSource.next([]);

    this.route.params.subscribe(
      (params : Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.componentUploadingImg=params['id2'];
        if(params['component']){
          this.componentUploadingImg=params['component'];
        }
        console.log("Is edit mode : " + this.editMode + " : " + this.componentUploadingImg);
        if(this.componentUploadingImg==='postImg'){
          this.portfolioTypes =['Post']
          this.isMultipleUpload =true;
        }
        if(this.componentUploadingImg==='upload'){
          this.portfolioTypes =['Carousel','HandDrawing', 'Architecture' ]
          this.isMultipleUpload =true;
        }
        if(this.componentUploadingImg==='backgroundImg'){
          this.portfolioTypes =['Background']
          this.isMultipleUpload =false;
        }
        this.initForm();
      }
    );


    // this.subscription = this.uploadService.isLoadingChanged
    // .subscribe(
    //   (isLoading: boolean) => {
    //   //  this.isLoading = isLoading;
    //   }
    // );

    // this.subscription = this.uploadService.errorMessageChanged
    // .subscribe(
    //   (errorMessage: string) => {
    //     // this.errorMessage = errorMessage;
    //   }
    // );

    // this.subscription = this.uploadService.successMessageChanged
    // .subscribe(
    //   (successMessage: string) => {
    //     // this.successMessage = successMessage;
    //   }
    // );
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
   // this.initForm();
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
    this.componentCalling.emit(this.componentUploadingImg);
    this.uploadService.componentCallingSource (this.componentUploadingImg);
    if(this.editMode){
      this.form.setValue({
        contentId: this.form.value.contentId,
        postId: this.form.value.postId,
        url: this.form.value.url,
        reference: this.form.value.reference,
        description: this.form.value.description,
        portfolioType: this.form.value.portfolioType,
        tittle: this.form.value.tittle,
      });
      
      this.uploadService.updateImage(this.form.value,this.componentUploadingImg);

    }else{
      this.form.setValue({
        id: 0,
        tittle: this.form.value.tittle,
        description: this.form.value.description,
        portfolioType: this.form.value.portfolioType,
        images: this.form.value.images,
        postId: this.form.value.postId,
      });
      this.uploadService.createImage(this.form.value,this.componentUploadingImg);
      

    }
    

    

    this.dataEmit()
    if(!this.editMode){
      this.reset();
    }
    
    this.submitedImages.emit(true);
    this.toggleShow();
    
  }

  private initForm() {

    let imgId = 0;
    let imgPostId = 0;
    let imgUrl = '';
    let imgReference = '';
    let imgDescription = '';
    let imgPortfolioType = '';
    let imgTittle = '';
   
    //let imgImages = new FormArray([], [Validators.required]);

    if(this.editMode){
      console.log("Componet to editing details : " + this.componentUploadingImg);
      let image;
      if(this.componentUploadingImg==='postImg'){
        image = this.uploadService.getPostFileUploaded(this.id);
        this.isMultipleUpload =true;
      }
      if(this.componentUploadingImg==='upload'){
       //Not yet implemented
      }
      if(this.componentUploadingImg==='backgroundImg'){
        image = this.uploadService.getBgFileUploaded(this.id);
        this.isMultipleUpload =false;
      }
     
      imgId = image.contentId;
      imgPostId =image.postId;
      imgTittle = image.tittle;
      imgReference=image.reference;
      imgDescription = image.description;
      imgUrl =image.url;
      imgPortfolioType = image.portfolioType;

      this.form = new FormGroup({
        contentId: new FormControl(imgId),
        postId: new FormControl(imgPostId),
        tittle: new FormControl(imgTittle, Validators.required),
        description: new FormControl(imgDescription, Validators.required),
        portfolioType: new FormControl(imgPortfolioType, Validators.required),
        url: new FormControl(imgUrl),
        reference: new FormControl(imgReference),
       // images: imgImages,
  
      });
  
    }else{
      let imgId = 0;
      let imgTittle = '';
      let imgDescription = '';
      let imgPortfolioType = '';
      let imgImages = new FormArray([], [Validators.required]);
  
      this.form = new FormGroup({
        id: new FormControl(imgId),
        tittle: new FormControl(imgTittle, Validators.required),
        description: new FormControl(imgDescription, Validators.required),
        portfolioType: new FormControl(imgPortfolioType, Validators.required),
        images: imgImages,
        postId: new FormControl(this.extractedPostId),
  
      });
    }

 
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
    if(!this.editMode){
      this.InputVarSingle.nativeElement.value = "";
    }
  
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
    if( this.subscription){
      this.subscription.remove;
      this.subscription.unsubscribe();
    }
   
    // this.uploadedImageSub.unsubscribe();
  }


}
