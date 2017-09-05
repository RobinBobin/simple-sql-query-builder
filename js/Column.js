import { ArrayStringifier } from "simple-common-utils";
import Entry from "./Entry";

export default class Column extends Entry {
   constructor(name, type) {
      super(name);
      
      this.type = type;
   }
   
   primary() {
      return this.attr("PRIMARY KEY");
   }
   
   foreign(tableName, columnName) {
      return this.attr(`REFERENCES ${tableName}(${columnName})`);
   }
   
   onDelete(action) {
      return this.attr(`ON DELETE ${action}`);
   }
   
   notNull() {
      return this.attr("NOT NULL");
   }
   
   toString() {
      return `${this.name} ${this.type}` + new ArrayStringifier(this.attrs)
         .setPrefix(" ")
         .setSeparator(" ")
         .process();
   }
}
