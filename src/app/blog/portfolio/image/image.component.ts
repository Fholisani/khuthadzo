import { OnDestroy } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UploadService } from 'src/app/service/upload.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit, OnDestroy {

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
  subscription: Subscription;
  isLoading = false;
  errorMessage: string=null;
  successMessage: string=null;


  portfolioTypes: any = ['Architecture', 'Hand-Drawing', 'Corousel']

  constructor(private uploadService: UploadService) { }

  ngOnInit(): void {
    this.subscription = this.uploadService.isLoadingChanged
    .subscribe(
      (isLoading: boolean) => {
       this.isLoading = isLoading;
      }
    );

    this.subscription = this.uploadService.errorMessageChanged
    .subscribe(
      (errorMessage: string) => {
        this.errorMessage = errorMessage;
      }
    );

    this.subscription = this.uploadService.successMessageChanged
    .subscribe(
      (successMessage: string) => {
        this.successMessage = successMessage;
      }
    );
    this.initForm();
  }

  dataEmit() {
    const images = this.uploadService.getImagesAdded();
   
    if (images.length > 0) {
      this.numberOfPosts = images.length;
      this.isImgAvailable = true;
    } else {
      this.numberOfPosts = 0;
      this.isImgAvailable = false;
    }
  }

  onSavePost() {
    if (!this.form.valid) {
      return;
    }
    this.form.setValue({
      id: 0,
      title: this.form.value.title,
      description: this.form.value.description,
      portfolioType: this.form.value.portfolioType,
      images: this.form.value.images
    });
   this.uploadService.createImage(this.form.value);
    this.dataEmit()
    this.reset();
  }

  private initForm() {

    let imgId = 0;
    let imgTitle = '';
    let imgDescription = '';
    let imgPortfolioType = '';
    let imgImages = new FormArray([]);

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
        this.imagePreviews.push(eventItem.target.result);
        this.form.get('images').updateValueAndValidity();
      }
      reader.readAsDataURL(file);
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
