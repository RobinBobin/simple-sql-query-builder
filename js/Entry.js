export default class Entry {
   constructor(name) {
      this.name = name;
      this.attrs = [];
   }
   
   attr(attr) {
      this.attrs.push(attr);
      
      return this;
   }
}
