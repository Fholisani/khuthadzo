import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild, Input, OnDestroy } from '@angular/core';


@Component({
  selector: 'app-infinite-scroll',
  template: `<ng-content></ng-content><div #anchor></div>`,
  styleUrls: ['./infinite-scroll.component.css']
})
export class InfiniteScrollComponent implements  OnInit, OnDestroy {
  @Input() options = {};
  @Output() scrolled = new EventEmitter();
  @ViewChild('anchor') anchor:  ElementRef;

  private observer: IntersectionObserver;

  constructor(private host: ElementRef) { }

  get element() {
    return this.host.nativeElement;
  }

  ngAfterViewInit() {
    console.log(this.anchor.nativeElement.value);
    console.debug(this.anchor); 
    const options = {
      root: this.isHostScrollable() ? this.host.nativeElement : null,
      ...this.options
    };

    this.observer = new IntersectionObserver(([entry]) => {
      entry.isIntersecting && this.scrolled.emit();
    }, options);

    this.observer.observe(this.anchor.nativeElement);
  }
  ngOnInit() {

  }

  private isHostScrollable() {
    const style = window.getComputedStyle(this.element);

    return style.getPropertyValue('overflow') === 'auto' ||
      style.getPropertyValue('overflow-y') === 'scroll';
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }

}