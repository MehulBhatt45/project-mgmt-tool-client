import { Pipe, PipeTransform,Injectable } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
	name: 'searchTask',
	// pure: false
})
@Injectable({
	providedIn: 'root'
})
export class SearchTaskPipe implements PipeTransform {

	transform(items: any[], searchText: string): any[] {
		// console.log("items==>",items);
		// console.log("searchtext===>",searchText);
		// return null;
		var task:any = [];
		if(!items) return [];
		if(!searchText) return items;
		searchText = searchText.toLowerCase();
			task = items.filter( it => {
				if(it.title.toLowerCase().includes(searchText) || it.uniqueId.toLowerCase().includes(searchText)){
					return it;
				}

			});
		// for(var i=0;i<items.length;i++){
		// }
		return task;
	}

}
