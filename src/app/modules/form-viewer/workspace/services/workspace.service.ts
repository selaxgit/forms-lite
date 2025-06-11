/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { pairwise, startWith, Subject, takeUntil } from 'rxjs';

import { JsonHelper } from '../../../../common/helpers/json.helper';
import { FLElementTypeEnum, IFLElement, IFLRow, IUFDto } from '../../../../common/interfaces';
import { ControlElement, IKeyValueDto } from './control-element.class';

interface IElements {
  [key: string]: ControlElement;
}

@Injectable()
export class WorkspaceService {
  private elements: IElements = {};

  private destroyRef = new Subject<void>();

  private currentDto: IUFDto | null = null;

  getElement(guid: string): ControlElement | null {
    return this.elements[guid] ?? null;
  }

  setDto(dto: IUFDto | null): void {
    if (!dto) {
      return;
    }
    this.currentDto = dto;
    const keyValueDto: IKeyValueDto = {};
    JsonHelper.parseJsonKeysValueToObject(keyValueDto, dto.source);
    this.updatedDto(keyValueDto);
  }

  init(rows: IFLRow[]): void {
    this.clearElements();
    this.destroyRef = new Subject<void>();
    if (rows.length > 0) {
      this.collectElement(rows);
      this.subscriptions();
    }
  }

  private subscriptions(): void {
    Object.keys(this.elements).forEach((key: string) => {
      this.elements[key].control.valueChanges
        .pipe(takeUntil(this.destroyRef), startWith(this.elements[key].control.value), pairwise())
        .subscribe(([oldValue, newValue]: [any, any]) => {
          if (oldValue !== newValue) {
            this.updatedValue(this.elements[key].id, this.elements[key].bindDTO, newValue);
          }
        });
    });
  }

  private updatedDto(keyValueDto: IKeyValueDto): void {
    Object.keys(this.elements).forEach((key: string) => {
      this.elements[key].updatedDto(keyValueDto);
    });
  }

  private updatedValue(id: string, bindDTO: string | null, value: any): void {
    if (this.currentDto && this.currentDto?.source && bindDTO) {
      // currentDto передано по ссылке - значит просто меняем в нем что хочем и ни о чем не сообщаем
      JsonHelper.setJsonValueByKey(this.currentDto.source, bindDTO, value);
    }
    Object.keys(this.elements).forEach((key: string) => {
      this.elements[key].updatedValue(id, bindDTO, value);
    });
  }

  private clearElements(): void {
    if (this.destroyRef) {
      this.destroyRef.next();
      this.destroyRef.complete();
    }
    this.elements = {};
  }

  private collectElement(rows: (IFLElement | IFLRow)[]): void {
    for (const item of rows) {
      if ((item as IFLElement).type === undefined && item.guid) {
        if (item.children) {
          this.collectElement(item.children);
        }
      } else {
        switch ((item as IFLElement).type) {
          case FLElementTypeEnum.Tabs:
            this.elements[item.guid] = new ControlElement(item as IFLElement);
            if (item.children) {
              for (const tab of item.children) {
                if (tab.children) {
                  this.collectElement(tab.children);
                }
              }
            }
            break;
          case FLElementTypeEnum.Panel:
            this.elements[item.guid] = new ControlElement(item as IFLElement);
            if (item.children) {
              this.collectElement(item.children);
            }
            break;
          default:
            this.elements[item.guid] = new ControlElement(item as IFLElement);
        }
      }
    }
  }
}
