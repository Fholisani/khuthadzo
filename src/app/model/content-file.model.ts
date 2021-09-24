export class ContetFile {
    public contentId: number;
    public postId: number;
    public url: string;
    public reference: string;
    public description: string;
    public portfolioType: string;
    public tittle: string;
    public imageSize: string;
    public poster: string;
    constructor(contentId: number,postId: number,  reference: string, url: string,description: string,
        portfolioType: string, tittle: string, imageSize: string,poster: string){
        this.contentId = contentId;
        this.postId = postId;
        this.reference= reference;
        this.url = url;
        this.description= description;
        this.portfolioType = portfolioType;
        this.tittle = tittle;
        this.imageSize= imageSize;
        this.poster= poster;
    }
}