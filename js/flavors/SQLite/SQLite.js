import UpsertBuilder from "./UpsertBuilder";
import Flavor from "../Flavor";
import SqlBuilder from "../../SqlBuilder";

export default class SQLite extends Flavor {
  static extend() {
    SqlBuilder.upsert = SQLite.__upsert;
  }
  
  static reset() {
    delete SqlBuilder.upsert;
  }
  
  static __upsert(table, callback, debug = false) {
    return SqlBuilder.prepareAndExecute(callback, new UpsertBuilder(table), debug);
  }
};
