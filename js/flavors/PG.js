import { ArrayStringifier } from "simple-common-utils";

import Flavor from "./Flavor";
import SqlBuilder from "../SqlBuilder";
import SelectBuilder from "../SelectBuilder";
import InsertUpdateBuilder from "../InsertUpdateBuilder";
import Condition from "../Condition";

const arrayStringifier = new ArrayStringifier()
   .setPrefix("ARRAY[")
   .setPostfix("]");

const coalesceStringifier = new ArrayStringifier()
   .setPrefix("COALESCE(")
   .setPostfix(")");

function stringifyArray(array, stringifier) {
   return stringifier
      .setArray(array)
      .process();
}

export default class PG extends Flavor {
   static extend() {
      SqlBuilder.setQuotingSymbol("'");
      SqlBuilder.setColumnNameQuotingSymbol("\"");
      
      // = SelectBuilder = //
      SelectBuilder.prototype.jsonField = function(column, field, alias) {
         return this.column(PG.jsonField(column, field), alias);
      };
      
      SelectBuilder.prototype.arrayLength = function(column, dimension, alias) {
         return this.column(PG.arrayLength(column, dimension), alias);
      };
      
      SelectBuilder.prototype.coalesce = function(elements, alias) {
         return this.column(PG.coalesce(...elements), alias);
      };
      
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
   
   static reset() {
      SqlBuilder.setQuotingSymbol();
      SqlBuilder.setColumnNameQuotingSymbol();
      
      // = SelectBuilder = //
      delete SelectBuilder.prototype.jsonField;
      delete SelectBuilder.prototype.arrayLength;
      delete SelectBuilder.prototype.coalesce;
      
      // = InsertUpdateBuilder = //
      delete InsertUpdateBuilder.prototype.returning;
      delete InsertUpdateBuilder.prototype.columnValueAppend;
      delete InsertUpdateBuilder.prototype.columnValueRemove;
      delete InsertUpdateBuilder.prototype._finalizeToStringProcessing;
      
      // = Condition = //
      delete Condition.prototype.contains;
   }
   
   static array(... elements) {
      return stringifyArray(elements, arrayStringifier);
   }
   
   static arrayLength(array, dimension) {
      return `array_length(${array}, ${dimension})`;
   }
   
   static jsonField(column, field) {
      return `${column}->>'${field}'`;
   }
   
   static coalesce(... elements) {
      return stringifyArray(elements, coalesceStringifier);
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
