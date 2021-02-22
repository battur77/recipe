import uniqid from "uniqid";

export default class List {
  constructor() {
    this.items = [];
  }

  deleteItem(id) {
    // id gedeg id tai ortsiin indexiig massivaas haij olno
    const index = this.items.findIndex((el) => el.id === id);
    // ug index deerh elementiig massivaas ustgana
    this.items.splice(index, 1);
  }

  addItem(item) {
    let newItem = {
      id: uniqid(),
      item,
    };
    this.items.push(newItem);
    return newItem;
  }
}
