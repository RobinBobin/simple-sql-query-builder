import {
   StaticUtils,
   ArrayStringifier
} from "simple-common-utils";
import BuilderWithWhere from "./BuilderWithWhere";
import FromBuilder from "./FromBuilder";

export default class SelectBuilder extends BuilderWithWhere {
   constructor() {
      super();
      
      this.columns = [];
      this.froms = [];
      this.orderBys = [];
      this.limitString = "";
   }
   
   column(column, alias) {
      this.columns.push(alias ? [column, alias] : column);
      
      return this;
   }
   
   from(table, callback) {
      const fb = StaticUtils.pushAndReturnElement(
         this.froms, new FromBuilder(table));
      
      if (callback) {
         callback(fb);
      }
      
      return this;
   }
   
   orderBy(column, direction = "ASC") {
      this.orderBys.push(`${column} ${direction}`);
      
      return this;
   }
   
   limit(limit, add = true) {
      if (add) {
         this.limitString = ` LIMIT ${limit}`;
      }
      
      return this;
   }
   
   toString() {
      return new ArrayStringifier(this.columns)
         .setPrefix("SELECT ")
         .setElementProcessor(column => Array.isArray(column) ?
            `${column[0]} AS ${column[1]}` : column)
         .process()
         
         + new ArrayStringifier(this.froms)
            .setPrefix(" FROM ")
            .process()
         
         + this.whereBuilder
         
         + new ArrayStringifier(this.orderBys)
            .setPrefix(" ORDER BY ")
            .process()
         
         + `${this.limitString}`;
   }
}
