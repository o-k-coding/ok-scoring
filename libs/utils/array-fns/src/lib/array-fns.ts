/**
 * Given an array of values, swap the values at the given indexes
 * If there are no items at either index, do nothing
 * @param arr
 * @param i1
 * @param i2
 */
export function swap<T = any>(arr: T[], i1: number, i2: number) {
  if (!arr?.length || !arr[i1] || !arr[i2]) {
    return arr;
  }
  const copy = [...arr];
  [copy[i1], copy[i2]] = [copy[i2], copy[i1]]
  return copy;
}

/**
 * Converts an array of strings into a single comma separate string
 * If the number of values in the array exceed the max, truncate the exces and
 * add an ellipsis (...) to the string.
 * @param values
 * @param max
 */
export function commaSeperateWithEllipsis(values: string[], max = 5): string {
  if (values.length > max) {
    values = [...values.slice(0, max), `+${values.length - max}...`];
  }
  return values.join(', ')
}

/**
 * Given an array of items that have a string key property, and a new item of the same type
 * add the new item if there is no existing item with the same key, otherwise replace the existing item
 * with the new one
 * @param arr
 * @param item
 */
export function addOrReplaceByKey<T extends { key: string }>(arr: T[], item: T): T[] {
  const arrCopy = [...arr];
  const existingItemIndex = arrCopy.findIndex(i => i.key === item.key);
  if (existingItemIndex !== -1) {
    arrCopy.splice(existingItemIndex, 1, item);
  } else {
    arrCopy.push(item);
  }
  return arrCopy;
}

export function removeByKey<T extends { key: string }>(arr: T[], key: string): T[] {
  return arr.filter(i => i.key !== key);
}

export interface Sort<T> {
  sortProp: keyof T;
  asc: boolean;
}

export function sort<T>(items: T[], { sortProp, asc }: Sort<T>): T[] {
  return items.sort((a, b) => {
    const aValue = a[sortProp];
    const bValue = b[sortProp];
    let sortDown; // Whether a should be set to a lower index than b
    // Use == null so that 0 annd false can be compared properly
    if (aValue == null || bValue == null) {
      // If we are ascending, the undefined/null values should be pushed to the start of the array
      sortDown = asc ? !!bValue && !aValue : false;
    } else {
      // If we want ascending, the lower value should be pushed to the front of the array
      sortDown = asc ? aValue < bValue : aValue > bValue;
    }
    // if a should be sorted to a lower index than b, return -1 else 1
    return sortDown ? -1 : 1;
  });
}

export function flatMap<T>(items: T[], selector: (i: T) => any = (i) => i): any[] {
  return items?.reduce((flattenedItems, item) => {
    const selectedItem = !!item && typeof item === 'object' ? selector(item) : item;
    if (Array.isArray(selectedItem)) {
      Array.prototype.push.apply(flattenedItems, flatMap(selectedItem, selector));
    } else {
      flattenedItems.push(selectedItem);
    }
    return flattenedItems
  }, []);
}
