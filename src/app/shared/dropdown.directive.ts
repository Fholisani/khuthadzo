import { Directive, HostListener, HostBinding, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @Output() clickElsewhere = new EventEmitter<MouseEvent>(); 
  constructor(private el: ElementRef, private renderer: Renderer2) { }
  @HostBinding('class.show') isOpen = false;

  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen;
    let part = this.el.nativeElement.querySelector('.dropdown-menu');
    if (this.isOpen) this.renderer.addClass(part, 'show');
    else this.renderer.removeClass(part, 'show');

    
  }



 
 @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {

    const targetElement = event.target as HTMLElement;
 
      // Check if the click was outside the element
      if (targetElement && !this.el.nativeElement.contains(targetElement)) {
         
         //this.clickElsewhere.emit(event);
         let part = this.el.nativeElement.querySelector('.dropdown-menu');

         this.renderer.removeClass(part, 'show');
         this.isOpen = !this.isOpen;
      }
  }

  

  // @HostListener('mouseover') onMouseOver() {
  //   this.isOpen = !this.isOpen;
  //   let part = this.el.nativeElement.querySelector('.dropdown-menu');
  //   if (this.isOpen) this.renderer.addClass(part, 'show');
  //   else this.renderer.removeClass(part, 'show');
  // }

  // @HostListener('mouseleave') onMouseLeave() {
  //   this.isOpen = !this.isOpen;
  //   let part = this.el.nativeElement.querySelector('.dropdown-menu');
  //   if (this.isOpen) this.renderer.addClass(part, 'show');
  //   else this.renderer.removeClass(part, 'show');
  // }
}
