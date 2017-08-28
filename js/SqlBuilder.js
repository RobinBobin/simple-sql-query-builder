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
      SqlBuilder.debug = debug;
   }
   
   static setSqlExecutor(sqlExecutor) {
      SqlBuilder.sqlExecutor = sqlExecutor;
   }
   
   static executeSql(sql) {
      if (SqlBuilder.debug) {
         console.log(sql);
      }
      
      return SqlBuilder.sqlExecutor ? SqlBuilder.sqlExecutor(sql) : sql;
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
      
      return SqlBuilder.executeSql(`DELETE FROM ${table}${whereBuilder}`);
   }
}
