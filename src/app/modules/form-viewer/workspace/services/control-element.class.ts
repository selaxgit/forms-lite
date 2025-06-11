/* eslint-disable @typescript-eslint/no-explicit-any */
import { signal, WritableSignal } from '@angular/core';
import { IJSTSelectItem, JSTFormControl } from '@jst/ui';
import { all, create } from 'mathjs';

import { FLElementTypeEnum, IFLElement, UFDataSourceTypeEnum } from '../../../../common/interfaces';

const math = create(all);
math.import(
  {
    equal: (a: any, b: any) => String(a).toLowerCase() === String(b).toLowerCase(),
    unequal: (a: any, b: any) => a !== b,
  },
  { override: true },
);

export interface IKeyValueDto {
  [key: string]: any;
}

export class ControlElement {
  visibleElement = true;

  disabledElement = false;

  readonly guid: string;

  readonly id: string;

  readonly type: FLElementTypeEnum;

  readonly control = new JSTFormControl(null);

  readonly bindDTO: string | null;

  readonly dataSourceList: WritableSignal<IJSTSelectItem[]> = signal([]);

  private readonly visibleExpression: string | null;

  private readonly disabledExpression: string | null;

  private cachedExpression: Map<string, any> = new Map();

  constructor(element: IFLElement) {
    this.guid = element.guid;
    this.id = element.id;
    this.type = element.type;
    this.visibleExpression = typeof element.visible === 'string' ? element.visible : null;
    this.disabledExpression = typeof element.disabled === 'string' ? element.disabled : null;
    this.bindDTO = element.controlProperties?.bindDTO ?? null;
    this.setDataSourceList(element);
  }

  updatedValue(id: string, bindDTO: string | null, value: any): void {
    this.updateVisible(id, bindDTO, value);
    this.updateDisabled(id, bindDTO, value);
  }

  updatedDto(keyValueDto: IKeyValueDto): void {
    if (this.bindDTO && Object.prototype.hasOwnProperty.call(keyValueDto, this.bindDTO)) {
      this.control.setValue(keyValueDto[this.bindDTO]);
    }
  }

  private setDataSourceList(element: IFLElement): void {
    if (element.type !== FLElementTypeEnum.Control || !element.controlProperties?.dataSource) {
      return;
    }
    switch (element.controlProperties.dataSource.type) {
      case UFDataSourceTypeEnum.List:
        this.dataSourceList.set(element.controlProperties.dataSource.source as IJSTSelectItem[]);
        break;
    }
  }

  private updateVisible(id: string, bindDTO: string | null, value: any): void {
    if (this.visibleExpression) {
      const ret = this.performExpression(this.visibleExpression, id, bindDTO, value);
      if (ret !== -1) {
        this.visibleElement = Boolean(ret);
      }
    }
  }

  private updateDisabled(id: string, bindDTO: string | null, value: any): void {
    if (this.disabledExpression) {
      const ret = this.performExpression(this.disabledExpression, id, bindDTO, value);
      if (ret !== -1) {
        this.disabledElement = Boolean(ret);
        if (this.disabledElement) {
          this.control.disable();
        } else {
          this.control.enable();
        }
      }
    }
  }

  private performExpression(sourceExp: string, id: string, bindDTO: string | null, value: any): number {
    let scopeDTO: any = {};
    let scopeIds: any = {};
    let expression: string;
    if (this.cachedExpression.has(sourceExp)) {
      const data = this.cachedExpression.get(sourceExp);
      scopeDTO = data.scopeDTO;
      scopeIds = data.scopeIds;
      expression = data.expression;
    } else {
      sourceExp = sourceExp.replace(/true/g, '1');
      sourceExp = sourceExp.replace(/false/g, '0');
      const params = sourceExp.split(' ');
      let idx = 0;
      expression = params
        .map((word: string) => {
          if (word[0] === '$') {
            const key = `p${idx}`;
            scopeDTO[key] = word.slice(1);
            idx++;
            return key;
          } else if (word[0] === '^') {
            const key = `p${idx}`;
            scopeIds[key] = word.slice(1);
            idx++;
            return key;
          }
          return word;
        })
        .join(' ');
      this.cachedExpression.set(sourceExp, {
        expression,
        scopeDTO,
        scopeIds,
      });
    }
    if (typeof value === 'boolean') {
      value = value ? '1' : '0';
    }
    const mathScope: any = {};
    Object.keys(scopeDTO).forEach((key: string) => {
      if (scopeDTO[key] === bindDTO) {
        mathScope[key] = value;
      }
    });
    Object.keys(scopeIds).forEach((key: string) => {
      if (scopeIds[key] === id) {
        mathScope[key] = value;
      }
    });
    if (Object.keys(mathScope).length === 0) {
      return -1;
    }
    try {
      if (math.evaluate(expression, mathScope)) {
        return 1;
      } else {
        return 0;
      }
    } catch (e) {
      return 0;
    }
  }
}
