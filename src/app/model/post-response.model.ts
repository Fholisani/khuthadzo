import { ContetFile } from "./content-file.model";
import { GalleryImages } from "./post.model";

export class PostDetailResponse {

    public postId: string;
    public heading: string;
    public subHeading :string;
    public backgroundImage :string;
    public readTime :number;
    public reference :number;
    public date :Date;
    public body : string;
    public author: string;
    public galleryImages: GalleryImages[];
    public contentFilesBg: ContetFile[];
    public contentFilesPost: ContetFile[];

    constructor(postId : string, heading : string,subHeading : string,backgroundImage : string, 
        readTime : number,
        reference: number,date :Date, body: string, galleryImages: GalleryImages[], author: string,contentFilesBg: ContetFile[],
        contentFilesPost: ContetFile[] ){
        this.postId = postId;
        this.heading = heading;
        this.subHeading = subHeading;
        this.backgroundImage = backgroundImage;
        this.readTime = readTime;
        this.reference = reference;
        this.date = date;
        this.body = body;
        this.author = author;
        this.galleryImages = galleryImages;
        this.contentFilesBg =contentFilesBg;
        this.contentFilesPost = contentFilesPost;
    }
}