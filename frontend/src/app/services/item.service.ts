import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemSettings } from '../items/itemsettings';
import { baseUrl, BASE_ITEM_PATH } from './baseUrl';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private http: HttpClient) {}

  postAddItem(
    itemSettings: ItemSettings,
    isDisabled: boolean
  ): Observable<any> {
    return this.http.post(baseUrl + BASE_ITEM_PATH + 'item', {
      itemSettings,
      isDisabled,
    });
  }

  postGetCategory(): Observable<any> {
    return this.http.get(baseUrl + BASE_ITEM_PATH + 'categories');
  }

  postGetItems(category: string): Observable<any> {
    return this.http.get(
      baseUrl + BASE_ITEM_PATH + 'item?category=' + category
    );
  }

  getCurrentItemDetails(category: string, name: string): Observable<any> {
    return this.http.get(
      baseUrl +
        BASE_ITEM_PATH +
        'details?category=' +
        category +
        '&name=' +
        name
    );
  }

  postUpdateItem(
    oldItemSettings: ItemSettings,
    itemSettings: ItemSettings
  ): Observable<any> {
    return this.http.patch(baseUrl + BASE_ITEM_PATH + 'item', {
      oldItemSettings,
      itemSettings,
    });
  }

  postDeleteItem(itemSettings: ItemSettings): Observable<any> {
    return this.http.post(baseUrl + BASE_ITEM_PATH + 'delete', {
      itemSettings,
    });
  }

  postRefillItem(
    itemSettings: ItemSettings,
    newstockcount: number,
    newquantity: number,
    newunits: string
  ): Observable<any> {
    return this.http.post(baseUrl + BASE_ITEM_PATH + 'refill/item', {
      itemSettings,
      newstockcount,
      newquantity,
      newunits,
    });
  }

  postRemoveItem(
    itemSettings: ItemSettings,
    newstockcount: number,
    newquantity: number,
    newunits: string
  ): Observable<any> {
    return this.http.post(baseUrl + BASE_ITEM_PATH + 'remove/item', {
      itemSettings,
      newstockcount,
      newquantity,
      newunits,
    });
  }

  postGetDisabledState(): Observable<any> {
    return this.http.get(baseUrl + BASE_ITEM_PATH + 'disabled');
  }

  postSetDisabledState(isDisabled: boolean): Observable<any> {
    return this.http.post(baseUrl + BASE_ITEM_PATH + 'disabled', {
      isDisabled,
    });
  }

  postGetEstimatedItems(
    duration: number,
    dateduration: string
  ): Observable<any> {
    return this.http.get(
      baseUrl +
        BASE_ITEM_PATH +
        'estimatedstock?duration=' +
        duration +
        '&dateduration=' +
        dateduration
    );
  }

  postGetCompleteEstimatedItems(
    duration: number,
    dateduration: string
  ): Observable<any> {
    return this.http.get(
      baseUrl +
        BASE_ITEM_PATH +
        'estimatedstock/complete?duration=' +
        duration +
        '&dateduration=' +
        dateduration
    );
  }

  postGetAllItems(): Observable<any> {
    return this.http.get(baseUrl + BASE_ITEM_PATH + 'all');
  }

  postGetItemsForSummary(category: string): Observable<any> {
    return this.http.get(
      baseUrl + BASE_ITEM_PATH + 'summary/all?category=' + category
    );
  }
}
