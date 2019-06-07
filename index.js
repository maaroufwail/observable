const { fromEvent, of, combineLatest } = rxjs;
const { map, tap, switchMap } = rxjs.operators;

const input = document.querySelector("input");
const select = document.querySelector("select");
const output = document.querySelector("output");

const rating$ = fromEvent(input, "input").pipe(map(e => e.target.value));
const type$ = fromEvent(select, "change").pipe(map(e => e.target.value));
combineLatest(rating$, type$).switchMap(getResources)
  .subscribe(render);

function getResources([id, resource]) {
  return Rx.Observable.ajax(
    `https://jsonplaceholder.typicode.com/${resource}?userId=${id}`
  );
}

function render(res) {
  output.innerHTML = "";
  const articles = document.createDocumentFragment();
  for (const post of res.response) {
    const article = document.createElement("article");
    const h1 = document.createElement("h1");
    const p = document.createElement("p");
    h1.textContent = post.title;
    article.appendChild(h1);
    p.textContent = post.body;
    article.appendChild(p);
    articles.appendChild(article);
  }
  output.appendChild(articles);
}

});
