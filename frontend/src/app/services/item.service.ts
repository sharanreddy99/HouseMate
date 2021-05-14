import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemSettings } from '../items/itemsettings';
import { baseUrl } from './baseUrl';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  postAddItem(itemSettings: ItemSettings,email: string,password: string, isDisabled: boolean): Observable<any>{
    return this.http.post(baseUrl+'addItem',{itemSettings,email,password,isDisabled});
  }

  postGetCategory(email: string,password: string): Observable<any> {
    return this.http.post(baseUrl+'getCategories',{email,password})
  }

  postGetItem(category: string,email: string,password: string): Observable<any> {
    return this.http.post(baseUrl+'getItems',{category,email,password})
  }

  getCurrentItemDetails(category: string,name: string, email: string,password: string): Observable<any> {
    return this.http.post(baseUrl+'getCurrentItem',{category,name,email,password})
  }
  
  postUpdateItem(oldItemSettings:ItemSettings,itemSettings: ItemSettings,email: string,password: string): Observable<any>{
    return this.http.patch(baseUrl+'updateItem',{oldItemSettings,itemSettings,email,password});
  }

  postDeleteItem(itemSettings: ItemSettings,email: string,password: string): Observable<any>{
    return this.http.post(baseUrl+'deleteItem',{itemSettings,email,password});
  }

  postRefillItem(itemSettings: ItemSettings, newstockcount: number, newquantity: number, newunits: string, email: string, password: string): Observable<any>{
    return this.http.post(baseUrl+'refillItem',{itemSettings,newstockcount,newquantity,newunits,email,password});
  }

  postRemoveItem(itemSettings: ItemSettings, newstockcount: number, newquantity: number, newunits: string, email: string, password: string): Observable<any>{
    return this.http.post(baseUrl+'removeItem',{itemSettings,newstockcount,newquantity,newunits,email,password});
  }

  postGetDisabledState(email: string, password: string): Observable<any>{
    return this.http.post(baseUrl+'getDisabled',{email,password});
  }

  postSetDisabledState(isDisabled: boolean, email: string, password: string): Observable<any>{
    return this.http.post(baseUrl+'setDisabled',{isDisabled,email,password});
  }

  postGetEstimatedItems(duration: number, dateduration: string, email: string, password: string): Observable<any>{
    return this.http.post(baseUrl+'getestimatedstock',{duration,dateduration,email,password});
  }

  postGetCompleteEstimatedItems(duration: number, dateduration: string, email: string, password: string): Observable<any>{
    return this.http.post(baseUrl+'getcompleteestimatedstock',{duration,dateduration,email,password});
  }

  postGetAllItems(email: string, password: string): Observable<any>{
    return this.http.post(baseUrl+'getallitems',{email,password});
  }

  postGetItemsForSummary(category: string, email: string, password: string): Observable<any>{
    return this.http.post(baseUrl+'getitemsforsummary',{category,email,password})
  }
}