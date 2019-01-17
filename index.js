function runner(iterator) {
    let array = [];

    return new Promise((resolve, reject) => {
        function executor(iterator, yieldValue) {
            const next = iterator.next(yieldValue);
            const { done, value } = next;
            if (done) {
                return resolve(array);
            }
            if (!done) {
                if (value instanceof Promise) {
                    value.then(
                        data => {
                            array.push(data);
                            executor(iterator, data);
                        },
                        err => {
                            array.push(err);
                            executor(iterator, err);
                        }
                    );
                } else if (typeof value === 'function') {
                    const resultValue = value();
                    array.push(resultValue);
                    executor(iterator, resultValue);
                } else {
                    array.push(value);
                    executor(iterator, value);
                }
            }
        }
        executor(iterator);
    })
}

//Example to check

function sum() {
    console.log(1);
    return [].reduce.call(arguments, (acc, el) => acc+=el);
  }
  
  const prom = x => new Promise(res => {
    console.log(2);
    setTimeout(res,2000,x);
  })
  
  function pow() {
    console.log(3);
    return [].reduce.call(arguments, (acc, el) => acc*=el);
  }
  
  const arr = [1,2,3,4]
  
  function *gen() {
    const a = yield sum.bind(null, ...arr);
    const b = yield prom(a);
    const c = yield pow.bind(null, ...arr);
    const d = yield arr;
    console.log(a + b + c + d)
    yield a + b + c + d;
  }
  
  runner(gen()).then(data => console.log(data.pop() === '441,2,3,4' ? "Good Job" : "You`ve failed this task"))