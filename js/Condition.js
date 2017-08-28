import {
   StaticUtils,
   ArrayStringifier
} from "react-native-common-utils";

export default class Condition {
   constructor(column, whereBuilder) {
      this.column = column;
      this.whereBuilder = whereBuilder;
   }
   
   e(value, quoteIfString = true) {
      return this.operator("=", value, quoteIfString);
   }
   
   ne(value, quoteIfString = true) {
      return this.operator("!=", value, quoteIfString);
   }
   
   g(value, quoteIfString = true) {
      return this.operator(">", value, quoteIfString);
   }
   
   ge(value, quoteIfString = true) {
      return this.operator(">=", value, quoteIfString);
   }
   
   l(value, quoteIfString = true) {
      return this.operator("<", value, quoteIfString);
   }
   
   le(value, quoteIfString = true) {
      return this.operator("<=", value, quoteIfString);
   }
   
   in(array) {
      if (!this.inStringifier) {
         this.inStringifier = new ArrayStringifier()
            .setPrefix("(")
            .setPostfix(")");
      }
      
      return this.operator("in", this.inStringifier
         .setArray(array).process(), false);
   }
   
   operator(operator, value, quoteIfString = true) {
      this.operator = operator;
      this.value = quoteIfString ? StaticUtils.quoteIfString(value) : value;
      
      return this.whereBuilder;
   }
   
   toString() {
      return `${this.column} ${this.operator} ${this.value}`;
   }
}
