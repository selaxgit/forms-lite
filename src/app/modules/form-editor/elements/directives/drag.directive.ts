import { Directive, DOCUMENT, HostBinding, HostListener, inject, Input } from '@angular/core';

import { IDragExtendedComponent, IUFDragInfo, UF_DRAGGING_BODY_CLASS, UF_NO_DRAGGING_BODY_CLASS } from './interfaces';

@Directive({
  selector: '[ufDrag]',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class UFDragDirective {
  @Input('ufDrag') hostComponent!: IDragExtendedComponent;

  @Input() dragInfo!: IUFDragInfo;

  private readonly document = inject(DOCUMENT);

  @HostBinding('draggable') get getDraggable(): boolean {
    return true;
  }

  @HostListener('dragstart', ['$event']) onDragStart(event: DragEvent): void {
    this.toggleClassDragging(true);
    const dt = event.dataTransfer;
    if (dt) {
      dt.setData('text/plain', JSON.stringify(this.dragInfo));
      if (this.hostComponent?.elementRef?.nativeElement) {
        dt.setDragImage(this.hostComponent.elementRef.nativeElement, 0, 0);
      }
    }
  }

  @HostListener('dragend') onDragEnd(): void {
    this.toggleClassDragging(false);
  }

  private toggleClassDragging(add: boolean): void {
    if (add) {
      this.document.body.classList.add(UF_DRAGGING_BODY_CLASS);
      this.hostComponent?.elementRef?.nativeElement?.classList?.add(UF_NO_DRAGGING_BODY_CLASS);
    } else {
      this.document.body.classList.remove(UF_DRAGGING_BODY_CLASS);
      this.hostComponent?.elementRef?.nativeElement?.classList?.remove(UF_NO_DRAGGING_BODY_CLASS);
    }
  }
}
