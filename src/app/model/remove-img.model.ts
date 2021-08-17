
import { ContetFile } from "./content-file.model";

export class RemoveImg {
    public index: number;
    public contentFile: ContetFile;
   
    constructor(index: number,contentFile: ContetFile ){
        this.index = index;
        this.contentFile = contentFile;
    }
}