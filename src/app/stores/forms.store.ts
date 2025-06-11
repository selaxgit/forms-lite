import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { finalize } from 'rxjs';

import { IForm } from '../common/interfaces';
import { FormsDBService } from '../db/forms.db.service';

interface FormsState {
  forms: IForm[];
  isLoadingState: boolean;
}

const initialState: FormsState = {
  forms: [],
  isLoadingState: false,
};

@Injectable({ providedIn: 'root' })
export class FormsStore extends ComponentStore<FormsState> implements OnStoreInit {
  readonly isLoadingState = this.selectSignal((state: FormsState) => state.isLoadingState);

  readonly formsList$ = this.select((state: FormsState) => state.forms);

  readonly formsListSig$ = this.selectSignal((state: FormsState) => state.forms);

  private readonly formsDBService = inject(FormsDBService);

  constructor() {
    super(initialState);
  }

  ngrxOnStoreInit(): void {
    this.patchState({ forms: [], isLoadingState: true });
    this.formsDBService
      .getList()
      .pipe(finalize(() => this.patchState({ isLoadingState: false })))
      .subscribe((forms: IForm[]) => {
        this.patchState({ forms });
      });
  }

  reload(): void {
    this.ngrxOnStoreInit();
  }

  importForm(form: Partial<IForm>): void {
    this.patchState({ isLoadingState: true });
    this.formsDBService
      .insert(form)
      .pipe(finalize(() => this.patchState({ isLoadingState: false })))
      .subscribe((newForm: IForm) => {
        this.setState((state: FormsState) => {
          state.forms.push(newForm);
          return { ...state };
        });
      });
  }

  removeForm(id: number): void {
    this.patchState({ isLoadingState: true });
    this.formsDBService
      .remove(id)
      .pipe(finalize(() => this.patchState({ isLoadingState: false })))
      .subscribe(() => {
        this.setState((state: FormsState) => {
          state.forms = state.forms.filter((form: IForm) => form.id !== id);
          return { ...state };
        });
      });
  }
}
