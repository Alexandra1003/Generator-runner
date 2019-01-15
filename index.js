function sum(a, b) {
    return a + b;
}
const prom = new Promise(res => {
    setTimeout(res, 5000, 10);
})
const val = 20;
const val2 = { name: 'ivan' };

function* gen() {
    const a = yield () => sum(1, 2);
    const b = yield prom;
    const c = yield val;
    const d = yield val2;
    console.log('console', a, b, c, d);
}

let iter = gen();

function executor(iterator) {
    let array = [];

    function runner(iterator, value) {
        let next = iterator.next(value);
    
        if (!next.done) {
            if (next.value instanceof Promise) {
                next.value.then(
                    data => {
                        array.push(data);
                        runner(iterator, data);
                    },
                    err => {
                        array.push(err);
                        runner(iterator, err);
                    }
                );
            } else if (typeof next.value === 'function') {
                array.push(next.value());
                runner(iterator, next.value());
            } else {
                array.push(next.value);
                runner(iterator, next.value);
            }
        } else {
            console.log('done:true!', array);
            return array;
            /* return Promise.resolve(array); */
        }
    }
    runner(iter);

    return Promise.resolve(array);
}

let result = executor(iter);
console.log('finall result', result);