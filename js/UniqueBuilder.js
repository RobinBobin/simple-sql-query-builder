import {
   StaticUtils,
   ArrayStringifier
} from "react-native-common-utils";
import Entry from "./Entry";

class UniqueEntry extends Entry{
   constructor(name) {
      super(name);
   }
   
   collate(collation) {
      return this.attr(`COLLATE ${collation}`);
   }
   
   order(direction) {
      return this.attr(direction);
   }
   
   toString() {
      return this.name + new ArrayStringifier(this.attrs)
         .setPrefix(" ")
         .setSeparator(" ")
         .process();
   }
}

export default class UniqueBuilder {
   constructor() {
      this.entries = [];
   }
   
   column(name) {
      return StaticUtils.pushAndReturnElement(this.entries, new UniqueEntry(name));
   }
   
   toString() {
      return new ArrayStringifier(this.entries)
         .setPrefix("UNIQUE (")
         .setPostfix(")")
         .process();
   }
}
