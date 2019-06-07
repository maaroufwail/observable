const { fromEvent, of, interval } = rxjs;
const { map, tap, switchAll } = rxjs.operators;

const input = document.querySelector("input");
const select = document.querySelector("select");
const output = document.querySelector("output");

const id$ = fromEvent(input, "input").map(e => e.target.value);

const resource$ = fromEvent(select, "change").map(e => e.target.value);
combineLatest(id$, resource$);
