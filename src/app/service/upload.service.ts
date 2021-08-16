import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ContetFile } from '../model/content-file.model';
import { Image, ImageUrl } from '../model/image.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  imagesChanged = new Subject<Image[]>();
  imagesHandDrawingChanged = new Subject<Image[]>();
  imagesAdded = new  BehaviorSubject<Image>(null);
  imagesBgAdded =new  BehaviorSubject<Image>(null);

  contentImagesAdded = new  Subject<ContetFile>();
  contentImagesBgAdded =new  Subject<ContetFile>();
  contentImagesPostAdded=new Subject<ContetFile>();
  // imagesPostAdded = new Subject<Image>();
  // imagesPostAdded= new  BehaviorSubject<Image>(null);
  imagesPostAdded: Subject<any> = new Subject<any>();
  private images: Image[] = [];
  private imagesHandDrawing: Image[] = [];
  private imagesBgAdd : Image;
  private imagesPostAdd :Image ;
  private imagesAdd: Image;

  private contentImagesBgAdd : ContetFile;
  private contentImagesPostAdd :ContetFile ;
  private contentImagesAdd: ContetFile;

  private contentImageBgListAdd : ContetFile;
  private contentImagePostListAdd :ContetFile ;
  private contentImageListAdd: ContetFile;
  contentImageListAdded = new  Subject<ContetFile>();
  contentImageListBgAdded =new  Subject<ContetFile>();
  contentImageListPostAdded =new  Subject<ContetFile>();

  private contentFileObj : ContetFile;
  isLoading=false;
  isLoadingChanged=new Subject<boolean>();
  errorMessage=null;
  errorMessageChanged=new Subject<string>();
  successMessage: string=null;
  successMessageChanged=new Subject<string>();
  uploadedDataSource: BehaviorSubject<ImageUrl[]> = new BehaviorSubject([]);
  // Observable navItem stream
 // navItem$ = this.imagesPostAdded.asObservable();
 fileImageBgChanged = new Subject<ContetFile[]>();
 fileImageBgDelete = new Subject<ContetFile[]>();
 fileImageBgDeleteLocalIndex = new Subject<number>();

 fileImagePostChanged = new Subject<ContetFile[]>();
 fileImagePostDelete = new Subject<ContetFile[]>();
 fileImagePostDeleteLocalIndex = new Subject<number>();

 componentCallingFileEdit = new  BehaviorSubject<string>(null);
 private fileImageBgUrls: ContetFile[]=[];
 private fileImagePostUrls: ContetFile[]=[];

  constructor() { }

  // private fileImageBgUrls: ContetFile[] = [
  //   new ContetFile(1,7,'4546465','https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=700%2C636','THis image is beautiful','BACKGROUND', 'More IMG')
  //  ,
  //  new ContetFile(2,8,'4546466','https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=700%2C636','THis image is beautiful','BACKGROUND', 'More IMG')

  // ];


  setErrorMessage(errorMessage: string) {
    this.errorMessage = errorMessage;
    this.errorMessageChanged.next(this.errorMessage);
  }

  setSuccessMessage(successMessage: string) {
    this.successMessage = successMessage;
    this.successMessageChanged.next(this.successMessage);
  }

  uploadedImgDataSource(imageUrls: ImageUrl[]) {
    this.uploadedDataSource.next(imageUrls);
  }
  componentCallingSource(componentCallingEdit: string) {
    this.componentCallingFileEdit.next(componentCallingEdit);
  }

  setLoadingIndicator(isLoading: boolean){
    this.isLoading = isLoading;
    this.isLoadingChanged.next(this.isLoading);
  }
  setImages(images: Image[]){
    this.images = images;
    this.imagesChanged.next(this.images.slice());
  }
  getImages(){
    return this.images.slice();
  }
  setHandDrawingImages(images: Image[]){
    this.imagesHandDrawing = images;
    this.imagesHandDrawingChanged.next(this.imagesHandDrawing.slice());
  }
  getHandDrawingImages(){
    return this.imagesHandDrawing.slice();
  }
 
  getImage(index: number) {
    return this.images[index];
  }
  deleteImage(index: number) {
    this.images.splice(index, 1);
    this.imagesChanged.next(this.images.slice());

    // this.imagesAdd =  this.images;
    // this.imagesAdded.next(this.imagesAdd);
  }
  cleanImages() {
    this.imagesAdd = null;
  //  this.imagesAdded.next(this.imagesAdd);
  }
  cleanBgImages() {
    this.imagesBgAdd = null;
   // this.imagesPostAdded.next(this.imagesBgAdd);
  }
  cleanPostImages() {
    this.imagesPostAdd = null;
   // this.imagesBgAdded.next(this.imagesPostAdd);
  }
   createImage(payload: Image,componentUploading: string) {
    // payload.id =Math.floor(Math.random() * 100) + 1;
    payload.imageUrls =[];
    
    console.log("*** Notify subscriber for component : " + componentUploading);
    if(componentUploading==='postImg'){
      this.imagesPostAdd =payload;
      this.imagesPostAdded.next(this.imagesPostAdd);
      // this.cleanImages();
      // this.cleanBgImages();
      
    }
    if(componentUploading==='backgroundImg'){
      this.imagesBgAdd =payload;
      this.imagesBgAdded.next(this.imagesBgAdd);
      // this.cleanImages();
      // this.cleanPostImages();
      
    }
    if(componentUploading==='upload'){
      this.imagesAdd =payload;
      this.imagesAdded.next(this.imagesAdd);
      // this.cleanBgImages();
      // this.cleanPostImages();
      
      
    }

  }

  updateFileList(payload: Image,componentUploading: string, imageResponse: ImageUrl) {


    console.log("*** Notify subscriber for component : " + componentUploading);

    this.contentFileObj = new ContetFile(+imageResponse.reference,+imageResponse.reference,
      imageResponse.reference,imageResponse.url,payload.description,payload.portfolioType,payload.tittle);
   
    if(componentUploading==='postImg'){
    
      this.contentImagePostListAdd = this.contentFileObj; 
      this.contentImageListPostAdded.next(this.contentImagePostListAdd); 
    }
    if(componentUploading==='backgroundImg'){
  

      this.contentImageBgListAdd = this.contentFileObj; 
     this.contentImageListBgAdded.next(this.contentImageBgListAdd); 
      
    }
    if(componentUploading==='upload'){
      this.contentImageListAdd = this.contentFileObj; 
      this.contentImageListAdded.next(this.contentImageListAdd); 
       
    }

  }


  updateImage(payload: ContetFile,componentUploading: string) {

    console.log("*** Notify subscriber for content component : " + componentUploading);
    if(componentUploading==='postImg'){
      this.contentImagesPostAdd =payload;
      this.contentImagesPostAdded.next(this.contentImagesPostAdd);

      
    }
    if(componentUploading==='backgroundImg'){
      this.contentImagesBgAdd =payload;
      this.contentImagesBgAdded.next(this.contentImagesBgAdd);
    
      
    }
    if(componentUploading==='upload'){
      this.contentImagesAdd =payload;
      this.contentImagesAdded.next(this.contentImagesAdd);

      
    }

  }
  getUpdateContentPostImg(){
    return this.contentImagesPostAdd;
  }
  getUpdateContentBgImg(){
    return this.contentImagesBgAdd;
  }
  getUpdateContentUploadedImg(){
    return this.contentImagesAdd;
  }
  getImagesPostAdded(){
    return this.imagesPostAdd;
  }
  getImagesBgAdded(){
    return this.imagesBgAdd;
  }
  getImagesAdded(){
    return this.imagesAdd;
  }

  getBgFileUploaded(index: number){
    return this.fileImageBgUrls[index];

  }

  getPostFileUploaded(index: number){
    return this.fileImagePostUrls[index];

  }
  getBgFilesUploaded(){
    return this.fileImageBgUrls;

  }
  getPostFilesUploaded(){
    return this.fileImagePostUrls;

  }
  deleteBgFileUploaded(index: number){

      this.fileImageBgUrls.slice(index,1);
      this.fileImageBgDelete.next(this.fileImageBgUrls.slice());
      this.fileImageBgDeleteLocalIndex.next(index);

  }

  deletePostFileUploaded(index: number){

    this.fileImagePostUrls.slice(index,1);
    this.fileImagePostDelete.next(this.fileImagePostUrls.slice());
    this.fileImagePostDeleteLocalIndex.next(index);

}

  addFileBg(fileImage: ContetFile){
    this.fileImageBgUrls.push(fileImage);
    this.fileImageBgChanged.next(this.fileImageBgUrls)

  }
  addFilePost(fileImage: ContetFile){
    this.fileImagePostUrls.push(fileImage);
    this.fileImagePostChanged.next(this.fileImagePostUrls)

  }
  cleanAddFileBg() {
    this.fileImageBgUrls = [];
    this.fileImageBgChanged.next(this.fileImageBgUrls)
  }
  cleanAddFilePost() {
    this.fileImagePostUrls = [];
    this.fileImagePostChanged.next(this.fileImagePostUrls)
  }


  // updateFileImageBg(index: number, contentFile: ContetFile){
  //   this.fileImageBgUrls[index] = newRecipe;
  //   this.fileImageChanged.next(this.fileImageBgUrls.slice())
    
  // }

}
