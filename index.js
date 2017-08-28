import SqlBldr from "./js/SqlBuilder";
import SelectBuilder from "./js/SelectBuilder";
import WhereBuilder from "./js/WhereBuilder";
import Condition from "./js/Condition";

export default class SqlBuilder extends SqlBldr {
   static SelectBuilder = SelectBuilder;
   static WhereBuilder = WhereBuilder;
   static Condition = Condition;
};
