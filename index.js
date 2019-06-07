const { fromEvent, of, combineLatest } = rxjs;
const { map, tap, switchAll } = rxjs.operators;

const input = document.querySelector("input");
const select = document.querySelector("select");
const output = document.querySelector("output");

/*const control = fromEvent(document, "click").subscribe(e =>
  console.log("clicked")
);*/
const rating$ = fromEvent(input, "input").pipe(map(e => e.target.value));
const type$ = fromEvent(select, "change").pipe(map(e => e.target.value));
combineLatest(rating$, type$).subscribe(e =>
  console.log(rating$ + "   " + id$)
);
