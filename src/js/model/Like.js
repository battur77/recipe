export default class Likes {
  constructor() {
    this.readDataFromLocalStorage();
    if (!this.likes) this.likes = [];
  }

  addLike(id, title, publisher, img) {
    const like = { id, title, publisher, img };
    this.likes.push(like);

    //storage-ruu hadgalan

    this.saveDataToLocalStorage();
    return like;
  }

  deleteLike(id) {
    // id gedeg id tai like-iin indexiig massivaas haij olno
    const index = this.likes.findIndex((el) => el.id === id);
    // ug index deerh elementiig ustgana
    this.likes.splice(index, 1);
    this.saveDataToLocalStorage();
  }

  isLiked(id) {
    //     if ((this.likes.findIndex((el) => el.id === id) = -1)) return false;
    //     else return true;
    // ene 2 bichiglel adilhan
    return this.likes.findIndex((el) => el.id === id) !== -1;
  }

  getNumberOfLikes() {
    return this.likes.length;
  }

  saveDataToLocalStorage() {
    localStorage.setItem("likes", JSON.stringify(this.likes));
  }

  readDataFromLocalStorage() {
    this.likes = JSON.parse(localStorage.getItem("likes"));
  }
}
