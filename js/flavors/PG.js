import { ArrayStringifier } from "simple-common-utils";

import Flavor from "./Flavor";
import SqlBuilder from "../SqlBuilder";
import SelectBuilder from "../SelectBuilder";
import InsertUpdateBuilder from "../InsertUpdateBuilder";
import Condition from "../Condition";

const arrayStringifier = new ArrayStringifier()
   .setPrefix("ARRAY[")
   .setPostfix("]");

export default class PG extends Flavor {
   static extend() {
      SqlBuilder.setQuotingSymbol("'");
      
      // = SelectBuilder = //
      SelectBuilder.prototype.jsonField = function(column, field, alias) {
         return this.column(`${column}->>'${field}'`, alias);
      };
      
      // = InsertUpdateBuilder = //
      InsertUpdateBuilder.prototype.returning = function(field, add = true) {
         if (this.insert && add) {
            this._returning = field;
         }
         
         return this;
      };
      
      InsertUpdateBuilder.prototype.columnValueAppend = function(column, elements, add = true) {
         return this.columnValue(column, `${column} || ${PG.array(elements)}`, add, false);
      };
      
      InsertUpdateBuilder.prototype.columnValueRemove = function(column, element, add = true) {
         return this.columnValue(column, `array_remove(${column}, ${element})`,add, false);
      }
      
      InsertUpdateBuilder.prototype._finalizeToStringProcessing = function(str) {
         return this._returning ? `${str} RETURNING ${this._returning}` : str;
      };
      
      // = Condition = //
      Condition.prototype.contains = function(... elements) {
         return this.operator("@>", PG.array(elements), false);
      };
   }
   
   static reset() {
      SqlBuilder.setQuotingSymbol();
      
      // = SelectBuilder = //
      delete SelectBuilder.prototype.jsonField;
      
      // = InsertUpdateBuilder = //
      delete InsertUpdateBuilder.prototype.returning;
      delete InsertUpdateBuilder.prototype.columnValueAppend;
      delete InsertUpdateBuilder.prototype.columnValueRemove;
      delete InsertUpdateBuilder.prototype._finalizeToStringProcessing;
      
      // = Condition = //
      delete Condition.prototype.contains;
   }
   
   static array(... elements) {
      return arrayStringifier
         .setArray(elements)
         .process();
   }
   
   static toInteger(value, isArray) {
      return PG.toType(value, "integer", isArray);
   }
   
   static toType(value, type, isArray) {
      return `${value}::${type}${isArray ? "[]" : ""}`;
   }
}
