
import { ContetFile } from "./content-file.model";
import { GalleryImages } from "./post.model";

export class RemoveImg {
    public index: number;
    public contentFile: ContetFile;
    public galleryImage:  GalleryImages;
   
    constructor(index: number,contentFile: ContetFile , galleryImage :GalleryImages ){
        this.index = index;
        this.contentFile = contentFile;
        this.galleryImage = galleryImage;
    }
}