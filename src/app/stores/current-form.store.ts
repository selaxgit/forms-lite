import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { finalize, Observable, Subject, Subscriber } from 'rxjs';

import { FORM_NEW } from '../common/constants';
import { StringHelpers } from '../common/helpers/string.helpers';
import {
  FLCreateElementType,
  FLElementTypeEnum,
  IFLElement,
  IFLRow,
  IForm,
  VerticalAlignEnum,
} from '../common/interfaces';
import { FormsDBService } from '../db/forms.db.service';
import { ElementsHelper } from '../modules/form-editor/helpers/elements.helper';

interface CurrentFormState {
  currentForm: IForm;
  hasChangedForm: boolean;
  is404Form: boolean;
  isLoadingState: boolean;
}

const NEW_FORM_NAME = 'Новая форма';
const initialState: CurrentFormState = {
  currentForm: {
    id: null,
    name: NEW_FORM_NAME,
    rows: [],
  },
  hasChangedForm: false,
  is404Form: false,
  isLoadingState: false,
};
export type ElementCommandType = 'toggle-autofill' | 'toggle-clear-button' | 'add-tab';

@Injectable({ providedIn: 'root' })
export class CurrentFormStore extends ComponentStore<CurrentFormState> {
  readonly is404Form = this.selectSignal((state: CurrentFormState) => state.is404Form);

  readonly hasChangedForm = this.selectSignal((state: CurrentFormState) => state.hasChangedForm);

  readonly currentFormName$ = this.select((state: CurrentFormState) => state.currentForm.name);

  readonly isLoadingState = this.selectSignal((state: CurrentFormState) => state.isLoadingState);

  readonly currentFormRows = this.selectSignal((state: CurrentFormState) => state.currentForm.rows);

  private readonly doElementSettings = new Subject<IFLElement>();

  readonly doElementSettings$ = this.doElementSettings.asObservable();

  private readonly currentFormChanged = new Subject<void>();

  readonly currentFormChanged$ = this.currentFormChanged.asObservable();

  private readonly formsDBService = inject(FormsDBService);

  private isEmptyForm = true;

  constructor() {
    super(initialState);
  }

  get currentForm(): IForm {
    return this.state().currentForm;
  }

  get currentFormId(): number | null {
    return this.state().currentForm.id;
  }

  get currentFormName(): string {
    return this.state().currentForm.name;
  }

  set currentFormName(value: string) {
    if (this.state().currentForm.name !== value) {
      this.setState((state: CurrentFormState) => {
        state.currentForm.name = value;
        state.hasChangedForm = true;
        return { ...state };
      });
    }
  }

  moveElement(
    fromRowGuid: string,
    fromIdx: number,
    toRowGuid: string | null,
    toIdx: number,
    toNewRow: boolean = false,
  ): void {
    let fromRows: IFLRow[] | null = null;
    let toRows: IFLRow[] | null = null;
    if (fromRowGuid) {
      const element = ElementsHelper.getElementByGuid(fromRowGuid, this.state().currentForm.rows);
      if (Array.isArray(element?.children)) {
        fromRows = element.children as IFLRow[];
      }
    }
    if (toRowGuid) {
      if (toRowGuid === fromRowGuid) {
        toRows = fromRows;
      } else {
        const element = ElementsHelper.getElementByGuid(toRowGuid, this.state().currentForm.rows);
        if (Array.isArray(element?.children)) {
          toRows = element.children as IFLRow[];
        }
      }
    } else {
      toRows = this.state().currentForm.rows;
    }

    if (fromRows === null || toRows === null) {
      return;
    }
    const deleteElements = fromRows.splice(fromIdx, 1);
    let insertElement = deleteElements[0];
    if (fromRows.length === 0) {
      const parent = ElementsHelper.getParentByElementGuid(String(fromRowGuid), this.state().currentForm.rows);
      const rows: IFLRow[] = parent === null ? this.state().currentForm.rows : ((parent.children as IFLRow[]) ?? []);
      const idx = rows.findIndex((i: IFLRow) => i.guid === fromRowGuid);
      if (idx >= 0) {
        rows.splice(idx, 1);
      }
    }
    if (fromRowGuid === toRowGuid && toIdx > fromIdx) {
      toIdx--;
    }
    if (toNewRow) {
      insertElement = {
        guid: StringHelpers.uuidv4(),
        verticalAlign: VerticalAlignEnum.Middle,
        children: [insertElement as unknown as IFLElement],
      };
    }
    if (toIdx > toRows.length) {
      toRows.push(insertElement);
    } else {
      toRows.splice(toIdx, 0, insertElement);
    }
    this.setChangedForm();
  }

  moveRow(fromRowGuid: string | null, fromIdx: number, toRowGuid: string | null, toIdx: number): void {
    let fromRows: IFLRow[] | null = null;
    let toRows: IFLRow[] | null = null;
    if (fromRowGuid === null) {
      fromRows = this.state().currentForm.rows;
    } else {
      const element = ElementsHelper.getElementByGuid(fromRowGuid, this.state().currentForm.rows);
      if (Array.isArray(element?.children)) {
        fromRows = element.children as IFLRow[];
      }
    }
    if (toRowGuid === null) {
      toRows = this.state().currentForm.rows;
    } else {
      const element = ElementsHelper.getElementByGuid(toRowGuid, this.state().currentForm.rows);
      if (Array.isArray(element?.children)) {
        toRows = element.children as IFLRow[];
      }
    }

    if (fromRows === null || toRows === null) {
      return;
    }
    const deleteRows = fromRows.splice(fromIdx, 1);
    const insertRow = deleteRows[0];
    if (toIdx === -1) {
      toRows.push(insertRow);
    } else {
      if (fromRowGuid === toRowGuid && toIdx > fromIdx) {
        toIdx--;
      }
      toRows.splice(toIdx, 0, insertRow);
    }
    this.setChangedForm();
  }

  updateElementSettings(element: IFLElement): void {
    if (ElementsHelper.findAndUpdateElement(element, this.state().currentForm.rows)) {
      this.setChangedForm();
    }
  }

  fireElementSettings(element: IFLElement): void {
    this.doElementSettings.next(element);
  }

  setRowVerticalAlign(guid: string, value: VerticalAlignEnum): void {
    const row = ElementsHelper.getElementByGuid(guid, this.state().currentForm.rows) as IFLRow;
    if (row) {
      row.verticalAlign = value;
      this.setChangedForm();
    }
  }

  runElementCommand(guid: string, command: ElementCommandType): void {
    const element = ElementsHelper.getElementByGuid(guid, this.state().currentForm.rows) as IFLElement;
    if (!element) {
      return;
    }
    switch (command) {
      case 'add-tab':
        element.children?.push(ElementsHelper.getEmptyElement(FLElementTypeEnum.Tab));
        break;
      case 'toggle-autofill':
        element.autofill = !element.autofill;
        break;
      case 'toggle-clear-button':
        if (element.controlProperties) {
          element.controlProperties.clearButton = !element.controlProperties.clearButton;
        }
        break;
    }
    this.setChangedForm();
  }

  removeElement(rowGuid: string, elementGuid: string): void {
    const currentRows = this.state().currentForm.rows;
    const element = ElementsHelper.getElementByGuid(rowGuid, currentRows);
    const rows: IFLRow[] = Array.isArray(element?.children) ? (element.children as IFLRow[]) : currentRows;
    const idx = rows.findIndex((i: IFLRow) => i.guid === elementGuid);
    if (idx >= 0) {
      rows.splice(idx, 1);
      if (rows.length === 0) {
        const parent = ElementsHelper.getParentByElementGuid(rowGuid, currentRows);
        if (parent) {
          const idxRow = (parent.children || []).findIndex((i: IFLRow | IFLElement) => i.guid === rowGuid);
          if (idxRow >= 0) {
            parent.children?.splice(idxRow, 1);
          }
        } else {
          const idxRow = currentRows.findIndex((i: IFLRow | IFLElement) => i.guid === rowGuid);
          if (idxRow >= 0) {
            currentRows.splice(idxRow, 1);
          }
        }
      }
      this.setChangedForm();
    }
  }

  removeRow(parentGuid: string | null, rowGuid: string): void {
    const element = ElementsHelper.getElementByGuid(parentGuid, this.state().currentForm.rows);
    const rows: IFLRow[] = Array.isArray(element?.children)
      ? (element.children as IFLRow[])
      : this.state().currentForm.rows;
    const idx = rows.findIndex((i: IFLRow) => i.guid === rowGuid);
    if (idx >= 0) {
      rows.splice(idx, 1);
      this.setChangedForm();
    }
  }

  addElementToRow(rowGuid: string, typeElement: FLCreateElementType, idx: number = 0): void {
    const row = ElementsHelper.getElementByGuid(rowGuid, this.state().currentForm.rows);
    if (Array.isArray(row?.children)) {
      row.children.splice(idx, 0, ElementsHelper.getEmptyElement(typeElement));
      this.setChangedForm();
    }
  }

  addRowWithElement(parentGuid: string | null, typeElement: FLCreateElementType, idx: number = 0): void {
    const rows = ElementsHelper.getRowsByParentGuid(parentGuid, this.state().currentForm.rows);
    if (rows === null) {
      return;
    }
    rows.splice(idx, 0, {
      guid: StringHelpers.uuidv4(),
      verticalAlign: VerticalAlignEnum.Middle,
      children: [ElementsHelper.getEmptyElement(typeElement)],
    });
    this.setChangedForm();
  }

  saveForm(): Observable<IForm> {
    return new Observable<IForm>((observe: Subscriber<IForm>) => {
      const currentForm = this.state().currentForm;
      this.patchState({ isLoadingState: true });
      if (currentForm.id) {
        this.formsDBService
          .update(currentForm.id, {
            name: currentForm.name,
            rows: currentForm.rows,
          })
          .pipe(finalize(() => this.patchState({ isLoadingState: false })))
          .subscribe((form: IForm) => {
            this.patchState({ hasChangedForm: false });
            observe.next(form);
            observe.complete();
          });
      } else {
        this.formsDBService
          .insert({
            name: currentForm.name,
            rows: currentForm.rows,
          })
          .pipe(finalize(() => this.patchState({ isLoadingState: false })))
          .subscribe((form: IForm) => {
            this.setState((state: CurrentFormState) => {
              state.currentForm.id = form.id;
              state.hasChangedForm = false;
              return { ...state };
            });
            observe.next(form);
            observe.complete();
          });
      }
    });
  }

  loadForm(id: string | null, isViewForm: boolean = false): void {
    if (id && this.state().currentForm.id === Number(id)) {
      return;
    }
    if (id === FORM_NEW) {
      if (!this.isEmptyForm) {
        return;
      } else if (isViewForm) {
        this.patchState({ ...initialState, is404Form: true });
        return;
      }
      this.patchState({
        currentForm: {
          id: null,
          name: `${NEW_FORM_NAME} (${new Date().toLocaleString()})`,
          rows: [],
        },
        hasChangedForm: true,
        is404Form: false,
      });
      this.isEmptyForm = false;
    } else if (!id || isNaN(parseInt(id, 10))) {
      this.patchState({ ...initialState, is404Form: true });
    } else {
      this.patchState({ isLoadingState: true });
      this.formsDBService
        .get(Number(id))
        .pipe(finalize(() => this.patchState({ isLoadingState: false })))
        .subscribe((form: IForm | null) => {
          if (!form) {
            this.patchState({ ...initialState, is404Form: true });
          } else {
            this.isEmptyForm = false;
            this.patchState({
              currentForm: form,
              hasChangedForm: false,
            });
          }
        });
    }
  }

  setEmptyForm(): void {
    this.isEmptyForm = true;
    this.patchState(initialState);
  }

  private setChangedForm(): void {
    this.patchState({ hasChangedForm: true });
    this.currentFormChanged.next();
  }
}
