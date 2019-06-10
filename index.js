const { ajax } = rxjs.ajax;
const { from, fromEvent, combineLatest, throwError } = rxjs;
const {
  map,
  tap,
  switchMap,
  delay,
  catchError,
  retryWhen,
  repeatWhen,
  startWith
} = rxjs.operators;

const schoolMark = document.querySelector("input");
const markType = document.querySelector("select");
const output = document.querySelector("output");
const loader = document.querySelector(".loader");
const button = document.querySelector(".control");

const retry$ = fromEvent(button, "click").pipe(startWith());
const rating$ = fromEvent(schoolMark, "input").pipe(map(e => e.target.value));
const type$ = fromEvent(markType, "change").pipe(map(e => e.target.value));

combineLatest([rating$, type$, retry$])
  .pipe(switchMap(getResources))
  .subscribe(render);

combineLatest([rating$, type$])
  .pipe(
    switchMap(getResources),
    retryWhen()
  )
  .subscribe(render);

function getResources([userId, resourcePath]) {
  let child = output.lastElementChild;

  while (child) {
    output.removeChild(child);
    child = output.lastElementChild;
  }
  loader.style.display = "block";
  if (Math.random() <= 0.6) {
    return throwError(new Error("Not found"));
  } else {
    return ajax(
      `https://jsonplaceholder.typicode.com/${resourcePath}?userId=${userId}`
    ).pipe(delay(3000));
  }
}

function render(data) {
  loader.style.display = "none";
  output.innerHTML = "";
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
