const { ajax } = rxjs.ajax;
const { of, fromEvent, combineLatest, throwError } = rxjs;
const { map, tap, switchMap, delay, catchError, startWith } = rxjs.operators;

const schoolMark = document.querySelector("input");
const markType = document.querySelector("select");
const output = document.querySelector("output");
const loader = document.querySelector(".loader");
const button = document.querySelector(".control");
const err = new Error("not found");

const retry$ = fromEvent(button, "click").pipe(startWith(undefined));
const rating$ = fromEvent(schoolMark, "input").pipe(map(e => e.target.value));
const type$ = fromEvent(markType, "change").pipe(map(e => e.target.value));

combineLatest([rating$, type$, retry$]) //prendo gli ultimi valori emessi dagli observable
  .pipe(
    switchMap(getResources),
    delay(1000) //simulare il caricamento dei dati
  )
  .subscribe(render);

function getResources([userId, resourcePath]) {
  let child = output.lastElementChild;
  while (child) {
    output.removeChild(child);
    child = output.lastElementChild;
  }
  loader.style.display = "block";
  return (Math.random() <= 0.2 //simulazione di un errore
    ? throwError(err)
    : ajax(
        `https://jsonplaceholder.typicode.com/${resourcePath}?userId=${userId}`
      )
  ).pipe(
    catchError(e => {
      //nel caso avvenga un errore restituisco un observable con valore "not found"
      return of(e);
    })
  );
}

function render(data) {
  loader.style.display = "none";
  output.innerHTML = "";
  const articles = document.createDocumentFragment();
  const article = document.createElement("article");
  if (data instanceof Error) {
    //controllo che i dati non siano un errore
    const h2 = document.createElement("h2");
    h2.textContent = "error please retry";
    article.appendChild(h2);
    button.disabled = false;
  } else {
    for (const post of data.response) {
      const h1 = document.createElement("h1");
      const p = document.createElement("p");
      h1.textContent = post.title;
      article.appendChild(h1);
      p.textContent = post.body;
      article.appendChild(p);
    }
  }
  articles.appendChild(article);
  output.appendChild(articles);
}
