import { OnDestroy, OnInit } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { NgRecaptcha3Service } from 'ng-recaptcha3';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { AuthService, AuthResponseData } from './auth.service';
declare var gtag: Function;
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit,AfterViewInit, OnDestroy {

  isLoginMode = true;
  isLoading = false;
  error: string = null;
  authObs: Observable<AuthResponseData>;


  formData: any;

  constructor(private authService: AuthService, private router: Router,
    private recaptcha3: NgRecaptcha3Service) {}
 
  ngOnInit(): void {
    this.recaptcha3.init(environment.siteKey);
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    //let authObs: Observable<AuthResponseData>;

    this.isLoading = true;

    if (this.isLoginMode) {
      this.recaptcha3.getToken({action: 'login'}).then(
        token => {
         
          console.log("email : " + email + " - password : " + password +  " - token : "+ token );
          // Handle saving form data
          // this.myHttpService.login(this.formData).subscribe(response => {
          //
          // });
          this.authService.login(email, password, token).subscribe(
            resData => {
              console.log(resData);
              this.isLoading = false;
              this.router.navigate(['/home']);
            },
            errorMessage => {
              console.log(errorMessage);
              this.error = errorMessage;
              this.isLoading = false;
            }
          );
      

        },
        error => {
          // handle error here
          this.isLoading = false
          this.error = "Service is currently unavailable. Try again later!";
          console.log(error);
        }
      );


    } else {
      alert('Signup funtionality unavailable');
      this.isLoading = false;
     // authObs = this.authService.signup(email, password);
    }

    // this.authObs.subscribe(
    //   resData => {
    //     console.log(resData);
    //     this.isLoading = false;
    //     this.router.navigate(['/home']);
    //   },
    //   errorMessage => {
    //     console.log(errorMessage);
    //     this.error = errorMessage;
    //     this.isLoading = false;
    //   }
    // );

    form.reset();
  }
  ngOnDestroy(): void {
    this.recaptcha3.destroy();
    this.routerSubscription.unsubscribe();
  }

  private routerSubscription: Subscription;
  ngAfterViewInit(): void {
    // subscribe to router events and send page views to Google Analytics
   
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        gtag('config', 'UA-178909230-1', {'page_path': event.urlAfterRedirects});
      });
  }


}
