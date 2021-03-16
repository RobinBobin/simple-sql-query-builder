import {
   StaticUtils,
   ArrayStringifier
} from "simple-common-utils";
import Column from "./Column";
import UniqueBuilder  from "./UniqueBuilder";

export default class TableBuilder {
   constructor(name, ifNotExists = true) {
      this.name = name;
      this.ifNotExists = ifNotExists;
      this.entries = [];
   }
   
   blob(name) {
      return this.column(name, "BLOB");
   }
   
   column(name, type) {
      return StaticUtils.pushAndReturnElement(this.entries, new Column(name, type));
   }
   
   integer(name) {
      return this.column(name, "INTEGER");
   }
   
   real(name) {
      return this.column(name, "REAL");
   }
   
   text(name) {
      return this.column(name, "TEXT");
   }
   
   toString() {
      return new ArrayStringifier(this.entries)
         .setPrefix("CREATE TABLE" + (this.ifNotExists ?
            " IF NOT EXISTS" : "") + ` ${this.name} (`)
         .setPostfix(")")
         .process();
   }
   
   unique(callback) {
      callback(StaticUtils.pushAndReturnElement(this.entries, new UniqueBuilder()));
   }
}
