import { Injectable } from '@angular/core';

import { DBBase } from '../common/classes/base.db';
import { IUFDto } from '../common/interfaces';

@Injectable({ providedIn: 'root' })
export class DtoDBService extends DBBase<IUFDto> {
  protected readonly tableName = 'dto';
}
