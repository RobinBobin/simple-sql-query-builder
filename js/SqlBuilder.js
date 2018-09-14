import TableBuilder from "./TableBuilder";
import InsertUpdateBuilder from "./InsertUpdateBuilder";
import SelectBuilder from "./SelectBuilder";
import WhereBuilder from "./WhereBuilder";
import PG from "./flavors/PG";

function executeSql(callback, obj) {
   callback(obj);
   
   return SqlBuilder.executeSql(obj.toString());
}

export default class SqlBuilder {
   static PG = PG;
   
   static _columnNameQuotingSymbol = "";
   
   static setDebug(debug) {
      SqlBuilder._debug = debug;
   }
   
   static setFlavor(flavor) {
      if (SqlBuilder._flavor) {
         SqlBuilder._flavor.reset();
      }
      
      SqlBuilder._flavor = flavor;
      
      flavor.extend();
   }
   
   static getQuotingSymbol() {
      return SqlBuilder._quotingSymbol;
   }
   
   static setQuotingSymbol(quotingSymbol) {
      SqlBuilder._quotingSymbol = quotingSymbol;
   }
   
   static getColumnNameQuotingSymbol() {
      return SqlBuilder._columnNameQuotingSymbol;
   }
   
   static setColumnNameQuotingSymbol(columnNameQuotingSymbol) {
      SqlBuilder._columnNameQuotingSymbol = columnNameQuotingSymbol || "";
   }
   
   static setFormatOnly(formatOnly) {
      SqlBuilder._formatOnly = formatOnly;
   }
   
   static setSqlExecutor(sqlExecutor) {
      SqlBuilder._sqlExecutor = sqlExecutor;
   }
   
   static executeSql(sql) {
      const s = `${sql};`;
      
      if (SqlBuilder._debug) {
         console.log(s);
      }
      
      return SqlBuilder._sqlExecutor && !SqlBuilder._formatOnly ? SqlBuilder._sqlExecutor(s) : s;
   }
   
   static createTable(name, callback, ifNotExists = true) {
      return executeSql(callback, new TableBuilder(name, ifNotExists));
   }
   
   static insert(table, callback) {
      return executeSql(callback, new InsertUpdateBuilder(true, table));
   }
   
   static select(callback, asSubquery) {
      const sb = new SelectBuilder();
      
      let result;
      
      if (!asSubquery) {
         result = executeSql(callback, sb);
      } else {
         callback(sb);
         
         result = `(${sb})`;
      }
      
      return result;
   }
   
   static update(table, callback) {
      return executeSql(callback, new InsertUpdateBuilder(false, table));
   }
   
   static delete(table, callbackOrWhere) {
      let where;
      
      if (callbackOrWhere.constructor != Function) {
         where = callbackOrWhere;
      } else {
         where = new WhereBuilder();
         
         callbackOrWhere(where);
      }
      
      return SqlBuilder.executeSql(`DELETE FROM ${table}${where}`);
   }
   
   static startTransaction() {
      return SqlBuilder.executeSql("START TRANSACTION");
   }
   
   static commit() {
      return SqlBuilder.executeSql("COMMIT");
   }
   
   static rollback() {
      return SqlBuilder.executeSql("ROLLBACK");
   }
}
