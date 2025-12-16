const startbutton = document.querySelector("button");
let counter = 0;
showcounter();

startbutton.addEventListener("click", e => {
    counter++;
    localStorage.setItem("firstapp.counter", counter.toString());
    showcounter();
});

// Show counter
function showcounter(){
    const value = localStorage.getItem("firstapp.counter");
    if(value) counter = Number(value);
    document.querySelector("#counter").textContent = counter;
}