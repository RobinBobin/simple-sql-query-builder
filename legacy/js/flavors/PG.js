import { ArrayStringifier } from "simple-common-utils";

import Flavor from "./Flavor";
import InsertUpdateBuilder from "../InsertUpdateBuilder";
import Condition from "../Condition";

const arrayStringifier = new ArrayStringifier()
   .setPrefix("ARRAY[")
   .setPostfix("]");

function stringifyArray(array, stringifier) {
   return stringifier
      .setArray(array)
      .process();
}

export default class PG extends Flavor {
   static extend() {
      // = InsertUpdateBuilder = //
      InsertUpdateBuilder.prototype.returning = function(field, add = true) {
         if (this.insert && add) {
            this._returning = field;
         }
         
         return this;
      };
      
      InsertUpdateBuilder.prototype.columnValueAppend = function(column, elements, add = true) {
         return this.columnValue(column, `${column} || ${PG.array(...elements)}`, add, false);
      };
      
      InsertUpdateBuilder.prototype.columnValueRemove = function(column, element, add = true) {
         return this.columnValue(column, `array_remove(${column}, ${element})`,add, false);
      }
      
      InsertUpdateBuilder.prototype._finalizeToStringProcessing = function(str) {
         return this._returning ? `${str} RETURNING ${this._returning}` : str;
      };
      
      // = Condition = //
      Condition.prototype.contains = function(... elements) {
         return this.operator("@>", PG.array(...elements), false);
      };
   }
   
   static array(... elements) {
      return stringifyArray(elements, arrayStringifier);
   }
   
   static arrayLength(array, dimension) {
      return `array_length(${array}, ${dimension})`;
   }
   
   static toInteger(value, isArray, addParentheses) {
      return PG.toType(value, "integer", isArray, addParentheses);
   }
   
   static toType(value, type, isArray, addParentheses) {
      const parts = [
         addParentheses ? "(" : "",
         addParentheses ? ")" : "",
         isArray ? "[]" : ""
      ];
      
      return `${parts[0]}${value}${parts[1]}::${type}${parts[2]}`;
   }
}
