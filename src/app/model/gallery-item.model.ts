export class GalleryItem{
 
        public id: string;
        public size: string;
        public src: string;

        public thumb:string;
       
        public subHtml:string;

        constructor(id: string, size:string, src:string,thumb:string, subHtml:string){
            this.id=id;
            this.size=size;
            this.src=src;
            this.thumb=thumb;
            this.subHtml=subHtml;
        }
 
}