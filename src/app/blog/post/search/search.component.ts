import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgRecaptcha3Service } from 'ng-recaptcha3';
import { BlogService } from 'src/app/service/blog-service.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchForm: FormGroup;
  private siteKey = "6LdBzXsbAAAAAIlawAHSrx_E0dHcHVeMs6_wBt6P";
  formData: any;
  closeResult: string;
  error: string = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataStorageService: DataStorageService,
    private blogService: BlogService,
    private recaptcha3: NgRecaptcha3Service,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit(content) {


    //this.recipeService.newPost(this.recipeForm.value);
    console.log('Search ' + this.searchForm.value.search);
    if (this.searchForm.status === 'VALID') {
      this.recaptcha3.getToken({ action: 'search' }).then(
        token => {
          this.formData = this.searchForm.value;
          this.formData.recaptchaToken = token;
          console.log(this.formData);
          // Handle saving form data

          this.dataStorageService.fetchPosts().subscribe(posts => {

            this.blogService.setPosts(posts);
            this.blogService.setLoadingIndicator(false);
            this.onSearchResults();
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
    this.recaptcha3.init(this.siteKey);
  }

}
