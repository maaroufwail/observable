const { ajax } = rxjs.ajax;
const { Rx, fromEvent, combineLatest } = rxjs;
const { map, tap, switchMap, catchError } = rxjs.operators;

const schoolMark = document.querySelector("input");
const markType = document.querySelector("select");
const output = document.querySelector("output");

const rating$ = fromEvent(schoolMark, "input").pipe(map(e => e.target.value));

const type$ = fromEvent(markType, "change").pipe(map(e => e.target.value));

var control = combineLatest(rating$, type$)
  .pipe(switchMap(getResources))
  .subscribe(render);

function getResources([userId, resourcePath]) {
  return ajax(
    `https://jsonplaceholder.typicode.com/${resourcePath}?userId=${userId}`
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
