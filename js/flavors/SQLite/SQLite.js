import UpsertBuilder from "./UpsertBuilder";
import Flavor from "../Flavor";
import SqlBuilder from "../../SqlBuilder";
import TableBuilder from "../../TableBuilder";

export default class SQLite extends Flavor {
  static extend() {
    SqlBuilder.upsert = SQLite.__upsert;
    
    TableBuilder.prototype.withoutRowid = function(withoutRowid = true) {
      this.__withoutRowid = withoutRowid;
    }
    
    TableBuilder.prototype._finalizeToStringProcessing = function(str) {
      return this.__withoutRowid ? `${str} WITHOUT ROWID` : str;
    }
  }
  
  static reset() {
    delete SqlBuilder.upsert;
    
    delete TableBuilder.prototype.withoutRowid;
    delete TableBuilder.prototype._finalizeToStringProcessing;
  }
  
  static __upsert(table, callback, debug = false) {
    return SqlBuilder.prepareAndExecute(callback, new UpsertBuilder(table), debug);
  }
};
