import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { JSTDialogService, JSTFileHelper } from '@jst/ui';
import { provideComponentStore } from '@ngrx/component-store';

import { FORM_EDITOR_URL, FORM_NEW, FORM_VIEW_URL } from '../../common/constants';
import { IForm } from '../../common/interfaces';
import { FormsStore } from '../../stores/forms.store';

@Component({
  selector: 'forms-list',
  imports: [AsyncPipe, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatCardModule],
  templateUrl: './forms-list.component.html',
  styleUrl: './forms-list.component.scss',
  providers: [provideComponentStore(FormsStore)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsListComponent {
  readonly formsStore = inject(FormsStore);

  private readonly router = inject(Router);

  private readonly jstDialogService = inject(JSTDialogService);

  onEditForm(form?: IForm): void {
    this.router.navigate([FORM_EDITOR_URL, form?.id ?? FORM_NEW]);
  }

  onViewForm(form: IForm): void {
    this.router.navigate([FORM_VIEW_URL, form.id]);
  }

  onImportForm(): void {
    JSTFileHelper.uploadJson().subscribe((form: Partial<IForm>) => {
      this.formsStore.importForm(form);
    });
  }

  onExportForm(form: IForm): void {
    const json = JSON.parse(JSON.stringify(form));
    delete json.id;
    JSTFileHelper.downloadJson(json, `${form.name}.json`);
  }

  onRemoveForm(form: IForm): void {
    this.jstDialogService
      .showConfirm('Вы действительно хотите удалить эту форму?', 'Удаление формы', 'Удалить форму')
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this.formsStore.removeForm(Number(form.id));
        }
      });
  }
}
