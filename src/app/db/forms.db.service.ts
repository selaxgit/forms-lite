import { Injectable } from '@angular/core';

import { DBBase } from '../common/classes/base.db';
import { IForm } from '../common/interfaces';

@Injectable({ providedIn: 'root' })
export class FormsDBService extends DBBase<IForm> {
  protected readonly tableName = 'forms';
}
