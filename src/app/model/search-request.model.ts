export class SearchRequest {
    public search: string;
    public recaptchaToken: string;
   
    constructor(search: string,recaptchaToken: string ){
        this.search = search;
        this.recaptchaToken = recaptchaToken;
    }
}