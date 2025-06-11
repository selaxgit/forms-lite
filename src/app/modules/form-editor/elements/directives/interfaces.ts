import { ElementRef } from '@angular/core';

export const UF_DRAGGING_BODY_CLASS = 'uf-dragging';
export const UF_NO_DRAGGING_BODY_CLASS = 'uf-not-dragging';
export const IS_CAN_DRAG_CLASS = 'is-can-drag';

export interface IDragExtendedComponent {
  elementRef: ElementRef;
}

export interface IUFDragInfo {
  type: 'row' | 'element';
  idx: number;
  parentGuid: string | null;
}

export interface IUFDropInfo {
  mode: 'row' | 'element';
  type: 'push' | 'insert' | 'before' | 'after';
  idx: number;
  parentGuid: string | null;
}
