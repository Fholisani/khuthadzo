export class PostCardResponse {

    public postId: string;
    public heading: string;
    public subHeading :string;
    public backgroundImage :string;
    public readTime :number;
    public reference :number;
    public date :Date;

    constructor(postId : string, heading : string,subHeading : string,backgroundImage : string, readTime : number,
        reference: number,date :Date){
        this.postId = postId;
        this.heading = heading;
        this.subHeading = subHeading;
        this.backgroundImage = backgroundImage;
        this.readTime = readTime;
        this.reference = reference;
        this.date = date;
    }
}