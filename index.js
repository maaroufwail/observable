const { Observable } = rxjs.Observable;
const { ajax } = rxjs.ajax;
const { Rx, fromEvent, combineLatest } = rxjs;
const { map, tap, switchMap, catchError } = rxjs.operators;

const input = document.querySelector("input");
const select = document.querySelector("select");
const output = document.querySelector("output");

const rating$ = fromEvent(input, "input").pipe(map(e => e.target.value));

const type$ = fromEvent(select, "change").pipe(map(e => e.target.value));

var control = combineLatest(rating$, type$)
  .pipe(switchMap(getResources))
  .subscribe(render);

function getResources([rating, resource]) {
  console.log("sono entarto nella funzione 1");
  return ajax(
    `https://jsonplaceholder.typicode.com/${resource}?userId=${rating}`
  );
}

function render(data) {
  output.innerHTML = "";
  console.log(data.response);
  const articles = document.createDocumentFragment();
  for (const post of data.response) {
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
