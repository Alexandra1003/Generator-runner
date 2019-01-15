function runner(iterator) {
    let array = [];

    return new Promise((resolve, reject) => {
        function executor(iterator, value) {
            let next = iterator.next(value);

            if (!next.done) {
                if (next.value instanceof Promise) {
                    next.value.then(
                        data => {
                            array.push(data);
                            executor(iterator, data);
                        },
                        err => {
                            array.push(err);
                            executor(iterator, err);
                        }
                    );
                } else if (typeof next.value === 'function') {
                    array.push(next.value());
                    executor(iterator, next.value());
                } else {
                    array.push(next.value);
                    executor(iterator, next.value);
                }
            } else {
                resolve(array);
            }
        }
        executor(iter);
    })
}

function sum(a, b) {
    return a + b;
}
const prom = new Promise(res => {
    setTimeout(res, 1000, 10);
})
const val = 20;
const val2 = { name: 'ivan' };

function* gen() {
    const a = yield () => sum(1, 2);
    const b = yield prom;
    const c = yield val;
    const d = yield val2;
}

let iter = gen();

let result = runner(iter);