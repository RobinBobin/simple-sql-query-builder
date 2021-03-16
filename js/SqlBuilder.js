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
   
   static setDebug(debug) {
      SqlBuilder.__debug = debug;
   }
   
   static setFlavor(flavor) {
      if (SqlBuilder._flavor) {
         SqlBuilder._flavor.reset();
      }
      
      SqlBuilder._flavor = flavor;
      
      flavor.extend();
   }
   
   static getQuotingSymbol() {
      return SqlBuilderOptions.getQuotingSymbol();
   }
   
   static setQuotingSymbol(quotingSymbol) {
      SqlBuilderOptions.setQuotingSymbol(quotingSymbol);
   }
   
   static getColumnNameQuotingSymbol() {
      return SqlBuilderOptions.getColumnNameQuotingSymbol();
   }
   
   static setColumnNameQuotingSymbol(columnNameQuotingSymbol) {
      SqlBuilderOptions.setColumnNameQuotingSymbol(columnNameQuotingSymbol);
   }
   
   static setFormatOnly(formatOnly) {
      SqlBuilder._formatOnly = formatOnly;
   }
   
   static setSqlExecutor(sqlExecutor) {
      SqlBuilder._sqlExecutor = sqlExecutor;
   }
   
   static executeSql(sql, debug = false) {
      const s = `${sql};`;
      
      if (SqlBuilder.__debug || debug) {
         console.log(s);
      }
      
      return SqlBuilder._sqlExecutor && !SqlBuilder._formatOnly ? SqlBuilder._sqlExecutor(s) : s;
   }
   
   static createTable(name, callback, ifNotExists = true, debug = false) {
      return executeSql(callback, new TableBuilder(name, ifNotExists), debug);
   }
   
   static insert(table, callback, debug = false) {
      return executeSql(callback, new InsertUpdateBuilder(true, table), debug);
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
   
   static update(table, callback, debug = false) {
      return executeSql(callback, new InsertUpdateBuilder(false, table), debug);
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
   
   static startTransaction(debug = false) {
      return SqlBuilder.executeSql("START TRANSACTION", debug);
   }
   
   static commit(debug = false) {
      return SqlBuilder.executeSql("COMMIT", debug);
   }
   
   static rollback(debug = false) {
      return SqlBuilder.executeSql("ROLLBACK", debug);
   }
}
