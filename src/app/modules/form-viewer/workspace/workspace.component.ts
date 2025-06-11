import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';

import { IFLRow, IUFDto } from '../../../common/interfaces';
import { WorkspaceService } from './services/workspace.service';
import { UIModule } from './ui/ui.module';

@Component({
  selector: 'fv-workspace',
  imports: [UIModule],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss',
  providers: [WorkspaceService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FVWorkspaceComponent {
  @Input() set rows(value: IFLRow[]) {
    this.rowsList = value;
    this.workspaceService.init(value);
  }

  @Input() set dto(dto: IUFDto | null) {
    this.workspaceService.setDto(dto);
  }

  rowsList: IFLRow[] = [];

  readonly workspaceService = inject(WorkspaceService);
}
