import {
  ArrayStringifier,
  StaticUtils
} from "simple-common-utils";
import Entry from "./Entry";
import SqlBuilderOptions from "./SqlBuilderOptions";

export default class Column extends Entry {
  constructor(name, type) {
    super(name);
    
    this.type = type;
  }
  
  default(value) {
    return this.attr(`DEFAULT ${StaticUtils.quoteIfString(value, SqlBuilderOptions.getQuotingSymbol())}`);
  }
  
  foreign(tableName, columnName) {
    return this.attr(`REFERENCES ${tableName}(${columnName})`);
  }
  
  notNull() {
    return this.attr("NOT NULL");
  }
  
  onDelete(action) {
    return this.attr(`ON DELETE ${action}`);
  }
  
  primary() {
    return this.attr("PRIMARY KEY");
  }
  
  toString() {
    return `${this.name} ${this.type}` + new ArrayStringifier(this.attrs)
      .setPrefix(" ")
      .setSeparator(" ")
      .process();
  }
}
