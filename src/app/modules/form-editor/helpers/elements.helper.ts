import { StringHelpers } from '../../../common/helpers/string.helpers';
import {
  FLControlTypeEnum,
  FLCreateElementType,
  FLElementTypeEnum,
  IFLElement,
  IFLRow,
} from '../../../common/interfaces';

export class ElementsHelper {
  public static findAndUpdateElement(element: IFLElement, rows: (IFLElement | IFLRow)[]): boolean {
    let idx: number | null = null;
    for (const [i, item] of rows.entries()) {
      if (item.guid === element.guid) {
        idx = i;
        break;
      }
      if (item.children) {
        if (ElementsHelper.findAndUpdateElement(element, item.children)) {
          return true;
        }
      }
    }
    if (idx !== null) {
      rows.splice(idx, 1, element);
      return true;
    }
    return false;
  }

  public static getParentByElementGuid(guid: string, rows: (IFLElement | IFLRow)[]): IFLElement | IFLRow | null {
    for (const item of rows) {
      if ((item as IFLElement).type === undefined && item.guid) {
        if (item.children) {
          if (item.children.some((i: IFLElement | IFLRow) => i.guid === guid)) {
            return item;
          }
          const element = ElementsHelper.getParentByElementGuid(guid, item.children);
          if (element) {
            return element;
          }
        }
      } else {
        switch ((item as IFLElement).type) {
          case FLElementTypeEnum.Tabs:
            if (item.children) {
              for (const tab of item.children) {
                if (tab.children) {
                  if (tab.children.some((i: IFLElement | IFLRow) => i.guid === guid)) {
                    return tab;
                  }
                  const element = ElementsHelper.getParentByElementGuid(guid, tab.children);
                  if (element) {
                    return element;
                  }
                }
              }
            }
            break;
          case FLElementTypeEnum.Panel:
            if (item.children) {
              if (item.children.some((i: IFLElement | IFLRow) => i.guid === guid)) {
                return item;
              }
              const element = ElementsHelper.getParentByElementGuid(guid, item.children);
              if (element) {
                return element;
              }
            }
            break;
        }
      }
    }
    return null;
  }

  public static getElementByGuid(guid: string | null, rows: (IFLElement | IFLRow)[]): IFLElement | IFLRow | null {
    if (!guid) {
      return null;
    }
    for (const item of rows) {
      if ((item as IFLElement).type === undefined && item.guid) {
        if (item.guid === guid) {
          return item as IFLRow;
        }
        if (item.children) {
          const element = ElementsHelper.getElementByGuid(guid, item.children);
          if (element) {
            return element;
          }
        }
      } else {
        switch ((item as IFLElement).type) {
          case FLElementTypeEnum.Tabs:
            if (item.guid === guid) {
              return item as IFLElement;
            }
            if (item.children) {
              for (const tab of item.children) {
                if (tab.guid === guid) {
                  return tab as IFLElement;
                }
                if (tab.children) {
                  const element = ElementsHelper.getElementByGuid(guid, tab.children);
                  if (element) {
                    return element;
                  }
                }
              }
            }
            break;
          case FLElementTypeEnum.Panel:
            if (item.guid === guid) {
              return item as IFLElement;
            }
            if (item.children) {
              const element = ElementsHelper.getElementByGuid(guid, item.children);
              if (element) {
                return element;
              }
            }
            break;
          default:
            if (item.guid === guid) {
              return item as IFLElement;
            }
        }
      }
    }
    return null;
  }

  public static getRowsByParentGuid(parentGuid: string | null, rows: (IFLElement | IFLRow)[]): IFLRow[] | null {
    if (parentGuid === null) {
      return rows as IFLRow[];
    }
    const element = ElementsHelper.getElementByGuid(parentGuid, rows);
    return Array.isArray(element?.children) ? (element.children as IFLRow[]) : null;
  }

  public static getEmptyElement(typeElement: FLCreateElementType): IFLElement {
    switch (typeElement) {
      case FLElementTypeEnum.Tabs:
        return {
          guid: StringHelpers.uuidv4(),
          id: '',
          type: FLElementTypeEnum.Tabs,
          autofill: true,
          label: '',
          visible: true,
          disabled: false,
          children: [ElementsHelper.getEmptyElement(FLElementTypeEnum.Tab)],
        };
      case FLElementTypeEnum.Tab:
        return {
          id: '',
          guid: StringHelpers.uuidv4(),
          type: FLElementTypeEnum.Tab,
          label: 'Вкладка',
          autofill: false,
          visible: true,
          disabled: false,
          children: [],
        };
      case FLElementTypeEnum.Panel:
        return {
          id: '',
          guid: StringHelpers.uuidv4(),
          type: FLElementTypeEnum.Panel,
          label: 'Панель',
          autofill: false,
          visible: true,
          disabled: false,
          children: [],
        };
      default:
        return {
          id: '',
          guid: StringHelpers.uuidv4(),
          type: FLElementTypeEnum.Control,
          controlType: typeElement as FLControlTypeEnum,
          label: `Контрол: "${ElementsHelper.typeControlToString(typeElement as FLControlTypeEnum)}"`,
          autofill: false,
          visible: true,
          disabled: false,
          controlProperties: {
            bindDTO: null,
            clearButton: true,
            readonly: false,
            required: false,
            usePrefix: false,
            prefixIcon: null,
            prefixHint: null,
            useSuffix: false,
            suffixIcon: null,
            suffixHint: null,
          },
        };
    }
  }

  public static typeElementToString(element: IFLElement): string {
    switch (element.type) {
      case FLElementTypeEnum.Tabs:
        return 'Вкладки';
      case FLElementTypeEnum.Panel:
        return 'Панель';
      case FLElementTypeEnum.Control:
        return ElementsHelper.typeControlToString(element.controlType);
      default:
        return 'Неизвестен';
    }
  }

  public static typeControlToString(controlType?: FLControlTypeEnum): string {
    switch (controlType) {
      case FLControlTypeEnum.Text:
        return 'Текст';
      case FLControlTypeEnum.List:
        return 'Список';
      case FLControlTypeEnum.Number:
        return 'Число';
      case FLControlTypeEnum.Datetime:
        return 'Дата/Время';
      case FLControlTypeEnum.Checkbox:
        return 'Флажок';
      default:
        return 'Неизвестен';
    }
  }
}
