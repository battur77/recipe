require("@babel/polyfill");
import Search from "./model/Search";

/*
web апп төлөв 
- хайлтын query, үр дүн
- тухайн үзүүлж байгаа жор
- лайкдсан жорууд
- захиалж байгаа жорын найрлагууд

*/

const state = {};

const controlSearch = async () => {
  // 1. webees hailtiin tulhuur ug gargaj avna
  const query = "pasta";

  if (query) {
    // 2. shineer hailtiin obectiig uusgej ugnu
    state.search = new Search(query);
    // 3. hailt hiihed zoriulj delgetsiin UI iin beldene
    // 4. hailtiig guitsetgene
    await state.search.doSearch();
    // 5. ur dung delgetsen uzuulne
    console.log(state.search.result);
  }
};

document.querySelector(".search").addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});
