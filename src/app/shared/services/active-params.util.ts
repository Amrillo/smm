import { Params } from "@angular/router";
import { ActiveParamsType } from "src/types/active-params.type";

export class ActiveParamsUtil {

    static handleParams(params: Params) {

      const activeParams: ActiveParamsType = {category: []};

      if(params.hasOwnProperty('category')) {
         activeParams.category = Array.isArray(params['category']) ? params['category']: [params['category']];
      }

      if(params.hasOwnProperty('page')) {
         activeParams.page = params['page'];
      }

      return activeParams ;
    }
}
