import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ContetFile } from '../model/content-file.model';
import { Image, ImageUrl } from '../model/image.model';
import { GalleryImages } from '../model/post.model';
import { RemoveImg } from '../model/remove-img.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  imagesChanged = new Subject<GalleryImages[]>();
  imagesMasterMemoryChanged= new Subject<GalleryImages[]>();
  imagesHandMasterMemoryChanged= new Subject<GalleryImages[]>();
  videosMasterMemoryChanged= new Subject<GalleryImages[]>();
  imagesDeleteChanged = new Subject<GalleryImages[]>();
  imagesHandDrawingChanged = new Subject<GalleryImages[]>();
  videosChanged = new Subject<GalleryImages[]>();
  imagesAdded = new BehaviorSubject<Image>(null);
  imagesBgAdded = new BehaviorSubject<Image>(null);
  videoAdded = new BehaviorSubject<Image>(null);
  contentImagesAdded = new Subject<ContetFile>();
  contentImagesBgAdded = new Subject<ContetFile>();
  contentImagesPostAdded = new Subject<ContetFile>();
  // imagesPostAdded = new Subject<Image>();
  // imagesPostAdded= new  BehaviorSubject<Image>(null);
  imagesPostAdded: Subject<any> = new Subject<any>();
  private images: GalleryImages[] = [];
  private imagesMasterMemory: GalleryImages[] = [];
  private imagesHandMasterMemory: GalleryImages[] = [];
  private videosMasterMemory: GalleryImages[] = [];
  private itemTemp: GalleryImages[] = [];
  private imagesHandDrawing: GalleryImages[] = [];
  private videos: GalleryImages[] = [];
  private imagesBgAdd: Image;
  private imagesPostAdd: Image;
  private imagesAdd: Image;
  private videoAdd : Image;

  private  imageToDelete : GalleryImages; 

  private contentImagesBgAdd: ContetFile;
  private contentImagesPostAdd: ContetFile;
  private contentImagesAdd: ContetFile;

  private contentImageBgListAdd: ContetFile;
  private contentImagePostListAdd: ContetFile;
  private contentImageListAdd: ContetFile;
  contentImageListAdded = new Subject<ContetFile>();
  contentImageListBgAdded = new Subject<ContetFile>();
  contentImageListPostAdded = new Subject<ContetFile>();

  private contentFileObj: ContetFile;
  isLoading = false;
  isLoadingChanged = new Subject<boolean>();
  errorMessage = null;
  errorMessageChanged = new Subject<string>();
  successMessage: string = null;
  successMessageChanged = new Subject<string>();
  uploadedDataSource: BehaviorSubject<ImageUrl[]> = new BehaviorSubject([]);
  // Observable navItem stream
  // navItem$ = this.imagesPostAdded.asObservable();
  fileImageBgChanged = new Subject<ContetFile[]>();
  fileImageBgDelete = new Subject<ContetFile[]>();
  fileImageBgObjDelete = new Subject<ContetFile>();
  fileImageBgDeleteLocalIndex = new Subject<RemoveImg>();

  fileImagePostChanged = new Subject<ContetFile[]>();
  fileImagePostDelete = new Subject<ContetFile[]>();
  fileImagePostObjDelete = new Subject<ContetFile>();
  fileImagePostDeleteLocalIndex = new Subject<RemoveImg>();

  componentCallingFileEdit = new BehaviorSubject<string>(null);
  private fileImageBgUrls: ContetFile[] = [];
  private fileImagePostUrls: ContetFile[] = [];

  fileImageDeleteLocalIndex = new Subject<RemoveImg>();

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

  setLoadingIndicator(isLoading: boolean) {
    this.isLoading = isLoading;
    this.isLoadingChanged.next(this.isLoading);
  }
  setImages(images: GalleryImages[]) {
    this.images = images;
    // this.imagesMasterMemory = 

    if (this.imagesMasterMemory === undefined || this.imagesMasterMemory.length === 0) {
      this.imagesMasterMemory = images;
    } else {
      console.log("Add more iterms trigered by the scroll into Master Memory");
      images.forEach(element => {
        this.imagesMasterMemory = [
          ...this.imagesMasterMemory,
          element,
        ];

      });
    }
    this.imagesMasterMemoryChanged.next(this.imagesMasterMemory.slice());
    this.imagesChanged.next(this.images.slice());
    
  }
  getImages() {
    return this.images.slice();
  }
  setHandDrawingImages(images: GalleryImages[]) {
    this.imagesHandDrawing = images;
    if (this.imagesHandMasterMemory === undefined || this.imagesHandMasterMemory.length === 0) {
      this.imagesHandMasterMemory = images;
    } else {
      console.log("Add more iterms trigered by the scroll into Master Memory");
      images.forEach(element => {
        this.imagesHandMasterMemory = [
          ...this.imagesHandMasterMemory,
          element,
        ];

      });
    }
    this.imagesHandMasterMemoryChanged.next(this.imagesHandMasterMemory.slice());
    this.imagesHandDrawingChanged.next(this.imagesHandDrawing.slice());
  }

  setVideos(videos: GalleryImages[]) {
    this.videos = videos;
    if (this.videosMasterMemory === undefined || this.videosMasterMemory.length === 0) {
      this.videosMasterMemory = videos;
    } else {
      console.log("Add more iterms trigered by the scroll into Master Memory");
      videos.forEach(element => {
        this.videosMasterMemory = [
          ...this.videosMasterMemory,
          element,
        ];

      });
    }
    this.videosMasterMemoryChanged.next(this.videosMasterMemory.slice());
    this.videosChanged.next(this.videos.slice());
  }
  getHandDrawingImages() {
    return this.imagesHandDrawing.slice();
  }
  getVideos() {
    return this.videos.slice();
  }

  getImage(index: number) {
    return this.images[index];
  }
  deleteImage(index: number) {
    this.images.splice(index, 1);
    this.imagesDeleteChanged.next(this.images.slice());

    // this.imagesAdd =  this.images;
    // this.imagesAdded.next(this.imagesAdd);
  }
  cleanImages() {
    this.imagesAdd = null;
    //  this.imagesAdded.next(this.imagesAdd);
  }
  cleanVideos() {
    this.videoAdd = null;
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
  createImage(payload: Image, componentUploading: string) {
    // payload.id =Math.floor(Math.random() * 100) + 1;
    payload.imageUrls = [];

    console.log("*** Notify subscriber for component : " + componentUploading);
    if (componentUploading === 'postImg') {
      this.imagesPostAdd = payload;
      this.imagesPostAdded.next(this.imagesPostAdd);
      // this.cleanImages();
      // this.cleanBgImages();

    }
    if (componentUploading === 'backgroundImg') {
      this.imagesBgAdd = payload;
      this.imagesBgAdded.next(this.imagesBgAdd);
      // this.cleanImages();
      // this.cleanPostImages();

    }
    if (componentUploading === 'upload') {
      this.imagesAdd = payload;
      this.imagesAdded.next(this.imagesAdd);
      // this.cleanBgImages();
      // this.cleanPostImages();


    }

  }

  createVideo(payload: Image, componentUploading: string) {
    // payload.id =Math.floor(Math.random() * 100) + 1;
    payload.imageUrls = [];

    console.log("*** Notify subscriber for component : " + componentUploading);
 
    if (componentUploading === 'uploadvideo') {
      this.videoAdd = payload;
      this.videoAdded.next(this.videoAdd);
      // this.cleanBgImages();
      // this.cleanPostImages();


    }

  }

  updateFileList(payload: Image, componentUploading: string, imageResponse: ImageUrl) {


    console.log("*** Notify subscriber for component : " + componentUploading);

    this.contentFileObj = new ContetFile(+imageResponse.reference, +imageResponse.reference,
      imageResponse.reference, imageResponse.url, payload.description, payload.portfolioType, payload.tittle);

    if (componentUploading === 'postImg') {

      this.contentImagePostListAdd = this.contentFileObj;
      this.contentImageListPostAdded.next(this.contentImagePostListAdd);
    }
    if (componentUploading === 'backgroundImg') {


      this.contentImageBgListAdd = this.contentFileObj;
      this.contentImageListBgAdded.next(this.contentImageBgListAdd);

    }
    if (componentUploading === 'upload') {
      this.contentImageListAdd = this.contentFileObj;
      this.contentImageListAdded.next(this.contentImageListAdd);

    }

  }


  updateImage(payload: ContetFile, componentUploading: string) {

    console.log("*** Notify subscriber for content component : " + componentUploading);
    if (componentUploading === 'postImg') {
      this.contentImagesPostAdd = payload;
      this.contentImagesPostAdded.next(this.contentImagesPostAdd);


    }
    if (componentUploading === 'backgroundImg') {
      this.contentImagesBgAdd = payload;
      this.contentImagesBgAdded.next(this.contentImagesBgAdd);


    }
    if (componentUploading === 'upload') {
      this.contentImagesAdd = payload;
      this.contentImagesAdded.next(this.contentImagesAdd);


    }

  }
  getUpdateContentPostImg() {
    return this.contentImagesPostAdd;
  }
  getUpdateContentBgImg() {
    return this.contentImagesBgAdd;
  }
  getUpdateContentUploadedImg() {
    return this.contentImagesAdd;
  }
  getImagesPostAdded() {
    return this.imagesPostAdd;
  }
  getImagesBgAdded() {
    return this.imagesBgAdd;
  }
  getImagesAdded() {
    return this.imagesAdd;
  }
  getVideosAdded() {
    return this.videoAdd;
  }

  getBgFileUploaded(index: number) {
    return this.fileImageBgUrls[index];

  }

  getPostFileUploaded(index: number) {
    return this.fileImagePostUrls[index];

  }
  getBgFilesUploaded() {
    return this.fileImageBgUrls;

  }
  getPostFilesUploaded() {
    return this.fileImagePostUrls;

  }
  deleteBgFileUploaded(index: number) {
    this.fileImageBgDeleteLocalIndex.next(new RemoveImg(index, this.fileImageBgUrls[index], null));
    this.fileImageBgObjDelete.next(this.fileImageBgUrls[index]);
    this.fileImageBgUrls.slice(index, 1);
    this.fileImageBgDelete.next(this.fileImageBgUrls.slice());


  }
  deleteFileUploaded(index: number) {
    this.imageToDelete = this.imagesMasterMemory[index];
    console.log("Architecture this.imagesMasterMemory Before : "+ this.imagesMasterMemory.length);
    this.imagesMasterMemory.splice(index, 1);
    this.imagesMasterMemoryChanged.next(this.imagesMasterMemory.slice());
    this.fileImageDeleteLocalIndex.next(new RemoveImg(index, null, this.imageToDelete));
  }
  deleteFileUploadedHandDrawing(index: number) {
    this.imageToDelete = this.imagesHandMasterMemory[index];
    console.log("Hand drawing this.imagesHandMasterMemory Before : "+ this.imagesHandMasterMemory.length);
    this.imagesHandMasterMemory.splice(index, 1);
    this.imagesHandMasterMemoryChanged.next(this.imagesHandMasterMemory.slice());
    this.fileImageDeleteLocalIndex.next(new RemoveImg(index, null, this.imageToDelete));
  }

  deletePostFileUploaded(index: number) {
    this.fileImagePostDeleteLocalIndex.next(new RemoveImg(index, this.fileImagePostUrls[index], null));
    this.fileImagePostObjDelete.next(this.fileImagePostUrls[index]);
    this.fileImagePostUrls.slice(index, 1);
    this.fileImagePostDelete.next(this.fileImagePostUrls.slice());


  }

  addFileBg(fileImage: ContetFile) {
    this.fileImageBgUrls.push(fileImage);
    this.fileImageBgChanged.next(this.fileImageBgUrls)

  }
  addFilePost(fileImage: ContetFile) {
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
  cleanImagesMasterMemory() {
    this.imagesMasterMemory = [];
    this.imagesMasterMemoryChanged.next(this.imagesMasterMemory);
  }
  cleanHandImagesMasterMemory() {
    this.imagesHandMasterMemory = [];
    this.imagesHandMasterMemoryChanged.next(this.imagesMasterMemory);
  }


  cleanVideosMasterMemory() {
    this.videosMasterMemory = [];
    this.videosMasterMemoryChanged.next(this.videosMasterMemory);
  }
  // updateFileImageBg(index: number, contentFile: ContetFile){
  //   this.fileImageBgUrls[index] = newRecipe;
  //   this.fileImageChanged.next(this.fileImageBgUrls.slice())

  // }

}
