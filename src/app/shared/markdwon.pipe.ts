import { Pipe, PipeTransform } from '@angular/core';
import * as marked from 'marked';

@Pipe({
  name: 'markdwon'
})
export class MarkdwonPipe implements PipeTransform {
  private md: any;

  constructor() {
    this.md = marked;

    this.md.setOptions({
      gfm: true,
      breaks: true
    });
  }


  transform(value: any, args?: any[]): any {

    if (value && value.length > 0) {
      return this.md(value);
    }
    return value;
  }

}
