import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgRecaptcha3Service } from 'ng-recaptcha3';
import { BlogService } from 'src/app/service/blog-service.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
declare var gtag: Function;
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit,AfterViewInit, OnDestroy {

  searchForm: FormGroup;
  private routerSubscription: Subscription;
  formData: any;
  closeResult: string;
  error: string = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataStorageService: DataStorageService,
    private blogService: BlogService,
    private recaptcha3: NgRecaptcha3Service,
    private modalService: NgbModal,
  
  ) { 

    console.log(this.router.url); //  /routename
  }
  ngOnDestroy(): void {
    if(this.routerSubscription){
      this.routerSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit(content) {

    const pageNo=0;
    const pageSize=6;
    //this.recipeService.newPost(this.recipeForm.value);
    console.log('Search ' + this.searchForm.value.search);
    if (this.searchForm.status === 'VALID') {
      gtag('event', 'click', {
        'event_category': 'search',
        'event_label': this.searchForm.value.search,
        'value': this.searchForm.value.search
      });
      this.recaptcha3.getToken({ action: 'search' }).then(
        token => {
          this.formData = this.searchForm.value;
          this.formData.recaptchaToken = token;
          console.log(this.formData);
          // Handle saving form data

        this.blogService.setSearchData(this.formData);
          this.dataStorageService.searchPosts(pageNo,pageSize, this.formData).subscribe(postCards => {

            console.log("Current route : " + this.router.url);
            this.blogService.setPostCards(postCards.data);
            this.blogService.setLoadingIndicator(false);
            if(this.router.url !=='/home'){
              this.onSearchResults();
            }
            
          }, errorMessage => {

            console.log('HTTP Error', errorMessage)
            let errMsg = `Unable to retrieve due to  ${errorMessage}()`;
            this.blogService.setErrorMessage(errMsg);
            this.blogService.setLoadingIndicator(false);
            this.error = errMsg;
            this.open(content);
          });
         

        },
        error => {
          // handle error here
          this.blogService.setErrorMessage("Service is currently unavailable. Try again later!");
          this.blogService.setSuccessMessage(null);
          this.blogService.setLoadingIndicator(false);
          console.log(error);
          this.error = "Service is currently unavailable. Try again later!";
          // this.onSearchResults();
          this.open(content);
         
        }
      );

    }

  }

      

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

    });
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  onSearchResults() {
    this.router.navigate(['/search'], { relativeTo: this.route });
  }
  private initForm() {
    let searchText = '';
    this.searchForm = new FormGroup({
      search: new FormControl(searchText, Validators.required),

    });
    this.recaptcha3.init(environment.siteKey);
  }
  ngAfterViewInit(): void {
    // subscribe to router events and send page views to Google Analytics
    console.log("Page visited !!!");
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        gtag('config', 'G-TE5MPGC93J', {'page_path': event.urlAfterRedirects});
      });
  }

}
