export class Post {
    public id: number;
    public slug: string;
    public bgImage: string;
    public heading: string;
    public subHeading: string;
    public meta: string;
    public body: string;
    public galleryImages: GalleryImages[];
    public date :Date;
    public author: string;
    public readTime: number;
    public imageUrls: ImageData[];
    public backgroundImage: ImageData[];
    public postCardImage: string;


    constructor(id: number,slug: string,bgImage: string,heading: string,
        subHeading: string,meta: string,body: string, galleryImages: GalleryImages[], date : Date,
        author: string, readTime: number,backgroundImage: ImageData[], imageUrls:ImageData[], postCardImage: string) {
            this.id =id;
            this.slug =slug;
            this.bgImage = bgImage;
            this.backgroundImage =backgroundImage;
            this.heading = heading;
            this.subHeading = subHeading;
            this.meta =meta;
            this.body = body;
            this.galleryImages =galleryImages;
            this.date =date;
            this.author =author;
            this.readTime = readTime;
            this.imageUrls =imageUrls;
            this.postCardImage = postCardImage;
    }
}

export class GalleryImages{
    public small: string;
    public medium: string;
    public big: string;
    public description: string;
    public postId: number;
    public reference: number;
    public size: string;
    public url: string;
    public subHtml:string;
    public label:string;
    public name:string;

    constructor(small: string, medium: string,big: string,description: string,
        postId: number, reference: number, size: string, subHtml:string,label:string, name:string){
        this.small= small;
        this.medium = medium
        this.big = big;
        this.description = description;
        this.postId = postId;
        this.reference = reference;
        this.size = size;
        this.subHtml = subHtml;
        this.label = label;
        this.name = name;
    }

}


export class ImageData{
    public name: string;
    public url: string;
   

    constructor(name: string, url: string,){
        this.name= name;
        this.url = url
    }

}