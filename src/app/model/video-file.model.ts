export class VideoFile{ 
    public video : Video;
    public thumb: string;
    public subHtml: string;
    public reference: number;
    public description : string;
    constructor(video : Video, thumb: string, subHtml: string,reference: number, description : string){
        this.video = video;
        this.thumb= thumb;
        this.subHtml = subHtml;
        this.reference = reference;
        this.description = description;
    }

}

export class Video{
    public source: Source[]; 
    public attributes: Attributes;
   
    constructor(source: Source[], attributes: Attributes,){
        this.source= source;
        this.attributes = attributes;
    }

}

export class Source{
    public src: string;
    public type: string;
   

    constructor(src: string, type: string,){
        this.src= src;
        this.type = type
    }

}
export class Attributes{
    public preload: boolean;
    public controls: boolean;
   
    constructor(preload: boolean, controls: boolean,){
        this.preload= preload;
        this.controls = controls
    }

}
