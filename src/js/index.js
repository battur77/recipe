require("@babel/polyfill");
import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/Recipe";

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

  const query = searchView.getInput();

  if (query) {
    // 2. shineer hailtiin obectiig uusgej ugnu
    state.search = new Search(query);
    // 3. hailt hiihed zoriulj delgetsiin UI iin beldene
    searchView.clearSearchQuery();
    searchView.clearSearchResult();
    renderLoader(elements.searchResultDiv);
    // 4. hailtiig guitsetgene
    await state.search.doSearch();
    // 5. ur dung delgetsen uzuulne
    clearLoader();
    if (state.search.result === undefined) {
      alert("Хайлт илэрцгүй ...");
    } else searchView.renderRecipes(state.search.result);
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

elements.pageButtons.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");

  if (btn) {
    const gotoPageNumber = parseInt(btn.dataset.goto, 10);
    searchView.clearSearchResult();
    searchView.renderRecipes(state.search.result, gotoPageNumber);
  }
});

const r = new Recipe(47746);

r.getRecipe();
