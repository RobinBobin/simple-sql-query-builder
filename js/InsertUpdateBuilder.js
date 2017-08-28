import {
   StaticUtils,
   ArrayStringifier
} from "react-native-common-utils";
import BuilderWithWhere from "./BuilderWithWhere";

export default class InsertUpdateBuilder extends BuilderWithWhere {
   constructor(insert, table) {
      super();
      
      this.insert = insert;
      this.table = table;
      this.pairs = [];
   }
   
   columnValue(column, value, add = true, quoteIfString = true) {
      if (add) {
         this.pairs.push([column, value == "NULL" || !quoteIfString ?
            value : StaticUtils.quoteIfString(value)]);
      }
      
      return this;
   }
   
   where(callbackOrConditionString, add = true) {
      return super.where(callbackOrConditionString, add && !this.insert);
   }
   
   toString() {
      let str;
      
      if (this.insert) {
         const createList = index => new ArrayStringifier(this.pairs)
            .setPrefix(" (")
            .setElementProcessor(pair => pair[index])
            .setPostfix(")")
            .process();
         
         str = `INSERT INTO ${this.table}${createList(0)} VALUES${createList(1)};`;
      } else {
         str = new ArrayStringifier(this.pairs)
            .setPrefix(`UPDATE ${this.table} SET `)
            .setElementProcessor(pair => `${pair[0]} = ${pair[1]}`)
            .setPostfix(`${this.whereBuilder}`)
            .process();
      }
      
      return str;
   }
}
