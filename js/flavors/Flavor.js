export default class SqlFlavor {
  static extend() {
    throw new Error("SqlFlavor.extend() must be overriden");
  }
  
  static reset() {
    throw new Error("SqlFlavor.reset() must be overriden");
  }
};
