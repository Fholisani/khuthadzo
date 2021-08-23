export class GalleryItem{

    public src: string;
    public thumb:string;
    public responsive:string;
    public subHtml:string;

    constructor( src:string,thumb:string,responsive:string, subHtml:string){
   
        this.src=src;
        this.thumb=thumb;
        this.responsive=responsive;
        this.subHtml=subHtml;
    }

}
