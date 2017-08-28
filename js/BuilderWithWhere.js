import WhereBuilder from "./WhereBuilder";
import Condition from "./Condition";

export default class BuilderWithWhere {
   constructor() {
      this.whereBuilder = new WhereBuilder();
   }
   
   where(callbackOrConditionString, add = true) {
      if (add) {
         switch (callbackOrConditionString.constructor) {
            case String:
            case Condition:
               this.whereBuilder.condition(callbackOrConditionString);
               break;
            
            default:
               callbackOrConditionString(this.whereBuilder);
               break;
         }
      }
      
      return this;
   }
}
