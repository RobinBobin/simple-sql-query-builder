export default class SqlBuilderOptions {
   static __columnNameQuotingSymbol = "";
   
   static getColumnNameQuotingSymbol() {
      return SqlBuilderOptions.__columnNameQuotingSymbol;
   }
   
   static getQuotingSymbol() {
      return SqlBuilderOptions.__quotingSymbol;
   }
   
   static setColumnNameQuotingSymbol(columnNameQuotingSymbol) {
      SqlBuilderOptions.__columnNameQuotingSymbol = columnNameQuotingSymbol || "";
   }
   
   static setQuotingSymbol(quotingSymbol) {
      SqlBuilderOptions.__quotingSymbol = quotingSymbol;
   }
};
