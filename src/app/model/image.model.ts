export class Image {

    public id: number;
    public tittle: string;
    public description: string;
    public portfolioType: string;
    public images: ImageFile[];
    public imageUrl : string;
    public imageUrls : ImageUrl[];
    public postId: number;
    constructor(id: number,tittle: string, description: string,
         images: ImageFile[], imageUrl: string, imageUrls : ImageUrl[],postId: number){
        this.id =id;
        this.tittle = tittle;
        this.description =description;
        this.images =images;
        this.imageUrl = imageUrl;
        this.imageUrls= imageUrls;
        this.postId =postId;

    }
}

export class ImageFile {
  
    public image: File;
    constructor(image: File){
        this.image = image;
    }
}
export class ImageUrl {
  
    public name: string;
    public url: string;
    public reference: string;
    public contentId: string;
    constructor(name: string, url: string, reference: string, contentId: string){
        this.name = name;
        this.url = url;
        this.reference= reference;
        this.contentId = contentId;
    }
}