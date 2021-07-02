export class Image {
    public id: number;
    public title: string;
    public description: string;
    public portfolioType: string;
    public images: ImageFile[];
    public imageUrl : string;
    constructor(id: number,title: string, description: string, images: ImageFile[], imageUrl: string){
        this.id =id;
        this.title = title;
        this.description =description;
        this.images =images;
        this.imageUrl = imageUrl;

    }
}

export class ImageFile {
  
    public image: File;
    constructor(image: File){
        this.image = image;
    }
}