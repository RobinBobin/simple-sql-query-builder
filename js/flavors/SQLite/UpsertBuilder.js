import { ArrayStringifier } from "simple-common-utils";
import BuilderWithWhere from "../../BuilderWithWhere";
import InsertUpdateBuilder from "../../InsertUpdateBuilder";

export default class UpsertBuilder extends InsertUpdateBuilder {
  constructor(table) {
    super(true, table);
  }
  
  doNothing() {
    this.__doUpdate = null;
  }
  
  doUpdate() {
    this.__doUpdate = new InsertUpdateBuilder(false, "");
    
    return this.__doUpdate;
  }
  
  onConflict(...indexedColumns) {
    this.__indexedColumns = indexedColumns.length ? indexedColumns : null;
    
    return this;
  }
  
  toString() {
    let str = super.toString();
    
    str += " ON CONFLICT";
    
    if (this.__indexedColumns) {
      str += new ArrayStringifier(this.__indexedColumns)
        .setPrefix(" (")
        .setPostfix(")")
        .process();
      
      if (this.__onConflictWhere) {
        str += this.__onConflictWhere.whereBuilder.toString();
      }
    }
    
    str += " DO ";
    
    if (!this.__doUpdate) {
      str += "NOTHING";
    } else {
      str += this.__doUpdate.toString();
    }
    
    return str;
  }
  
  where(callbackOrConditionString, add = true) {
    this.__onConflictWhere = new BuilderWithWhere();
    
    this.__onConflictWhere.where(callbackOrConditionString, add);
    
    return this;
  }
};
