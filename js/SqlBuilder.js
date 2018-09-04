import TableBuilder from "./TableBuilder";
import InsertUpdateBuilder from "./InsertUpdateBuilder";
import SelectBuilder from "./SelectBuilder";
import WhereBuilder from "./WhereBuilder";

function executeSql(callback, obj) {
   callback(obj);
   
   return SqlBuilder.executeSql(obj.toString());
}

export default class SqlBuilder {
   static setDebug(debug) {
      SqlBuilder._debug = debug;
   }
   
   static getQuotingSymbol() {
      return SqlBuilder._quotingSymbol;
   }
   
   static setQuotingSymbol(quotingSymbol) {
      SqlBuilder._quotingSymbol = quotingSymbol;
   }
   
   static setFormatOnly(formatOnly) {
      SqlBuilder._formatOnly = formatOnly;
   }
   
   static setSqlExecutor(sqlExecutor) {
      SqlBuilder._sqlExecutor = sqlExecutor;
   }
   
   static executeSql(sql) {
      if (SqlBuilder._debug) {
         console.log(sql);
      }
      
      return SqlBuilder._sqlExecutor && !SqlBuilder._formatOnly ? SqlBuilder._sqlExecutor(sql) : sql;
   }
   
   static createTable(name, callback, ifNotExists = true) {
      return executeSql(callback, new TableBuilder(name, ifNotExists));
   }
   
   static insert(table, callback) {
      return executeSql(callback, new InsertUpdateBuilder(true, table));
   }
   
   static select(callback) {
      return executeSql(callback, new SelectBuilder());
   }
   
   static update(table, callback) {
      return executeSql(callback, new InsertUpdateBuilder(false, table));
   }
   
   static delete(table, callback) {
      const whereBuilder = new WhereBuilder();
      
      callback(whereBuilder);
      
      return SqlBuilder.executeSql(`DELETE FROM ${table}${whereBuilder};`);
   }
   
   static startTransaction() {
      return SqlBuilder.executeSql("START TRANSACTION;");
   }
   
   static commit() {
      return SqlBuilder.executeSql("COMMIT;");
   }
   
   static rollback() {
      return SqlBuilder.executeSql("ROLLBACK;");
   }
}
