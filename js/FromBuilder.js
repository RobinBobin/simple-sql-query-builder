import { ArrayStringifier } from "simple-common-utils";

export default class FromBuilder {
   constructor(table) {
      this.table = table;
      this.joins = [];
   }
   
   innerJoin(table, field1, field2) {
      return this.addJoin("INNER JOIN", table, field1, field2);
   }
   
   leftOuterJoin(table, field1, field2) {
      return this.addJoin("LEFT OUTER JOIN", table, field1, field2);
   }
   
   rightOuterJoin(table, field1, field2) {
      return this.addJoin("RIGHT OUTER JOIN", table, field1, field2);
   }
   
   addJoin(joinType, table, field1, field2) {
      this.joins.push([joinType, table, field1, field2]);
      
      return this;
   }
   
   toString() {
      return this.table + new ArrayStringifier(this.joins)
         .setPrefix(" ")
         .setElementProcessor(join =>
            `${join[0]} ${join[1]} ON ${join[2]} = ${join[3]}`)
         .setSeparator(" ")
         .process();
   }
}
