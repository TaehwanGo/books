# 13. 함수형 도구 체이닝

- 이 장에서는 `여러 단계를 하나로 엮은 체인`으로 `복합적인 계산을 표현`하는 방법을 살펴보겠습니다
- 이 장을 통해 함수형 도구가 얼마나 강력한지 알 수 있을 것입니다

#### 학습 목표

- 복합적인 쿼리로 데이터를 조회하기 위해 함수형 도구를 조합하는 방법을 배웁니다
- 복잡한 반복문을 함수형 도구 체인으로 바꾸는 방법을 이해합니다
- 데이터 변환 파이프라인을 만들어 작업을 수행하는 방법을 배웁니다

## 고객 커뮤니케이션팀은 계속 일하고 있습니다

- 이슈
  - 우수 고객 중 가장 비싼 구매를 구하기
    - 우수 고객 : 3개 이상 구매한 고객
- 제안
  - 단계를 조합해 하나의 쿼리로 만들어보자 - 체이닝
- 체이닝의 각 단계
  - 우수 고객을 뽑는다(filter)
  - 우수 고객의 가장 비싼 구매를 가져온다(map)

```js
function biggestPurchasesBestCustomers(customers) {
  const bestCustomers = filter(customers, (c) => c.purchases.length >= 3);
  const biggestPurchases = map(bestCustomers, (c) => {
    // 무엇을 리턴해야 할까요?
  });
}
```

- reduce를 사용해 가장 비싼 구매를 찾을 수 있습니다

```js
function biggestPurchasesBestCustomers(customers) {
  const bestCustomers = filter(customers, (c) => c.purchases.length >= 3);
  const biggestPurchases = map(bestCustomers, (c) => {
    return reduce(c.purchases, { total: 0 }, (biggestSofar, purchase) => {
      if (biggestSofar.total > purchase.total) {
        return biggestSofar;
      } else {
        return purchase;
      }
    });
  });

  return biggestPurchases;
}
```

- 잘 동작하지만 콜백이 여러개 중첩되어 함수가 너무 커졌습니다
- 잘 동작하지만 이해하기 어렵습니다

> total값을 가져오는 부분을 콜백으로 분리해 봅시다

```js
// reduce()를 maxKey()로 빼냅니다
function maxKey(array, init, f) {
  return reduce(array, init, (biggestSofar, element) => {
    if (f(biggestSofar) > f(element)) {
      return biggestSofar;
    } else {
      return element;
    }
  });
}

function biggestPurchasesBestCustomers(customers) {
  const bestCustomers = filter(customers, (c) => c.purchases.length >= 3);
  const biggestPurchases = map(bestCustomers, (c) => {
    return maxKey(c.purchases, { total: 0 }, (p) => p.total);
  });

  return biggestPurchases;
}
```

## 연습문제

- max()와 maxKey()는 비슷한 함수입니다
- 따라서 코드도 비슷할 것입니다
- 만약 둘 중 하나로 나머지 하나를 만들 수 있다고 가정하고 다음 질문에 답해보세요

1. 어떤 것으로 다른 하나를 만들 수 있을까요?
2. 코드로 만들어 보세요
3. 두 함수를 호출 그래프로 표현해 보세요
4. 어떤 함수가 더 일반적인 함수라고 할 수 있나요?

## 정답

### 1. 어떤 것으로 다른 하나를 만들 수 있을까요?

- maxKey()가 더 일반적이므로 maxKey()로 max()를 만들 수 있습니다
- maxKey()는 비교하는 값을 자유롭게 선택해서 최대값을 구할 수 있지만,
- max()는 값을 직접 비교해야 합니다

### 2. 코드로 만들어 보세요

- 인자로 받은 값을 그래도 리턴하는 항등 함수(identity function)와 maxKey()를 사용해 max()를 만들 수 있습니다

```js
function max(array) {
  return maxKey(array, (x) => x); // 항등 함수 : x => x
}
```

### 3. 두 함수를 호출 그래프로 표현해 보세요

- max() -> maxKey() -> reduce()

### 4. 어떤 함수가 더 일반적인 함수라고 할 수 있나요?

- maxKey()가 max() 보다 아래 위치합니다.
- maxKey()는 max() 보다 더 일반적인 함수입니다

## 체인을 명확하게 만들기 1 - 단계에 이름 붙이기

- 체인을 명확하게 만드는 첫 번째 방법은 각 단계에 이름을 붙이는 것입니다

```js
function biggestPurchasesBestCustomers(customers) {
  // 1단계 : selectBestCustomers
  const bestCustomers = selectBestCustomers(customers);

  // 2단계 : getBiggestPurchases
  const biggestPurchases = getBiggestPurchases(bestCustomers);

  return biggestPurchases;
}

function selectBestCustomers(customers) {
  return filter(customers, (c) => c.purchases.length >= 3);
}

function getBiggestPurchases(customers) {
  return map(customers, (c) => {
    return maxKey(c.purchases, { total: 0 }, (p) => p.total);
  });
}
```

- 각 단계에 이름을 붙이면 훨씬 명확해집니다
  - 그리고 각 단계에 숨어있던 두 함수의 구현도 알아보기 쉽습니다
- 하지만 아직 분명하지 않은 부분이 더 있습니다
  - 콜백함수는 여전히 인라인으로 사용하고 있습니다
  - 인라인으로 정의된 콜백함수는 재사용할 수 없습니다
  - 콜백을 재사용할 수 있을까요?
  - 이 함수를 더 작은 함수로 쪼갤 수 있을까요?

## 체인을 명확하게 만들기 2 - 콜백에 이름 붙이기

```js
function biggestPurchasesBestCustomers(customers) {
  const bestCustomers = filter(customers, isGoodCustomer);

  const biggestPurchases = map(bestCustomers, getBiggestPurchase);

  return biggestPurchases;
}

// 콜백에 이름을 붙입니다
function isGoodCustomer(c) {
  return c.purchases.length >= 3;
}

function getBiggestPurchase(c) {
  return maxKey(c.purchases, { total: 0 }, (p) => p.total);
}
```

## 체인을 명확하게 만들기 3 - 두 방법을 비교

- 일반적으로 두 번째 방법이 더 명확합니다
- 그리고 고차 함수를 그대로 쓰는 첫 번째 방법보다 이름을 붙인 두 번째 방법이 재사용하기도 더 좋습니다
- 인라인 대신 이름을 붙여 콜백을 사용하면 단계가 중첩되는 것도 막을 수 있습니다
- 물론 문맥에 따라 달라질 수 있습니다
- 함수형 프로그래머라면 두 가지 방법을 모두 시도해서 어떤 방법이 더 좋은지 비교해 결정할 것입니다

## 예제: 한 번만 구매한 고객의 이메일 목록

- 가진 것: 전체 고객 배열
- 필요한 것: 한 번만 구매한 고객들의 이메일 목록
- 계획
  - 1. 한 번만 구매한 고객들을 찾습니다(filter)
  - 2. 고객 목록을 이메일 목록으로 바꿉니다(map)

```js
const firstTimers = filter(customers, (c) => c.purchases.length === 1);

const firstTimerEmails = map(firstTimers, (c) => c.email);
```

```js
const firstTimers = filter(customers, isFirstTimer);

const firstTimerEmails = map(firstTimers, getCustomerEmail);

function isFirstTimer(c) {
  return c.purchases.length === 1;
}

function getCustomerEmail(c) {
  return c.email;
}
```

## filter와 map

- filter와 map은 모두 새로운 배열을 만듭니다
- 함수를 호출할 때마다 새로운 배열이 생기지만 가비지 컬렉터가 빠르게 처리하기 때문에 문제가 되지 않습니다
- 현대 가비지 컬렉터는 매우 빠릅니다

## 반복문을 함수형 도구로 리팩터링하기

- 기존에 있던 반복문을 함수형 도구로 리팩터링해 보겠습니다

### 전략 1 - 이해하고 다시 만들기

- 어떤 일을 하는지 파악한 다음, 기존 구현은 잊어버리고 이 장에 나온 예제를 떠올리면서 다시 만드는 것

### 전략 2 - 단서를 찾아 리팩터링

- 기존에 있던 코드를 잘 이해하지 못하더라도 단서를 찾아 리팩터링할 수 있습니다
- 반복문을 하나씩 선택한 다음 함수형 도구 체인으로 바꾸면 됩니다

### 리팩토링할 예제 코드

- 중첩 반복문이 있는 코드

```js
const answer = [];
const window = 5;

for (let i = 0; i < array.length; i++) {
  let sum = 0;
  let count = 0;

  for (let w = 0; w < window; w++) {
    let idx = i + w;
    if (idx < array.length) {
      sum += array[idx];
      count++;
    }
  }

  answer.push(sum / count);
}
```

### 팁 1 - 데이터 만들기

- 어떤 값에 map()과 filter()를 단계적으로 사용하면 중간에 배열이 생기고 없어집니다
  - for 반복문을 사용할 때는 처리할 모든 값이 배열에 들어있지 않아도 됩니다
- 첫 번째 팁은 데이터를 배열에 넣으면 함수형 도구를 쓸 수 있다는 것입니다

```js
const answer = [];
const window = 5;

for (let i = 0; i < array.length; i++) {
  let sum = 0;
  let count = 0;

  // 하위 배열로 만듭니다
  const subArray = array.slice(i, i + window); // slice() : 배열의 일부를 복사해서 새로운 배열을 만듭니다
  // 그리고 반복문으로 배열을 반복합니다
  for (let w = 0; w < subArray.length; w++) {
    sum += subArray[w];
    count++;
  }

  answer.push(sum / count);
}
```

### 팁 2 - 한 번에 전체 배열을 조작하기

- 팁1에서 하위 배열을 만들었기 때문에 일부 배열이 아닌 배열 전체를 반복할 수 있습니다
- map()이나 filter(), reduce()은 배열 전체에 동작하기 때문에 이제 이런 함수형 도구를 쓸 수 있습니다

```js
const answer = [];

const window = 5;

for (let i = 0; i < array.length; i++) {
  let sum = 0;
  let count = 0;

  const subArray = array.slice(i, i + window);

  // 안쪽 반복문 전체를 .slice()와 average()를 호출하는 코드로 바꿨습니다
  answer.push(average(subArray));
}

function average(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum / array.length;
}
```

### 팁 3 - 작은 단계로 나누기

- index를 가지고 원래 배열의 하위 배열 또는 windows라는 배열을 만듭니다

#### 3-1. indices를 생성하는 작은 단계를 만듭니다

```js
const indices = [];

for (let i = 0; i < array.length; i++) {
  indices.push(i);
}

const window = 5;

const answer = map(indices, (i) => {
  const subArray = array.slice(i, i + window);
  return average(subArray);
});
```

#### 3-2. map()에 넘기는 콜백은 두 가지을을 하므로 작은 단계로 나눠 봅시다

```js
const indices = [];

for (let i = 0; i < array.length; i++) {
  indices.push(i);
}

const window = 5;

const windows = map(indices, (i) => array.slice(i, i + window));

const answer = map(windows, average);
```

#### 3-3. 인덱스 배열을 만드는 함수를 빼내 유용한 함수로 정의

```js
function range(start, end) {
  const ret = [];
  for (let i = start; i < end; i++) {
    ret.push(i);
  }
  return ret;
}

const window = 5;

const indices = range(0, array.length);

const windows = map(indices, (i) => array.slice(i, i + window));

const answer = map(windows, average);
```

## 절차적 코드와 함수형 코드 비교

```js
// 절차적 코드
const answer = [];
const window = 5;

for (let i = 0; i < array.length; i++) {
  let sum = 0;
  let count = 0;

  const subArray = array.slice(i, i + window);

  for (let w = 0; w < subArray.length; w++) {
    sum += subArray[w];
    count++;
  }

  answer.push(sum / count);
}
```

```js
// 함수형 코드
const window = 5;

const indices = range(0, array.length);
const windows = map(indices, (i) => array.slice(i, i + window));
const answer = map(windows, average);

// 재사용 가능한 추가 도구
function range(start, end) {
  const ret = [];
  for (let i = start; i < end; i++) {
    ret.push(i);
  }
  return ret;
}
```

- 처음에는 반복문이 중첩되고 인덱스를 계산하며 지역변수를 바꾸는 코드였습니다
- 이 과정을 `각 단계로 나눠` 명확하게 만들었습니다
- 완성된 코드는 글로도 그대로 바꿔 쓸 수 있습니다

  - 1. 숫자 리스트가 있을 때 각 숫자에 대한 window를 만듭니다
  - 2. 각 window에 대해 평균을 구합니다

- 코드에 있는 각 단계는 알고리즘을 설명하는 것과 비슷합니다
- 추가로 range()라는 함수형 도구도 생겼습니다

## 체이닝 팁 요약

- 반복문을 함수형 도구 체인으로 리팩터링하기 위한 팁을 알아봤습니다
- 다음은 세 가지 팁과 유용한 보너스 팁입니다

### 1. 데이터 만들기

- 함수형 도구는 배열 전체를 다룰 때 잘 동작합니다
- 배열 일부에 대해 동작하는 반복문이 있다면 `배열 일부`를 `새로운 배열`로 나눌 수 있습니다
- 그리고 map(), filter(), reduce() 같은 함수형 도구를 사용하면 작업을 줄일 수 있습니다

### 2. 배열 전체를 다루기

- 어떻게 하면 반복문을 대신해 `전체 배열을 한 번에 처리할 수 있을지` 생각해 보세요
- map()은 모든 항목을 변환하고 filter()는 항목을 없애거나 유지합니다
- reduce()는 항목을 하나로 합칩니다
- 과감하게 배열 전체를 처리해보세요

### 3. 작은 단계로 나누기

- 알고리즘이 한 번에 너무 많은 일을 한다고 생각된다면 직관에 반하지만 두 개 이상의 단계로 나눠보세요

### 보너스 팁1. 조건문을 filter()로 바꾸기

### 보너스 팁2. 유용한 함수로 추출하기

- map(), filter(), reduce()는 함수형 도구의 전부가 아닙니다
  - 자주 사용하는 함수형 도구일 뿐입니다
- 더 많은 함수형 도구가 있고 스스로 찾을 수 있습니다
  - 함수를 추출하고 좋은 이름을 붙여 사용하세요 !

### 보너스 팁3. 개선을 위해 실험하기

- 어떤 사람들은 함수형 도구를 사용해 아름답고 명확하게 문제를 해결합니다
- 어떻게 그렇게 할 수 있을까요?
- 많은 것을 시도하고 연습하기 때문입니다
- 좋은 방법을 찾기 위해 함수형 도구를 새로운 방법으로 조합해 보세요

## 연습문제

```js
// 개선 전
function shoesAndSocksInventory(products) {
  let inventory = 0;
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    if (product.type === "Socks" || product.type === "Shoes") {
      inventory += product.numberInInventory;
    }
  }
  return inventory;
}

// 개선 후
function shoesAndSocksInventory(products) {
  const shoesAndSocks = filter(
    products,
    (p) => p.type === "Socks" || p.type === "Shoes"
  );
  const inventories = map(shoesAndSocks, (p) => p.numberInInventory);
  return reduce(inventories, 0, (sum, i) => sum + i);
}
```

## 체이닝 디버깅을 위한 팁

- 고차 함수를 사용하는 것은 매우 추상적이기 때문에 문제가 생겼을 때 이해하기 어려운 때도 있습니다

### 구체적인 것을 유지하기

- 데이터를 처리하는 과정에서 데이터가 어떻게 생겼는지 잊어버리기 쉽습니다
- 파이프라인 단계가 많다면 더 잊어버리기 쉽습니다
- 각 단계에서 어떤 것을 하고 있는지 알기 쉽게 `이름을 잘 지어야 합니다`
- x나 a같은 변수명은 짧지만 아무 의미가 있지 않습니다
- 의미를 기억하기 쉽게 이름을 붙이세요

### 출력해보기

- 경험이 많은 함수형 개발자라도 중간에 어떤 데이터가 생기는지 잊어버리는 경우가 있습니다
- 그런 경우 각 단계 사이에 print 구문을 넣어 코드를 돌려봅니다
- 예상한 대로 동작하는지 확인할 수 있는 좋은 방법입니다
- 정말 복잡한 체인이라면 한 번에 한 단계씩 추가해 결과를 확인하고 다음 단계를 추가하세요

### 타입을 따라가 보기

- 함수형 도구는 정확한 타입이 있습니다
- 자바스크립트 처럼 타입이 없는 언어를 사용해도 함수형 도구는 타입이 있습니다
  - 다만 컴파일 타입에 타입을 검사하지 않을 뿐입니다
- 각 단계를 지나는 값의 타입을 따라가보세요
- map()은 새로운 배열을 리턴합니다
- reduce()의 결과값은 콜백이 리턴하는 값과 같습니다. 그리고 초기값과도 같습니다

## 다양한 함수형 도구

### pluck()

```js
function pluck(array, key) {
  return map(array, (obj) => obj[key]);
}
```

- map()으로 특정 필드값을 가져오기 위해 콜백을 작성하는 것은 번거롭습니다
- pluck()을 사용하면 매번 작성하지 않아도 됩니다

### concat()

- 중첩된 배열을 한 단계의 배열로 만듭니다

```js
function concat(arrays) {
  return arrays.flatmap((a) => a);
}
```

### frequenciesBy()와 groupBy()

```js
function frequenciesBy(array, func) {
  return reduce(array, {}, (result, value) => {
    const key = func(value);
    result[key] = (result[key] || 0) + 1;
    return result;
  });
}

// frequenciesBy 사용 예
const people = [
  { name: "Alice", age: 21 },
  { name: "Max", age: 20 },
  { name: "Jane", age: 20 },
];

const frequencies = frequenciesBy(people, (p) => p.age);
// { 20: 2, 21: 1 }
```

```js
function groupBy(array, func) {
  return reduce(array, {}, (result, value) => {
    const key = func(value);
    result[key] = (result[key] || []).concat(value);
    return result;
  });
}

// groupBy 사용 예
const people = [
  { name: "Alice", age: 21 },
  { name: "Max", age: 20 },
  { name: "Jane", age: 20 },
];

const groups = groupBy(people, (p) => p.age);
{
  20: [
    { name: 'Max', age: 20 },
    { name: 'Jane', age: 20 }
  ],
  21: [
    { name: 'Alice', age: 21 }
  ]
}
```

## 다양한 함수형 도구를 찾을 수 있는 곳

- Lodash: 자바스크립트 함수형 도구
- Laravel 컬렉션: PHP 함수형 도구
- 클로저 표준 라이브러리
- 하스켈 Prelude

## 더 편리한 자바스크립트 - 메서드로 체이닝

- 어떤 사람들은 체이닝하는 방법을 더 좋아합니다

```js
// 이 책에서 구현한 것
const window = 5;
const indices = range(0, array.length);
const windows = map(indices, (i) => array.slice(i, i + window));
const answer = map(windows, average);
```

```js
// 메서드로 체이닝
const answer = range(0, array.length)
  .map((i) => array.slice(i, i + window))
  .map(average);

const average = (array) => array.reduce((a, b) => a + b) / array.length;
```

## 자바 스트림

- 자바 8버전에서 함수형 프로그래밍을 위한 새로운 기능이 추가되었습니다

### 람다 표현식

- 인라인 함수를 만들 수 있습니다
  - 실제로는 컴파일러가 익명 클래스로 바꿉니다
- 람다 표현식 안에서 정의한 변수를 밖에서 참조할 수 있는 클로저(closure)를 지원하고 이 장에서 했던 것을 모두 할 수 있습니다

### 함수형 인터페이스

- Function: 인자 하나와 리턴 값을 갖는 함수로 map()에 전달하기 좋습니다
- Predicate: 인자 하나와 true 또는 false를 리턴하는 함수로 filter()에 전달하기 좋습니다
- BiFunction: 인자 두 개와 리턴값을 갖는 함수로 첫 번째 인자와 리턴 타입이 같다면 reduce()에 전달하기 좋습니다
- Consumer: 인자 하나를 받지만 리턴 값이 없는 함수로 forEach()에 전달하기 좋습니다

### 스트림 API

- 자바의 함수형 도구입니다
- map(), filter(), reduce()와 같은 함수형 도구가 있습니다
- 스트림은 원래 데이터를 바꾸지 않고 체이닝 할 수 있으며, 내부적으로 스트림을 효율적으로 사용합니다

## 값을 만들기 위한 reduce()

- reduce()로 평균을 구하거나 합을 구하는 것 뿐만 아니라 더 많은 것을 할 수 있습니다

### reduce()로 배열을 객체로 바꾸기

- reduce()는 배열을 객체로 바꾸는 데도 사용할 수 있습니다

```js
const items = ["shirt", "shoes", "jacket", "socks"];

const shoppingCart = reduce(items, {}, (cart, item) => {
  // 추가하려는 제품이 장바구니에 없는 경우
  if (!cart[item]) {
    return add_item(cart, {
      name: item,
      quantity: 1,
      price: priceLookup(item),
    });
  } else {
    // 추가하려는 제품이 장바구니에 있는 경우
    const quantity = cart[item].quantity;
    return setFieldByName(cart, item, "quantity", quantity + 1); // 제품 수량을 늘립니다
  }
});
```

```js
// 콜백 분리
const shoppingCart = reduce(items, {}, addOne);

function addOne(cart, item) {
  if (!cart[item]) {
    return add_item(cart, {
      name: item,
      quantity: 1,
      price: priceLookup(item),
    });
  } else {
    const quantity = cart[item].quantity;
    return setFieldByName(cart, item, "quantity", quantity + 1);
  }
}
```

- 이 코드가 의미하는 것
  - 고객이 장바구니에 제품을 추가한 기록이 모두 있어서 어느 시점의 장바구니라도 만들 수 있습니다
  - 모든 시점의 장바구니를 만들지 않아도 로그를 이용해 어느 시점의 장바구니라도 다시 만들 수 있습니다
- 고객이 장바구니에 추가한 제품을 배열 형태로 기록한다고 생각해 보세요
  - 되돌리기는 어떻게 구현할 수 있을까요?
  - 배열에서 마지막 항목만 없애면 됩니다 -> 이벤트 소싱(event sourcing)

## 데이터를 사용해 창의적으로 만들기

- 제거하기 기능 추가

```js
const shoppingCart = reduce(items, {}, (cart, itemOption) => {
  const op = itemOption[0];
  const item = itemOption[1];
  if (op === "add") return addOne(cart, item);
  if (op === "remove") return removeOne(cart, item);
});

function removeOne(cart, item) {
  if (!cart[item]) return cart;
  const quantity = cart[item].quantity;
  if (quantity === 1) return remove_item_by_name(cart, item);
  return setFieldByName(cart, item, "quantity", quantity - 1);
}
```

## 결론

- 이 장에서 함수형 도구를 연결해 사용하는 방법을 살펴봤습니다
- 체인(chain)이라고 부르는 방법으로 `여러 단계를 조합`했습니다
  - `체인`의 각 단계는 원하는 결과에 가까워지도록 데이터를 `한 단계씩 변환`하는 단순한 동작입니다
- 기존에 있던 반복문을 함수형 도구 체인으로 리팩터링하는 방법도 배웠습니다
- 마지막으로 reduce()가 얼마나 강력한 도구인지 알아봤습니다
- 함수형 프로그래머는 이런 도구를 자주 사용합니다
  - 기본적으로 함수형 프로그래머는 게산을 데이터 변환으로 생각합니다

## 요점 정리

- 함수형 도구는 여러 단계의 체인으로 조합할 수 있습니다
  - 함수형 도구를 체인으로 조합하면 복잡한 계산을 작고 명확한 단계로 표현할 수 있습니다
- `함수형 도구를 체인으로 조합하는 것`은 `SQL 같은 쿼리 언어로 볼 수 있습니다`
  - 함수형 도구 체인으로 배열을 다루는 복잡한 쿼리를 표현할 수 있습니다
- 종종 체인의 다음 단계를 위해 새로운 데이터를 만들거나 기존 데이터를 인자로 사용해야 하는 일이 있습니다
  - 최대한 암묵적인 정보를 명시적으로 표현하는 방법을 찾아야 합니다
- 함수형 도구는 더 많이 있습니다
  - 리팩터링 하면서 새로운 함수형 도구를 찾거나 다른 언어에서 영감을 받을 수 있습니다
- 자바처럼 전통적으로 함수형 언어가 아닌 언어들도 나름의 방법으로 함수형 도구를 지원하고 있습니다
  - 언어에 맞는 방법을 찾아 함수형 도구를 사용하세요

## 체이팅 팁

- 1. 데이터 만들기: 일부만 동작한다면 배열일부를 새로운 배열로 만든다
  - 함수형 도구는 배열 전체를 다룰 때 잘 동작하기 때문
- 2. 배열 전체를 다루기: map(), filter(), reduce()를 사용해 배열 전체를 다룬다
- 3. 작은 단계로 나누기
  - 조건문을 filter로 바꾸기
  - 유용한 함수 추출하기
  - 개선을 위해 실험하기

## 다음장에서 배울 내용

- 데이터 시퀀스에 사용할 수 있는 강력한 함수형 도구를 알아봤습니다
- 그런데 아직 중첩된 데이터를 다루기에는 부족합니다
- 중첩이 많이 될 수록 더 어렵습니다
- 다음 장에서 고차 함수로 중첩된 데이터에 사용할 수 있는 함수형 도구들을 만들어 보겠습니다
