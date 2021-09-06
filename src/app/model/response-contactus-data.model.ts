import { Error } from "./error.model";
export class ResponseContactUsData {
  
    public data: ContactUsFinalResponse;
    public error: Error[];
    public message: string;
    constructor(contactUsFinalResponse: ContactUsFinalResponse,error: Error[], message: string){
        this.data = contactUsFinalResponse;
        this.error = error;
        this.message = message;
    }
}

export class ContactUsFinalResponse{
    public contactUsId: string;
    public status: string;
   

    constructor(contactUsId: string, status: string,){
        this.contactUsId= contactUsId;
        this.status = status
    }

}