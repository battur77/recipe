const arr = [20, 30, 40];

let myfunc = (a) => {
  console.log(`too : ${a}`);
};

const arr2 = [...arr, 50, 60];

myfunc(arr2[1]);
