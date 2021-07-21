import UpsertBuilder from "./UpsertBuilder";
import Flavor from "../Flavor";
import SqlBuilder from "../../SqlBuilder";
import TableBuilder from "../../TableBuilder";

export default class SQLite extends Flavor {
  static extend() {
    // = Upsert = //
    SqlBuilder.upsert = SQLite.__upsert;
    
    // = CREATE TABLE WITHOUT ROWID = //
    TableBuilder.prototype.withoutRowid = function(withoutRowid = true) {
      this.__withoutRowid = withoutRowid;
    }
    
    TableBuilder.prototype._finalizeToStringProcessing = function(str) {
      return this.__withoutRowid ? `${str} WITHOUT ROWID` : str;
    }
  }
  
  static reset() {
    // = Upsert = //
    delete SqlBuilder.upsert;
    
    // = CREATE TABLE WITHOUT ROWID = //
    delete TableBuilder.prototype.withoutRowid;
    delete TableBuilder.prototype._finalizeToStringProcessing;
  }
  
  static async __upsert(table, callback, debug = false) {
    let result;
    
    const upsertBuilder = new UpsertBuilder(table);
    
    try {
      result = await SqlBuilder.prepareAndExecute(callback, upsertBuilder, debug);
    } catch (error_upsert) {
      if (error_upsert.message.indexOf("SQLITE_ERROR") === -1) {
        throw error_upsert;
      }
      
      try {
        result = await SqlBuilder.insert(
          table,
          ib => {
            upsertBuilder.pairs.forEach(pair => ib.columnValue(...pair, true, false));
            
            return ib;
          },
          debug);
      } catch (error_insert) {
        if (error_insert.message.indexOf("SQLITE_CONSTRAINT_PRIMARYKEY") === -1
          && error_insert.message.indexOf("SQLITE_CONSTRAINT_UNIQUE") === -1) {
          throw error_insert;
        }
        
        const columnName = error_insert.message.substring(
          `UNIQUE constraint failed: ${table}.`.length,
          error_insert.message.indexOf(" (code "));
        
        result = await SqlBuilder.update(
          table,
          ub => {
            upsertBuilder.pairs.forEach(pair => ub.columnValue(...pair, pair[0] !== columnName, false));
            
            ub.where(wb => wb
              .column(columnName)
                .e(upsertBuilder.pairs.find(pair => pair[0] === columnName)[1], false));
            
            return ub;
          },
          debug);
      }
    }
    
    return result;
  }
};
