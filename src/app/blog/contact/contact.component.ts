import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgRecaptcha3Service } from 'ng-recaptcha3';
import { Subscription } from 'rxjs';
import { BlogService } from 'src/app/service/blog-service.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';



@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {

  isLoading = false;
  errorMessage: string = null;
  successMessage: string = null;
  contactUsForm: FormGroup;
  submitted = false;
  subscription: Subscription;
  
  private siteKey = "6LdBzXsbAAAAAIlawAHSrx_E0dHcHVeMs6_wBt6P";
  formData: any;
  constructor(private recaptcha3: NgRecaptcha3Service,
    private dataStorageService: DataStorageService,
    private blogService: BlogService) { }

  ngOnInit(): void {
    this.initForm();
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
  }

  onSubmit() {
    this.submitted = true;
    this.blogService.setErrorMessage(null);
    this.blogService.setSuccessMessage(null);
    if (this.contactUsForm.status === 'VALID') {
      this.isLoading = true;
      this.recaptcha3.getToken({action: 'ContactUs'}).then(
        token => {
          this.formData = this.contactUsForm.value;
          this.formData.recaptchaToken = token;
          console.log(this.formData);
          // Handle saving form data
          // this.myHttpService.login(this.formData).subscribe(response => {
          //
          // });
          this.dataStorageService.contactUs(this.formData).subscribe(
            resData => {
              console.log(resData);
              this.isLoading = false;
              this.blogService.setLoadingIndicator(false);
              this.blogService.setSuccessMessage("Created successfully");
              this.blogService.setErrorMessage(null);
              this.reset();
              
            },
            errorMessage => {
              console.log(errorMessage);
              this.isLoading = false;
              this.blogService.setErrorMessage(errorMessage);
              this.blogService.setSuccessMessage(null);
              this.blogService.setLoadingIndicator(false);
            }
          );
          

        },
        error => {
          // handle error here
          console.log(error);
          this.isLoading = false;
          this.blogService.setErrorMessage("Service is currently unavailable. Try again later!");
          this.blogService.setSuccessMessage(null);
          this.blogService.setLoadingIndicator(false);
        }
      );


      //this.blogService.contactUs(this.contactUsForm.value);
      


      
    }

    
   

  }

  private initForm() {
    let contactName = '';
    let contactEmail = '';
    let contactPhoneNumber = '';
    let contactMessage = '';
    this.contactUsForm = new FormGroup({
      name: new FormControl(contactName, Validators.required),
      email: new FormControl(contactEmail, [Validators.required, Validators.email]),
      phoneNumber: new FormControl(contactPhoneNumber, [Validators.required,
      Validators.pattern("^[0-9]*$"), Validators.minLength(10),
      Validators.maxLength(10)]),
      message: new FormControl(contactMessage, Validators.required),
      
    });
    this.recaptcha3.init(this.siteKey);

  }

  //only number will be add
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  // convenience getter for easy access to form fields
  get f() { return this.contactUsForm.controls; }

  reset() {
    this.submitted = false;
    this.contactUsForm.reset();

  }
  ngOnDestroy(): void {
    this.recaptcha3.destroy();
    this.subscription.unsubscribe();
  }

}
