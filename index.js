import Condition from "./js/Condition";
import SelectBuilder from "./js/SelectBuilder";
import SqlBldr from "./js/SqlBuilder";
import WhereBuilder from "./js/WhereBuilder";
import PG from "./js/flavors/PG";
import SQLite from "./js/flavors/SQLite/SQLite";

export default class SqlBuilder extends SqlBldr {
  static Condition = Condition;
  static PG = PG;
  static SelectBuilder = SelectBuilder;
  static SQLite = SQLite;
  static WhereBuilder = WhereBuilder;
};
