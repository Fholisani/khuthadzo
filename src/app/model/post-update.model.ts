import { Post } from "./post.model";

export class PostUpdate {
    public index: number;
    public post: Post;
   
    constructor(index: number,post: Post ){
        this.index = index;
        this.post = post;
    }
}