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
    public readTime: string;
    public imageurls: ImageData[];
    public backgroundImage: ImageData[];
    public postCardImage: string;


    constructor(id: number,slug: string,bgImage: string,heading: string,
        subHeading: string,meta: string,body: string, galleryImages: GalleryImages[], date : Date,
        author: string, readTime: string,backgroundImage: ImageData[], imageurls:ImageData[], postCardImage: string) {
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
            this.imageurls =imageurls;
            this.postCardImage = postCardImage;
    }
}

export class GalleryImages{
    public small: string;
    public medium: string;
    public big: string;
    public description: string;

    constructor(small: string, medium: string,big: string,description: string){
        this.small= small;
        this.medium = medium
        this.big = big;
        this.description = description;
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