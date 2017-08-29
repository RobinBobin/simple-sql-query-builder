import {
   StaticUtils,
   ArrayStringifier
} from "client-side-common-utils"
import Condition from "./Condition";

export default class WhereBuilder {
   constructor() {
      this.entries = [];
   }
   
   condition(condition) {
      this.conditionString = condition;
   }
   
   column(column) {
      return StaticUtils.pushAndReturnElement(
         this.entries, new Condition(column, this));
   }
   
   and() {
      return this.grouping(" AND ");
   }
   
   or() {
      return this.grouping(" OR ");
   }
   
   push() {
      return this.grouping("(");
   }
   
   pop() {
      return this.grouping(")");
   }
   
   grouping(grouping) {
      this.entries.push(grouping);
      
      return this;
   }
   
   toString(noWhere) {
      return new ArrayStringifier(this.entries)
         .setPrefix((noWhere ? "" : " WHERE ") + (this.
            conditionString || ""), !this.conditionString)
         .setSeparator("")
         .process();
   }
}
