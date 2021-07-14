export class Image {
    map(arg0: (so: any) => any) {
      throw new Error('Method not implemented.');
    }
    public id: number;
    public title: string;
    public description: string;
    public portfolioType: string;
    public images: ImageFile[];
    public imageUrl : string;
    public imageUrls : ImageUrl[];
    constructor(id: number,title: string, description: string, images: ImageFile[], imageUrl: string, imageUrls : ImageUrl[]){
        this.id =id;
        this.title = title;
        this.description =description;
        this.images =images;
        this.imageUrl = imageUrl;
        this.imageUrls= imageUrls;

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
    constructor(name: string, url: string){
        this.name = name;
        this.url = url;
    }
}