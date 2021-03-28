import InsertUpdateBuilder from "./InsertUpdateBuilder";
import SelectBuilder from "./SelectBuilder";
import SqlBuilderOptions from "./SqlBuilderOptions";
import TableBuilder from "./TableBuilder";
import WhereBuilder from "./WhereBuilder";
import PG from "./flavors/PG";

function executeSql(callback, obj, debug = false) {
  callback(obj);
  
  return SqlBuilder.executeSql(obj.toString(), debug);
}

export default class SqlBuilder {
  static PG = PG;
  
  static beginTransaction(debug = false) {
    return SqlBuilder.executeSql("BEGIN TRANSACTION", debug);
  }
  
  static commit(debug = false) {
    return SqlBuilder.executeSql("COMMIT", debug);
  }
  
  static createTable(name, callback, ifNotExists = true, debug = false) {
    return executeSql(callback, new TableBuilder(name, ifNotExists), debug);
  }
  
  static delete(table, callbackOrWhere, debug = false) {
    let where;
    
    if (callbackOrWhere.constructor != Function) {
      where = callbackOrWhere;
    } else {
      where = new WhereBuilder();
      
      callbackOrWhere(where);
    }
    
    return SqlBuilder.executeSql(`DELETE FROM ${table}${where}`, debug);
  }
  
  static executeSql(sql, debug = false) {
    const s = `${sql};`;
    
    if (SqlBuilder.__debug || debug) {
      console.log(s);
    }
    
    return SqlBuilder.__sqlExecutor && !SqlBuilder.__formatOnly ? SqlBuilder.__sqlExecutor(s) : s;
  }
  
  static getColumnNameQuotingSymbol() {
    return SqlBuilderOptions.getColumnNameQuotingSymbol();
  }
  
  static getQuotingSymbol() {
    return SqlBuilderOptions.getQuotingSymbol();
  }
  
  static insert(table, callback, debug = false) {
    return executeSql(callback, new InsertUpdateBuilder(true, table), debug);
  }
  
  static rollback(debug = false) {
    return SqlBuilder.executeSql("ROLLBACK", debug);
  }
  
  static select(callback, asSubquery, debug = false) {
    const sb = new SelectBuilder();
    
    let result;
    
    if (!asSubquery) {
      result = executeSql(callback, sb, debug);
    } else {
      callback(sb);
      
      result = `(${sb})`;
    }
    
    return result;
  }
  
  static setColumnNameQuotingSymbol(columnNameQuotingSymbol) {
    SqlBuilderOptions.setColumnNameQuotingSymbol(columnNameQuotingSymbol);
  }
  
  static setDebug(debug) {
    SqlBuilder.__debug = debug;
  }
  
  static setFlavor(flavor) {
    if (SqlBuilder.__flavor) {
      SqlBuilder.__flavor.reset();
    }
    
    SqlBuilder.__flavor = flavor;
    
    flavor.extend();
  }
  
  static setFormatOnly(formatOnly) {
    SqlBuilder.__formatOnly = formatOnly;
  }
  
  static setQuotingSymbol(quotingSymbol) {
    SqlBuilderOptions.setQuotingSymbol(quotingSymbol);
  }
  
  static setSqlExecutor(sqlExecutor) {
    SqlBuilder.__sqlExecutor = sqlExecutor;
  }
  
  static startTransaction(debug = false) {
    return SqlBuilder.executeSql("START TRANSACTION", debug);
  }
  
  static update(table, callback, debug = false) {
    return executeSql(callback, new InsertUpdateBuilder(false, table), debug);
  }
}
