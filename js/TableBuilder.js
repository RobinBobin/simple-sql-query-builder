import {
   StaticUtils,
   ArrayStringifier
} from "react-native-common-utils";
import Column from "./Column";
import UniqueBuilder  from "./UniqueBuilder";

export default class TableBuilder {
   constructor(name, ifNotExists = true) {
      this.name = name;
      this.ifNotExists = ifNotExists;
      this.entries = [];
   }
   
   integer(name) {
      return this.column(name, "INTEGER");
   }
   
   text(name) {
      return this.column(name, "TEXT");
   }
   
   blob(name) {
      return this.column(name, "BLOB");
   }
   
   column(name, type) {
      return StaticUtils.pushAndReturnElement(this.entries, new Column(name, type));
   }
   
   unique(callback) {
      callback(StaticUtils.pushAndReturnElement(this.entries, new UniqueBuilder()));
   }
   
   toString() {
      return new ArrayStringifier(this.entries)
         .setPrefix("CREATE TABLE" + (this.ifNotExists ?
            " IF NOT EXISTS" : "") + ` ${this.name} (`)
         .setPostfix(");")
         .process();
   }
}
