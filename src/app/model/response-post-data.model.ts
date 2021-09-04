import { PostCardResponse } from "./post-card-response.model";
import { Error } from "./error.model";
export class ResponsePostData {
  
    public data: PostCardResponse[];
    public error: Error[];
    public message: string;
    constructor(postCardResponse: PostCardResponse[],error: Error[], message: string){
        this.data = postCardResponse;
        this.error = error;
        this.message = message;
    }
}