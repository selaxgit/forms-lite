import { Platform } from '@angular/cdk/platform';
import { Directive, DOCUMENT, ElementRef, HostListener, inject, Input } from '@angular/core';

import { CurrentFormStore } from '../../../../stores/current-form.store';
import { IS_CAN_DRAG_CLASS, IUFDragInfo, IUFDropInfo, UF_DRAGGING_BODY_CLASS } from './interfaces';

@Directive({
  selector: '[ufDrop]',
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class UFDropDirective {
  @Input('ufDrop') dropInfo!: IUFDropInfo;

  private readonly elementRef = inject(ElementRef);

  private readonly document = inject(DOCUMENT);

  private readonly currentFormStore = inject(CurrentFormStore);

  private readonly platform = inject(Platform);

  @HostListener('drop', ['$event']) onDrop(event: DragEvent): void {
    this.removeDragClass();
    const data = this.getTransferData(event);
    if (data) {
      event.preventDefault();
      this.document.body.classList.remove(UF_DRAGGING_BODY_CLASS);
      if (data.type === 'row' && this.dropInfo.mode === 'row') {
        this.currentFormStore.moveRow(
          data.parentGuid,
          data.idx,
          this.dropInfo.parentGuid,
          this.dropInfo.type === 'push' ? -1 : this.dropInfo.idx,
        );
      } else if (data.type === 'element') {
        if (this.dropInfo.mode === 'row') {
          this.currentFormStore.moveElement(
            String(data.parentGuid),
            data.idx,
            this.dropInfo.parentGuid,
            this.dropInfo.type === 'push' ? this.dropInfo.idx + 1 : this.dropInfo.idx,
            true,
          );
        } else {
          this.currentFormStore.moveElement(
            String(data.parentGuid),
            data.idx,
            this.dropInfo.parentGuid,
            this.dropInfo.type === 'before' ? this.dropInfo.idx : this.dropInfo.idx + 1,
          );
        }
      }
    }
  }

  @HostListener('dragover', ['$event']) onDragEnd(event: DragEvent): void {
    if (this.platform.FIREFOX) {
      if (this.getTransferData(event)) {
        event.preventDefault();
      }
    } else {
      event.preventDefault();
    }
  }

  @HostListener('dragenter', ['$event']) onDragEnter(event: DragEvent): void {
    if (this.platform.FIREFOX) {
      if (this.getTransferData(event)) {
        this.elementRef.nativeElement.classList.add(IS_CAN_DRAG_CLASS);
      }
    } else {
      this.elementRef.nativeElement.classList.add(IS_CAN_DRAG_CLASS);
    }
  }

  @HostListener('dragleave') onDragLeave(): void {
    this.removeDragClass();
  }

  private removeDragClass(): void {
    this.elementRef.nativeElement.classList.remove(IS_CAN_DRAG_CLASS);
  }

  private getTransferData(event: DragEvent): IUFDragInfo | null {
    const dt = event.dataTransfer;
    if (dt) {
      const data = dt.getData('text/plain');
      try {
        const json = JSON.parse(data);
        if (json.type === 'row' && this.dropInfo.mode === 'element') {
          return null;
        }
        if (this.dropInfo.parentGuid === json.parentGuid) {
          switch (json.type) {
            case 'row':
              if (this.dropInfo.idx === -1 || this.dropInfo.idx < json.idx || this.dropInfo.idx - json.idx > 1) {
                return json;
              } else {
                return null;
              }
            case 'element':
              if (
                (json.idx - 1 === this.dropInfo.idx && this.dropInfo.type === 'after') ||
                (json.idx + 1 === this.dropInfo.idx && this.dropInfo.type === 'before')
              ) {
                return null;
              }
              break;
          }
        }
        return json;
      } catch (e) {}
    }
    return null;
  }
}
