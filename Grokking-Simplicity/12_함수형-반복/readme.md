# 12. 함수형 반복

#### 이번 장에서 살펴볼 내용

- 함수형 도구 map(), filter(), reduce()에 대해 배웁니다
- 배열에 대한 반복문을 함수형 도구로 바꾸는 방법에 대해 알아봅니다
- 함수형 도구를 어떻게 구현하는지 알아봅니다

## 코드 냄새 하나와 리팩터링 두 개

- 앞에서 배운 코드 냄새와 리팩터링을 다시 한번 정리해 봅시다

### 코드의 냄새: 함수 이름에 있는 암묵적 인자

- 이 코드의 냄새는 일급 값으로 바꾸면 표현력이 더 좋아집니다
- 함수 본문에서 사용하는 어떤 값이 함수 이름에 나타난다면 함수 이름에 있는 암묵적 인자는 코드의 냄새가 됩니다
- 특징
  - 거의 똑같이 구현된 함수가 있다
  - 함수 이름이 구현에 있는 다른 부분을 가리킨다
- 아래 리팩터링으로 해결할 수 있습니다

### 리팩터링: 암묵적 인자를 드러내기

- 함수 이름에 있는 암묵적 인자를 어떻게 명시적인 함수 인자로 바꿀 수 있을까요?
- 암묵적 인자를 드러내기 리팩터링은 암묵적 인자가 일급 값이 되도록 함수에 인자를 추가합니다
- 이렇게 하면 잠재적 중복을 없애고 코드의 목적을 더 잘 표현할 수 있습니다
- 단계
  - 함수 이름에 있는 암묵적 인자를 확인합니다
  - 명시적인 인자를 추가합니다
  - 함수 본문에 하드 코딩된 값을 새로운 인자로 바꿉니다
  - 함수를 호출하는 곳을 고칩니다

### 리팩터링: 함수 본문을 콜백으로 바꾸기

- 함수 본문을 콜백으로 바꾸기 리팩터링으로 `함수 본문에 어떤 부분`을 `콜백으로` 바꿉니다
- 이렇게 하면 `일급 함수로 어떤 함수에 동작을 전달할 수 있습니다`
- 이 방법은 원래 있던 코드를 고차 함수로 만드는 강력한 방법입니다
- 단계
  - 함수 본문에서 바꿀 부분의 앞부분과 뒷부분을 확인합니다
  - 리팩터링 할 코드를 함수로 빼냅니다
  - 빼낸 함수의 인자로 넘길 부분을 또 다른 함수로 빼냅니다

## for -> forEach

```js
// 3장에서 나왔던 코드
function emailsForCustomers(customers, goods, bests) {
  const emails = [];
  for (let i = 0; i < customers.length; i++) {
    const customer = customers[i];
    const email = emailForCustomer(customer, goods, bests);
    emails.push(email);
  }
  return emails;
}

// forEach 함수로 반복문을 바꾸기
function emailsForCustomers(customers, goods, bests) {
  const emails = [];
  // 이 forEach는 이전 장에서 만들어본 forEach 입니다
  forEach(customers, (customer) => {
    const email = emailForCustomer(customer, goods, bests);
    emails.push(email);
  });
  return emails;
}
```

- 위 함수는 새로울 배열을 리턴하기 때문에 map() 과 같습니다

## 예제를 통해 map() 함수를 도출하기

```js
// 원래 코드
function emailsForCustomers(customers, goods, bests) {
  const emails = [];
  forEach(customers, (customer) => {
    // 앞부분
    const email = emailForCustomer(customer, goods, bests); // 본문
    emails.push(email); // 뒷부분
  });
  return emails;
}

// map() 함수로 리팩터링
function emailsForCustomers(customers, goods, bests) {
  return map(customers, (customer) => {
    return emailForCustomer(customer, goods, bests);
  });
}
```

- 함수 본문을 콜백으로 바꾸기 리팩터링 단계
  - 본문과 앞부분, 뒷부분을 확인하기
  - 함수 빼내기
  - 콜백 빼내기

## 함수형 도구: map()

```js
function map(array, f) {
  const newArray = [];
  forEach(array, (element) => {
    newArray.push(f(element));
  });
  return newArray;
}
```

- 익명 함수 : 이름이 없는 함수
- 인라인 함수 : 이름을 붙여 쓰는 대신 쓰는 곳에서 바로 정의 하는 함수
  - 익명 함수로 필요한 곳에 인라인으로 정의합니다

## 함수를 전달하는 세 가지 방법

### 전역으로 정의하기

- 전역으로 정의해서 사용

### 지역적으로 정의하기

- 함수 안에서 정의하고 사용

### 인라인으로 정의하기

- 사용하는 곳에서 바로 정의하고 사용
  - 익명 함수
- 문맥에서 한번만 쓰는 짧은 함수에 사용하면 좋습니다

## 예제를 통해 filter() 함수 도출하기

```js
// 원래 코드
function selectBestCustomers(customers) {
  const newArray = [];
  forEach(customers, (customer) => {
    // 앞부분
    if (customer.purchases.length > 3) {
      // 본문(if문으로 검사)
      newArray.push(customer);
    }
  });
  return newArray; // 뒷부분
}

// 콜백 함수로 바꾼 버전
function selectBestCustomers(customers) {
  return filter(customers, (customer) => {
    return customer.purchases.length > 3;
  });
}

// filter() 함수
function filter(array, f) {
  const newArray = [];
  forEach(array, (element) => {
    if (f(element)) newArray.push(element);
  });
  return newArray;
}
```

## 함수형 도구: filter()

```js
// 배열과 함수를 인자로 받습니다
function filter(array, f) {
  const newArray = []; // 빈 배열을 만듭니다
  forEach(array, (element) => {
    // f()를 호출해 항목을 결과 배열에 넣을지 확인합니다
    if (f(element)) {
      newArray.push(element); // 조건에 맞으면 원래 항목을 결과 배열에 넣습니다
    }
  });
  return newArray; // 결과 배열을 리턴합니다
}
```

- filter()도 map() 처럼 전달하는 함수가 계산일 때 사용하기 쉽습니다

## 예제 아무것도 구입하지 않은 고객

```js
filter(customers, (c) => {
  return c.purchases.length === 0;
});
```

- 만약 map을 사용했다면 null이 있을 수 있습니다

## 누적값을 계산하고 싶다면

```js
function countAllPurchases(customers) {
  let totalPurchases = 0;
  forEach(customers, (c) => {
    totalPurchases += c.purchases.length;
  });
  return totalPurchases;
}
```

- 기존의 map, filter에선 새로운 배열을 리턴하지만 이번엔 배열을 순회하면서 값을 누적한 값을 리턴합니다

## 예제를 통해 reduce() 함수 도출하기

```js
// 원래 코드
function countAllPurchases(customers) {
  let totalPurchases = 0;
  // 앞부분
  forEach(customers, (c) => {
    totalPurchases += c.purchases.length; // 본문
  });
  return totalPurchases; // 뒷부분
}

// 콜백으로 바꾼 버전
function countAllPurchases(customers) {
  // reduce(배열, 초기값, 콜백함수)
  return reduce(customers, 0, (totalPurchases, c) => {
    return totalPurchases + c.purchases.length;
  });
}

// reduce() 함수
function reduce(array, initialValue, f) {
  let acc = initialValue;
  forEach(array, (element) => {
    acc = f(acc, element);
  });
  return acc;
}
```

## 함수형 도구: reduce()

```js
// 배열, 초기값, 누적함수를 받습니다
function reduce(array, initialValue, f) {
  let acc = initialValue; // 누적된 값을 초기화 합니다
  forEach(array, (element) => {
    acc = f(acc, element); // 누적 값을 계산하기 위해 현재 값과 배열 항목으로 f() 함수를 부릅니다
  });
  return acc; // 누적된 값을 리턴합니다
}
```

## 예제: 문자열 합치기

```js
reduce(strings, "", (acc, s) => {
  return acc + s;
});
```

- reduce 함수를 사용할 때는 인자 순서에 주의하자

#### 초기값을 결정하는 방법

1. 계산이 어떤 값에서 시작하는가?

- 더하기 : 0
- 곱하기 : 1

2. 빈 배열을 사용하면 어떤 값을 리턴할 것인가?

- 빈 문자열 배열을 사용한다면 합친 결과는 빈 문자열이어야 한다

3. 비즈니스 규칙이 있는가?

## 연습 문제 - reduce() 응용

```js
// 배열에 있는 모든 수를 더하기
function sum(numbers) {
  return reduce(numbers, 0, (acc, n) => {
    return acc + n;
  });
}

// 배열에 있는 모든 수를 곱하기
function product(numbers) {
  return reduce(numbers, 1, (acc, n) => {
    return acc * n;
  });
}

// 최소값 찾기
function min(numbers) {
  return reduce(numbers, Number.MAX_SAFE_INTEGER, (m, n) => {
    if (m < n) return m;
    else return n;
  });
}

// 최대값 찾기
function max(numbers) {
  return reduce(numbers, Number.MIN_SAFE_INTEGER, (m, n) => {
    if (m > n) return m;
    else return n;
  });
}
```

## 연습 문제 - 양극단의 값을 사용하는 질문들

- 1. map() 함수에 빈 배열을 넘기면?
  - map([], xToY) => []
- 2. filter() 함수에 빈 배열을 넘기면?
  - filter([], isGood) => []
- 3. reduce() 함수에 빈 배열을 넘기면?
  - reduce([], init, combine) => init
- 4. map() 함수에 인자를 그대로 리턴하는 함수를 넘기면?
  - 얕은 복사가 된 배열을 리턴합니다
- 5. filter() 함수에 항상 true를 리턴하는 함수를 넘기면?
  - 얕은 복사가 된 배열을 리턴합니다
- 6. filter() 함수에 항상 false를 리턴하는 함수를 넘기면?
  - 빈 배열을 리턴합니다 => []

## reduce()로 할 수 있는 것들

### 실행 취소/복귀

- 실행 취소는 리스트의 마지막 사용자 입력을 없애는 것

### 테스트할 때 사용자 입력을 다시 실행하기

- reduce로 모든 값을 합쳐 현재 상태를 만들 수 있습니다

### 시간 여행 디버깅

- 문재를 고치고 새로운 코드로 다시 실행해 볼 수 있습니다
  - 행위를 저장
    - e.g.
      - [+3, -2, *2, ...]

### 회계 감사 추적

- 특정 시점의 시스템 상태를 알고 싶은 경우
- reduce()로 과거에 어떤 일이 있었는지 기록할 수 있습니다

### 언어 탐구

- 다른 언어에서는 reduce() 대신 fold()라는 이름을 사용하기도 합니다
- foldLeft, foldRight

## 연습 문제 - reduce()로 map()과 filter()를 만들어보자

```js
// map() 함수를 reduce()로 만들기
function map(array, f) {
  return reduce(array, [], (ret, item) => {
    return ret.concat(f([element]));
  });
}

function map(array, f) {
  return reduce(array, [], (ret, item) => {
    const ret = ret.push(f(element));
    return ret;
  });
}

// filter() 함수를 reduce()로 만들기
function filter(array, f) {
  return reduce(array, [], (ret, element) => {
    if (f(element)) return ret.concat([element]);
    else return ret;
  });
}

function filter(array, f) {
  return reduce(array, [], (ret, element) => {
    if (f(element)) return ret.push(element);
    else return ret;
  });
}
```

## 세 가지 함수형 도구를 비교하기

- map()
  - 어떤 배열의 모든 항목에 함수를 적용해 새로운 배열로 바꿉니다
- filter()
  - 어떤 배열의 하위 집합을 선택해 새로운 배열로 만듭니다
- reducer()
  - 어떤 배열의 항목을 조합해 최종값을 만듭니다

## 요점 정리

- map, filter, reduce는 특별한 방법으로 배열을 반복할 수 있습니다

  - 반복문을 대체해서 코드의 목적을 더 명확하게 할 수 있습니다

- `map()`은 어떤 `배열의 모든 항목에 함수를 적용`해 `새로운 배열`로 바꿉니다
  - 각 항목은 지정한 콜백함수에 의해 변환됩니다
- `filter()`는 `어떤 하위 집합을 선택`해 `새로운 배열`로 만듭니다
  - 술어를 전달해서 특정 항목을 선택할 수 있습니다
- `reduce()`는 `초기값`을 가지고 `어떤 배열의 항목을 조합`해 `하나의 값`을 만듭니다
  - 데이터를 요약하거나 시퀀스를 하나의 값으로 만들 때 주로 사용합니다

## 다음 장에서 배울 내용

- 이번 장에서 데이터 시퀀스에 사용할 수 있는 강력한 함수형 도구를 알아봤습니다
- 다음 장에서 함수형 도구를 하나의 프로세스로 조합하는 방법을 알아보겠습니다(체이닝)
- 조합해서 더 강력한 방법으로 데이터를 변환할 수 있습니다
