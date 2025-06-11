import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { JSTInputModule } from '@jst/ui';

import { FLElementTypeEnum, IFLElement } from '../../../../common/interfaces';
import { ElementsHelper } from '../../helpers/elements.helper';
import { FETrueFalseCondComponent } from '../true-false-cond/true-false-cond.component';

@Component({
  selector: 'tabs-settings',
  imports: [
    CommonModule,
    DragDropModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    JSTInputModule,
    FETrueFalseCondComponent,
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FETabsSettingsComponent {
  @Input() element!: IFLElement;

  onRemoveTab(idx: number): void {
    this.element.children?.splice(idx, 1);
  }

  onAddTab(): void {
    if (Array.isArray(this.element.children)) {
      this.element.children.push(ElementsHelper.getEmptyElement(FLElementTypeEnum.Tab));
    }
  }

  onDropListDropped(event: CdkDragDrop<IFLElement[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }
}
