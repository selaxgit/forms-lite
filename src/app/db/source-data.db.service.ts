import { inject, Injectable } from '@angular/core';
import { lastValueFrom, Observable, tap } from 'rxjs';

import { DBBase } from '../common/classes/base.db';
import { FLControlTypeEnum, FLElementTypeEnum, IFLElement, IFLRow, IUFDataSource } from '../common/interfaces';
import { FormsDBService } from './forms.db.service';

@Injectable({ providedIn: 'root' })
export class SourceDataDBService extends DBBase<IUFDataSource> {
  protected readonly tableName = 'source-data';

  private readonly formsDBService = inject(FormsDBService);

  public override remove(id: number): Observable<void> {
    return super.remove(id).pipe(
      tap(() => {
        this.removeDataSourceForForms(id);
      }),
    );
  }

  public override update(id: number, data: Partial<IUFDataSource>): Observable<IUFDataSource> {
    return super.update(id, data).pipe(
      tap((dataSource: IUFDataSource) => {
        this.updateDataSourceForForms(dataSource);
      }),
    );
  }

  private async removeDataSourceForForms(id: number): Promise<void> {
    const forms = await lastValueFrom(this.formsDBService.getList());
    for (const form of forms) {
      const updatedForm = this.removeDataSourceForForm(form.rows, id);
      if (updatedForm) {
        await lastValueFrom(this.formsDBService.update(Number(form.id), form));
      }
    }
  }

  private removeDataSourceForForm(rows: (IFLElement | IFLRow)[], id: number): boolean {
    let updated = false;
    for (const item of rows) {
      if ((item as IFLElement).type === undefined && item.children) {
        if (item.children) {
          if (this.removeDataSourceForForm(item.children, id)) {
            updated = true;
          }
        }
      } else {
        switch ((item as IFLElement).type) {
          case FLElementTypeEnum.Tabs:
            if (item.children) {
              for (const tab of item.children) {
                if (tab.children) {
                  if (this.removeDataSourceForForm(tab.children, id)) {
                    updated = true;
                  }
                }
              }
            }
            break;
          case FLElementTypeEnum.Panel:
            if (item.children) {
              if (this.removeDataSourceForForm(item.children, id)) {
                updated = true;
              }
            }
            break;
          case FLElementTypeEnum.Control:
            const element = item as IFLElement;
            if (element.controlType === FLControlTypeEnum.List) {
              if (element.controlProperties?.dataSource?.id === id) {
                element.controlProperties.dataSource.id = null;
                updated = true;
              }
            }
            break;
        }
      }
    }
    return updated;
  }

  private async updateDataSourceForForms(dataSource: IUFDataSource): Promise<void> {
    const forms = await lastValueFrom(this.formsDBService.getList());
    for (const form of forms) {
      const updatedForm = this.updateDataSourceForForm(form.rows, dataSource);
      if (updatedForm) {
        await lastValueFrom(this.formsDBService.update(Number(form.id), form));
      }
    }
  }

  private updateDataSourceForForm(rows: (IFLElement | IFLRow)[], dataSource: IUFDataSource): boolean {
    let updated = false;
    for (const item of rows) {
      if ((item as IFLElement).type === undefined && item.children) {
        if (item.children) {
          if (this.updateDataSourceForForm(item.children, dataSource)) {
            updated = true;
          }
        }
      } else {
        switch ((item as IFLElement).type) {
          case FLElementTypeEnum.Tabs:
            if (item.children) {
              for (const tab of item.children) {
                if (tab.children) {
                  if (this.updateDataSourceForForm(tab.children, dataSource)) {
                    updated = true;
                  }
                }
              }
            }
            break;
          case FLElementTypeEnum.Panel:
            if (item.children) {
              if (this.updateDataSourceForForm(item.children, dataSource)) {
                updated = true;
              }
            }
            break;
          case FLElementTypeEnum.Control:
            const element = item as IFLElement;
            if (element.controlType === FLControlTypeEnum.List) {
              if (element.controlProperties?.dataSource?.id === dataSource.id) {
                element.controlProperties.dataSource.source = dataSource.source;
                updated = true;
              }
            }
            break;
        }
      }
    }
    return updated;
  }
}
