export class PostCard {

    public title: string;
    public cardText: string;
    public cardImg :string;
    public readMoreLinkId :number;

    constructor(title : string, cardText : string, cardImg : string, readMoreLinkId: number){
        this.title = title;
        this.cardText = cardText;
        this.cardImg = cardImg;
        this.readMoreLinkId = readMoreLinkId;
    }
}
