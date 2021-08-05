import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-post-image',
  templateUrl: './post-image.component.html',
  styleUrls: ['./post-image.component.css']
})
export class PostImageComponent implements OnInit {
  recipeForm: FormGroup;
  editMode = false;
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(){
    
    let recipeName ='';
    let recipeImagePath = '';
    let recipeDescription = '';
   

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
    });

  }
  onSubmit(){
    console.log("Results : "+ this.recipeForm.value);
    // const newRecipe = new Recipe(this.recipeForm.value['name'],
    // this.recipeForm.value['description'],
    // this.recipeForm.value['imagePath'],
    // this.recipeForm.value['ingredients']);
    // if(this.editMode){
    //   this.recipeService.updateRecipe(this.id,newRecipe );
    // }else{
    //   this.recipeService.addRecipe(newRecipe);
    // }
    // this.onCancel();

  }
  onCancel(){
   
    //this.router.navigate(['../'], {relativeTo: this.route});
  }

}
