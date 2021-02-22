require("@babel/polyfill");
import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/Recipe";
import List from "./model/List";
import * as listview from "./view/listView";
import Like from "./model/Like";
import * as likesView from "./view/likesView";
import {
  renderRecipe,
  clearRecipe,
  highlightSelectedRecipe,
} from "./view/recipeView";

/*
web апп төлөв 
- хайлтын query, үр дүн
- тухайн үзүүлж байгаа жор
- лайкдсан жорууд
- захиалж байгаа жорын найрлагууд

*/

const state = {};

// hailtiin controller  = Model =>  Controller  <= View
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

// joriin controller

const controlRecipe = async () => {
  // URL- aas ID iig salgana
  const id = window.location.hash.replace("#", "");

  if (id) {
    // Joriin modeliig uusgene
    state.recipe = new Recipe(id);

    // UI delgetsiig beldene

    clearRecipe();
    renderLoader(elements.recipeDiv);
    highlightSelectedRecipe(id);

    // joroo tataj avch irne
    await state.recipe.getRecipe();

    // Joriin guitsetgeh hugatsaa bolon ortsiig tootsono
    clearLoader();
    state.recipe.calcTime();
    state.recipe.calcHuniiToo();

    // Joroo delgetsend haruulna

    renderRecipe(state.recipe, state.likes.isLiked(id));
  }
};

// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);
//deerh 2 code-iig daraah baidlaar bichij bolj bna
["hashchange", "load"].forEach((e) =>
  window.addEventListener(e, controlRecipe)
);

window.addEventListener("load", (e) => {
  // shine like modeliig app achaalagdah uyed uusgene
  if (!state.likes) state.likes = new Like();

  // like menu gargah esehiig shiideh
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());

  // like-uud baival tsesend nemj haruulna
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});

//nairlagiin controller heregtei

const controlList = () => {
  // Nairlagnii model uusgene
  state.list = new List();

  // umnu haragdaj bsan nairlaguudiig tseverlene
  listview.clearItems();

  // Ug model ruu odoo haragdaj baigaa jornii buh nairlagiig avch hiine

  state.recipe.ingredients.forEach((n) => {
    // tuhain nairlagiig model ruu hiine
    const item = state.list.addItem(n);

    // tuhain nairlagiig delgetsen gargana
    listview.renderItem(item);
  });
};

// like controller

const controlLike = () => {
  // like-iin modeliig uusgene
  if (!state.likes) state.likes = new Like();

  // odoo haragdaj baigaa joriin id-g olj avah
  const currentRecipeId = state.recipe.id;

  // ene joriig likelasan esehiig shalgah
  if (state.likes.isLiked(currentRecipeId)) {
    // likelsan bol like-iig ni boliulana
    state.likes.deleteLike(currentRecipeId);
    // like iin tsesnees ustgana
    likesView.deleteLike(currentRecipeId);
    // like tovchnii haragdah baidliig boliulah
    likesView.toggleLikeBtn(false);
  } else {
    // ugui bol likelana

    const newLike = state.likes.addLike(
      currentRecipeId,
      state.recipe.title,
      state.recipe.publisher,
      state.recipe.image_url
    );

    likesView.renderLike(newLike);
    likesView.toggleLikeBtn(true);
  }

  // daragdsan joriig avch model-ruu hine
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
};

elements.recipeDiv.addEventListener("click", (e) => {
  //tuhain class dotor baigaa alich div deer darsan ajillana
  if (e.target.matches(".recipe__btn, .recipe__btn *")) {
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    controlLike();
  }
});

elements.shoppingList.addEventListener("click", (e) => {
  // click hiisen li elementiin data-itemid attributiig shuuj gargaj avah
  const id = e.target.closest(".shopping__item").dataset.itemid;

  // oldson id-tai ortsiig modeloos ustgana

  state.list.deleteItem(id);

  // delgetsee ene id tai ortsiig mun olj ustgana
  listview.deleteItem(id);
});
