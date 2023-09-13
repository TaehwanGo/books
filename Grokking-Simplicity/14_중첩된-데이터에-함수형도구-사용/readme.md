# 14. 중첩된 데이터에 함수형 도구 사용하기

#### 이번 장에서 살펴볼 내용

- 해시 맵에 저장된 값을 다루기 위한 `고차 함수`를 만듭니다
- 중첩된 데이터를 고차 함수로 쉽게 다루는 방법을 배웁니다
- `재귀`를 이해하고 안전하게 재귀를 사용하는 방법을 살펴봅니다
- 깊이 `중첩된 엔티티`에 `추상화 벽을 적용`해서 얻을 수 있는 장점을 이해합니다

- 이번장에서는 객체를 다룰 수 있는 함수형 도구를 살펴봅니다
  - 객체는 해시 맵을 대신해서 사용하고 있습니다
  - 이 장에서 만들 함수형 도구는 중첩된 구조를 다룰 수 있습니다

## 객체를 다루기 위한 고차 함수

- CMO: 중첩된 장바구니 제품 객체에 값을 바꾸려한다
  - 제품 크기나 수량을 늘리거나 줄이는 동작을 많이 만들었는데, 중복이 많이 생겼습니다
- 제나: 이야기를 들어보니 객체를 다룰 수 있는 고차 함수가 필요하신 것 같네요
  - 앞에서 배열을 다루는 고차 함수로 작업했는데, 객체를 다룰 수 있는 고차 함수가 있다면 유용할 것 같아요
- 킴: 맞아요. 함께 살펴 봅시다

## 필드명을 명시적으로 만들기

```js
function objectSet(object, key, value) {
  const copy = { ...object };
  copy[key] = value;
  return copy;
}

// 수량 필드명이 함수명에 있습니다
function incrementQuantity(item) {
  const quantity = item["quantity"];
  const newQuantity = quantity + 1;
  const newItem = objectSet(item, "quantity", newQuantity);
  return newItem;
}

// 크기 필드명이 함수명에 있습니다
function incrementSize(item) {
  const size = item["size"];
  const newSize = size + 1;
  const newItem = objectSet(item, "size", newSize);
  return newItem;
}
```

- 함수 이름에 있는 필드명을 확인했습니다
- 이 코드에는 `함수 이름에 있는 암묵적 인자(implicit argument in function name) 냄새`가 있습니다
- 이 함수는 함수 이름에 있는 일부분을 본문에서 사용합니다
- 이 코드의 냄새는 앞에서 배운 암묵적 인자를 드러내기(express implicit argument) 리팩터링으로 없앴습니다

```js
// 리팩터링: 암묵적 인자를 드러내기
function incrementField(item, field) {
  const value = item[field];
  const newValue = value + 1;
  const newItem = objectSet(item, field, newValue);
  return newItem;
}
```

- 리팩터링 후 중복이 많이 없어졌습니다
- 하지만 increment, decrement, double, halve(반으로, 이등분하다) 처럼 빟슷한 동작이 생겼습니다
- 또 다른 중복이 시작된 것 같습니다

```js
function incrementField(item, field) {
  const value = item[field];
  const newValue = value + 1;
  const newItem = objectSet(item, field, newValue);
  return newItem;
}

function decrementField(item, field) {
  const value = item[field];
  const newValue = value - 1;
  const newItem = objectSet(item, field, newValue);
  return newItem;
}

function doubleField(item, field) {
  const value = item[field];
  const newValue = value * 2;
  const newItem = objectSet(item, field, newValue);
  return newItem;
}

function halveField(item, field) {
  const value = item[field];
  const newValue = value / 2;
  const newItem = objectSet(item, field, newValue);
  return newItem;
}
```

- 이 함수들은 목적은 다르지만 대부분 비슷합니다
- 자세히 보면 `함수 이름에 있는 암묵적 인자 냄새`와 비슷합니다
- 각 함수 이름에는 동작 이름이 있습니다
- 여기에도 `암묵적 인자 드러내기 리팩터링을 적용`할 수 있습니다

## update() 도출하기

- 어떤 객체라도 바꿀 수 있는 함수를 도출한다면 중복을 많이 없앨 수 있습니다

```js
function incrementField(item, field) {
  // 앞부분
  const value = item[field];

  // 본문
  const newValue = value + 1;

  // 뒷부분
  const newItem = objectSet(item, field, newValue);
  return newItem;
}
```

- 동시에 두 가지 리팩터링을 해야 합니다
- 함수 이름에 있는 암묵적 인자는 `암묵적 인자를 드러내기`(express implicit argument) 리팩터링으로 동작 이름을 명시적인 인자로 바꿉니다
  - 그런데 명시적으로 바꿔야 할 인자가 일반 값이 아니고 동작입니다.
- 따라서 `함수 본문을 콜백으로 바꾸기`(replace body with callback) 리팩터링으로 동작을 함수 인자로 받도록 해야 합니다

```js
function incrementField(item, field) {
  return update(item, field, (value) => value + 1);
}

function update(object, key, modify) {
  const value = object[key]; // 값을 가져와서
  const newValue = modify(value); // 바꾸고
  const newObject = objectSet(object, key, newValue); // 설정합니다
  return newObject;
}
```

- 바꾸고 싶은 필드와 동작을 콜백으로 전달할 수 있습니다
- update()는 객체에 있는 값을 바꿉니다
  - 바꿀 객체와 바꾸려는 키, 바꾸는 동작을 함수로 넘기면 됩니다
  - 이 함수는 objectSet()을 사용하기 때문에 카피-온-라이트 원칙을 따릅니다

## 값을 바꾸기 위해 update() 사용하기

- 직원 데이터가 있고 직원의 월급을 10% 올려주려고 합니다

```js
// 직원 데이터
const employee = {
  name: "Kim",
  salary: 12000,
};

// 월급을 인자로 받아서 10% 올려주는 함수
function raise10Percent(salary) {
  return salary * 1.1;
}
```

```js
// update() 사용하기
const salaryUpdatedEmployee = update(employee, "salary", raise10Percent);
```

- update()는 원본 해시맵(객체)을 바꾸지 않고 새로운 해시맵(객체)을 만듭니다

## 리팩터링: 조회하고 변경하고 설정하는 것을 update()로 교체하기

```js
// 리팩터링 전
function incrementField(item, field) {
  const value = item[field]; // 조회
  const newValue = value + 1; // 바꾸기
  const newItem = objectSet(item, field, newValue); // 설정
  return newItem;
}

// 리팩터링 후
function incrementField(item, field) {
  return update(item, field, (value) => value + 1);
}
```

- 리팩터링 전 코드를 보면 전체 동작은 세 단계 입니다
  - 1. 객체에서 값을 조회
  - 2. 값을 바꾸기
  - 3. 객체에 값을 설정(카피-온-라이트 사용)
- 만약 이 동작을 같은 키에 하고 있다면 update() 하나로 바꿀 수 있습니다

### 조회하고 변경하고 설정하는 것을 update()로 교체하기

- 중첩된 객체에 적용하기 좋습니다

```js
// 단계 1: 조회하고 바꾸고 설정하는 것을 찾습니다
function halveField(item, field) {
  const value = item[field]; // 조회
  const newValue = value / 2; // 바꾸기
  const newItem = objectSet(item, field, newValue); // 설정
  return newItem;
}

// 단계 2: update()로 교체합니다
function halveField(item, field) {
  return update(item, field, (value) => value / 2);
}
```

## 함수형 도구: update()

- update()는 객체(해시 맵 대신 쓰고 있는)를 다루는 함수형 도구입니다
- 조금더 자세히 알아봅시다

```js
function update(object, key, modify) {
  const value = object[key]; // 조회
  const newValue = modify(value); // 바꾸기
  const newObject = objectSet(object, key, newValue); // 설정
  return newObject;
}

// key2를 바꾸는 경우
const object = {
  key1: X1,
  key2: Y1,
  key3: Z1,
};
const object2 = {
  key1: X1,
  key2: Y2, // Y를 다른 Y로 바꿉니다
  key3: Z1,
};

/**
 * 사용
 * - 객체를 update()에 전달 : object
 * - 바꾸려는 키를 update()에 전달 : "key2"
 * - 바꾸는 함수를 update()에 전달 : (value) => value + 1
 *
 */
update(object, "key2", (value) => value + 1);
```

## 객체에 있는 값을 시각화하기

- update()가 동작하는 방식을 시각화해 봅시다

- 다음과 같은 장바구니 제품이 있다고 해봅시다

```js
const shoes = {
  name: "shoes",
  quantity: 3,
  price: 7,
};

// 신발 수량을 두 배로 늘리기
const newShoes = update(shoes, "quantity", (value) => value * 2);
```

```js
function update(object, key, modify) {
  const value = object[key]; // 조회 - 단계 1
  const newValue = modify(value); // 바꾸기 - 단계 2
  const newObject = objectSet(object, key, newValue); // 설정 - 단계 3
  return newObject;
}
```

- 단계 1: 키를 가지고 객체에서 값을 조회
- 단계 2: 현재 값으로 modify()를 불러 새로운 값을 생성
- 단계 3: 복사본을 생성

## TODO

- 연습문제 풀어보기

## CMO, 개발팀의 대화

- update()가 중첩된 객체에서도 잘 동작하나요?

```js
// 중첩된 객체
const shirt = {
  name: "shirt",
  price: 13,
  options: {
    // 중첩된 객체
    color: "blue",
    size: 3, // options 객체 안에 있는 값을 꺼내야 합니다
  },
};
```

## 중첩된 update 시각화하기

```js
// 기존 incrementSize() 함수
function incrementSize(item) {
  const options = item.options; // 조회 - 단계 1
  const size = options.size; // 조회 - 단계 2
  const newSize = size + 1; // 변경 - 단계 3
  const newOptions = objectSet(options, "size", newSize); // 설정 - 단계 4
  const newItem = objectSet(item, "options", newOptions); // 설정 - 단계 5
  return newItem;
}
```

- 단계 1: 키를 가지고 객체에서 값을 조회
- 단계 2: 키를 가지고 객체에서 값을 조회
- 단계 3: 새로운 값을 생성
- 단계 4: 복사본을 생성
- 단계 5: 복사본을 생성

## 중첩된 데이터에 update() 사용하기

```js
// 원래 코드
function incrementSize(item) {
  const options = item.options;
  const size = options.size;
  const newSize = size + 1;
  const newOptions = objectSet(options, "size", newSize);
  const newItem = objectSet(item, "options", newOptions);
  return newItem;
}

// 리팩터링 후
function incrementSize(item) {
  const options = item.options; // 조회
  const newOptions = update(options, "size", (value) => value + 1); // 변경
  const newItem = objectSet(item, "options", newOptions); // 설정
  return newItem;
}
```

- 중첩이 없어진 것 같지만 아직 조회, 변경, 설정이 남아 있습니다
- 다시 한번 리팩터링 해 볼 수 있습니다

```js
// 두 번 리팩터링한 코드
function incrementSize(item) {
  return update(item, "options", (options) => {
    return update(options, "size", (size) => size + 1);
  });
}
```

- 중첩된 객체에 중첩된 update()를 사용할 수 있다는 중요한 사실을 알았습니다
- update()를 중첩해서 부르면 더 깊은 단계로 중첩된 객체에도 사용할 수 있습니다
- 이 개념을 다음 페이지에서 더 발전시켜봅시다

## updateOption() 도출하기

- update() 안에서 update()를 호출하는 코드를 일반화해서 updateOption()을 만들 수 있습니다

```js
// 두 번 리팩터링한 기존 코드
function incrementSize(item) {
  return update(item, "options", (options) => {
    return update(options, "size", increment);
  });
}

const increment = (size) => size + 1;
```

- (여기에서 데이터가 중첩된 단계 만큼 update()를 호출해야 한다는 것을 알 수 있습니다. 이것은 중요하지만 잠시 뒤에 알아보겠습니다)
- 이 코드는 전에 봤던 냄새가 있습니다

  - 함수 이름에 있는 암묵적 인자를 사용하고 있습니다

- 암묵적 인자를 명시적 인자로 바꿔봅시다
  - size 부터 하나씩 해봅시다

```js
// 1-1. 암묵적 option 인자: "size"
function incrementSize(item) {
  return update(item, "options", (options) => {
    return update(options, "size", increment);
  });
}

// 1-2. 명시적 option 인자: 암묵적 인자 "size" -> 명시적 인자 option
function incrementOption(item, option) {
  return update(item, "options", (options) => {
    return update(options, option, increment);
  });
}

// 2-1. 암묵적 modify 인자: increment
function incrementOption(item, option) {
  return update(item, "options", (options) => {
    return update(options, option, increment);
  });
}

// 2-2. 명시적 modify 인자: 암묵적 인자 increment -> 명시적 인자 modify
function updateOption(item, option, modify) {
  // 여전히 함수 이름에 있는 것을 본문에서 참조하고 있습니다: "options"
  return update(item, "options", (options) => {
    return update(options, option, modify);
  });
}
```

## update2() 도출하기

- 리팩터링을 한번 더 하면 일반적인 함수인 update2()를 도출할 수 있습니다

```js
// 기존
function updateOption(item, option, modify) {
  // 여전히 함수 이름에 있는 것을 본문에서 참조하고 있습니다: "options"
  return update(item, "options", (options) => {
    return update(options, option, modify);
  });
}
```

- 세 번째 리팩터링을 해봅시다
- 함수 이름도 일반적인 형태에 맞춰 바꾸겠습니다

```js
function update2(object, key1, key2, modify) {
  return update(object, key1, (value1) => {
    return update(value1, key2, modify);
  });
}
```

- 이제 더 일반적인 함수가 되었습니다
- update2()는 두 단계로 중첩된 어떤 객체에도 쓸 수 있는 함수입니다
- 그래서 함수를 쓸 때 두 개의 키가 필요합니다

```js
// 원래 코드
function incrementSize(item) {
  const options = item.options;
  const size = options.size;
  const newSize = size + 1;
  const newOptions = objectSet(options, "size", newSize);
  const newItem = objectSet(item, "options", newOptions);
  return newItem;
}

// update2()를 사용한 코드
function incrementSize(item) {
  return update2(item, "options", "size", increment);
}
```

## CMO, 개발팀의 대화

```js
const cart = {
  shirt: {
    name: "shirt",
    price: 13,
    options: {
      color: "blue",
      size: 3,
    },
  },
};
```

- 세 번 중첩된 객체
  - cart.shirt.options.size
- update3(?)

## incrementSizeByName()을 만드는 네 가지 방법

### 옵션1: update()와 incrementSize()로 만들기

- update()와 incrementSize()를 사용해서 만들 수 있습니다

```js
function incrementSizeByName(cart, name) {
  return update(cart, name, incrementSize); // 이미 있는 도구를 활용한 직관적인 방법
}
```

### 옵션2: update()와 update2()로 만들기

- update2()를 사용해 incrementSize()를 인라인으로 구현할 수 있습니다

```js
function incrementSizeByName(cart, name) {
  return update(cart, name, (item) => {
    return update2(item, "options", "size", (size) => size + 1);
  });
}
```

### 옵션3: update()로 만들기

- 여러번 중첩된 update()로 만들 수 있습니다

```js
function incrementSizeByName(cart, name) {
  return update(cart, name, (item) => {
    return update(item, "options", (options) => {
      return update(options, "size", (size) => size + 1);
    });
  });
}
```

### 옵션4: 조회하고 바꾸고 설정하는 것을 직접 만들기

```js
function incrementSizeByName(cart, name) {
  const item = cart[name]; // 조회
  const options = item.options; // 조회
  const size = options.size; // 조회
  const newSize = size + 1; // 변경
  const newOptions = objectSet(options, "size", newSize); // 설정
  const newItem = objectSet(item, "options", newOptions); // 설정
  const newCart = objectSet(cart, name, newItem); // 설정
  return newCart;
}
```

## update3() 도출하기

```js
function update3(object, key1, key2, key3, modify) {
  return update(object, key1, (object2) => {
    return update2(object2, key2, key3, modify);
  });
}

// 리팩터링 코드
function incrementSizeByName(cart, name) {
  return update3(cart, name, "options", "size", (size) => size + 1);
}
```

## nestedUpdate() 도출하기

- 중첩된 개수에 상관없이 쓸 수 있는 nestedUpdate()를 만들어 봅시다
- 먼저 패턴을 찾아봅시다
  - updateX()를 만들려고 한다면 updateX-1()을 불러주면 됩니다
  - update1()은 update()와 같습니다
  - update0()은 modify()를 그냥 호출하는 함수가 됩니다

```js
function update0(value, modify) {
  return modify(value);
}
```

```js
// 재귀호출을 이용한 updateX() 함수
function updateX(object, keys, modify) {
  if (keys.length === 0) {
    return modify(object);
  }
  const key1 = keys[0];
  const restKeys = keys.slice(1); // 첫 번째 키를 뺀 나머지 키들(drop_first(keys)를 대체)
  return update(object, key1, (value1) => {
    // updateX를 재귀 호출
    return updateX(value1, restKeys, modify);
  });
}
```

- 이제 키 길이에 상관없이 쓸 수 있는 updateX()가 생겼습니다
- 여러 단계로 중첩된 객체에 modify() 함수를 적용할 수 있습니다
- 바꿀 값이 있는 키들만 알면 됩니다
- updateX()는 일반적으로 nestedUpdate()라고 부릅니다
- 이제 이름을 바꿔봅시다
  - updateX 보다 nestedUpdate()가 더 일반적입니다

```js
function nestedUpdate(object, keys, modify) {
  if (keys.length === 0) {
    return modify(object);
  }
  const key1 = keys[0];
  const restKeys = keys.slice(1); // 첫 번째 키를 뺀 나머지 키들
  return update(object, key1, (value1) => {
    // 재귀 호출
    return nestedUpdate(value1, restKeys, modify);
  });
}
```

- 함수형 프로그래머는 다른 프로그래머보다 재귀 함수를 조금 더 많이 사용합니다

## 쉬는 시간

### 재귀의 핵심은 무엇인가요?

- 재귀는 중첩된 데이터와 잘 어울립니다
- 중첩된 데이터를 한 단계 없애고 당므 단계를 같은 방법으로 다시 호출합니다

### 반복문을 사용할 수는 없나요?

- 중첩된 데이터를 다루는 경우에는 재귀로 만드는 것이 더 명확합니다
- 재귀의 장점은 재귀 호출을 리턴 받는 곳에서 기존의 인자값을 스택으로 유지할 수 있다는 점입니다
- 만일 일반 반복문으로 만든다면 스택을 직접 관리해야 합니다

### 재귀호출은 위험한가요? 무한 반복에 빠지거나 스택이 바닥날 수 있나요?

- 네. 재귀도 절차적인 반복문처럼 무한 반복에 빠질 수 있습니다
- 언어나 재귀 함수에 따라 스택이 빨리 바닥날 수 있습니다
  - 하지만 잘 만들었다면 그렇게 깊은 스택을 사용할 일이 없을 것입니다
- 재귀를 안전하게 사용하는 방법에 대해 알아봅시다

## 안전한 재귀 사용법

- 재귀는 for나 while 반복문 처럼 무한 반복에 빠질 수 있습니다
- 다음 가이드를 따라서 하면 문제가 생기지 않습니다

### 1. 종료 조건

- 재귀를 멈추려면 종료 조건(base case)이 필요합니다
- 종료 조건은 재귀가 멈춰야 하는 곳에 있어야 합니다
- 더는 재귀 호출을 하지 않으므로 그 위치에서 재귀가 끝납니다

```js
function nestedUpdate(object, keys, modify) {
  if (keys.length === 0) {
    // 종료 조건
    return modify(object); // 재귀가 없음
  }
  const key1 = keys[0];
  const restKeys = keys.slice(1);
  return update(object, key1, (value1) => {
    return nestedUpdate(value1, restKeys, modify);
  });
}
```

- 종료 조건은 확인하기 쉽습니다
  - 보통 배열 인자가 비었거나 점점 줄어드는 값이 0이 되었거나
  - 찾아야 할 것이 없을 때 종료 조건이 됩니다
  - 종료 조건이 되면 할 일이 끝난 것입니다

### 2. 재귀 호출

- 재귀 함수는 최소 하나의 재귀 호출(recursive call)이 있어야 합니다

```js
function nestedUpdate(object, keys, modify) {
  if (keys.length === 0) {
    return modify(object);
  }
  const key1 = keys[0];
  const restKeys = keys.slice(1); // 남은 키가 하나 줄어듭니다(진행) - 종료 조건에 다가가기
  return update(object, key1, (value1) => {
    // 재귀 호출
    return nestedUpdate(value1, restKeys, modify);
  });
}
```

### 3. 종료 조건에 다가가기

- 재귀 함수를 만든다면 최소 하나 이상의 인자가 점점 줄어들어야 합니다
- 그래야 종료 조건에 가까워 질 수 있습니다

## 재귀 함수가 적합한 이유

- 지금까지 배열을 반복해서 처리하기 위해 반복문을 사용했지만 이번에는 중첩된 데이터를 다뤄야 했습니다
- 배열은 차례대로 처리합니다
- 중첩된 데이터는 점점 아래 단계로 내려가면서 최종 값에 도착하면 값을 변경하고 나오면서 새로운 값을 설정합니다
  - e.g. 조회 -> 조회 -> 바꾸기 -> 설정 -> 설정

## 연습문제 - 385p

- TODO 풀어보기

## 깊이 중첩된 구조를 설계할 때 생각할 점

- 깊이 중첩된 데이터에 nestedUpdate()를 쓰려면 긴 키 경로가 필요합니다
- 키 경로가 길면 중간 객체가 어떤 키를 가졌는지 기억하기 어렵습니다

```js
/**
 * 블로그 API로 blog라는 분류에 있는 값을 JSON으로 가져와 콜백에서 처리하는 코드
 * 12번째 글을 가져와 글쓴이 이름을 대문자로 바꾸는 일을 합니다
 */
httpGet("http://my-blog.com/api/category/blog", (blogCategory) => {
  renderCategory(
    nestedUpdate(blogCategory, ["posts", "12", "author", "name"], capitalize)
  );
});
```

- 3주 후에 이 코드를 읽으려고 할 때 얼마나 잘 이해할 수 있을까요? 다음과 같은 것을 알 수 있을 까요?

  - 1. 각 분류는 posts 키 아래에 블로그 글을 담고 있습니다
  - 2. 각 블로그 글은 ID를 통해 접근할 수 있습니다
  - 3. 블로그 글은 author 키 아래 글쓴이 사용자 레코드를 담고 있습니다
  - 4. 각 사용자 레코드는 name 키 아래 사용자 이름을 담고 있습니다

- 경로에 따라 중첩된 각 단계에는 기억해야 할 새로운 데이터 구조가 있습니다

  - 각 데이터 구조에 어떤 키가 있는지 기억하기는 어렵습니다
  - 중간 객체들은 서로 다른 키를 가지고 있지만 nestedUpdate() 경로를 보고 어떤 키가 있을지 알 수 없습니다

- 그럼 어떻게 해야 할까요?
  - 9장에서 배웠던 `직접 구현(함수가 모두 비슷한 계층에 있다)`으로 해결할 수 있습니다
  - 기억해야 할 것이 너무 많을 때 추상화 벽을 사용하면 도움이 됩니다

## 깊이 중첩된 데이터에 추상화 벽 사용하기

- 깊이 중첩된 데이터를 사용할 때 너무 많은 것을 기억하긴 어렵습니다
- 문제를 해결하는 열쇠는 같은 작업을 하면서 알아야 할 데이터 구조를 줄이는 것입니다
- 추상화 벽을 통해 그렇게 할 수 있습니다
- `추상화 벽`을 만들 때는 사용하려는 `데이터의 이해도를 높일 수 있는 방향`으로 만들어야 합니다

```js
/**
 * ID로 블로그를 변경하는 함수
 * - 명확한 이름: updatePostById()
 * - 분류(category)에 있는 블로그 글이 어떤 구조인지 몰라도 함수를 쓸 수 있습니다
 * - 분류 구조 같은 구체적인 부분은 추상화 벽뒤로 숨김 -> ['post', id]
 */
function updatePostById(category, id, modifyPost) {
  return nestedUpdate(category, ["post", id], modifyPost);
}

/**
 * 글쓴이를 수정하는 함수
 */
function updateAuthor(post, modifyUser) {
  return update(post, "author", modifyUser);
}

/**
 * 이름을 대문자로 바꾸는 함수
 */
function capitalizeName(user) {
  return update(user, "name", capitalize);
}

// 모두 합치기
updatePostById(blogCategory, 12, (post) => {
  return updateAuthor(post, capitalizeName);
});
```

- 더 좋아진 걸까요? 두 가지 때문에 더 좋아졌다고 말할 수 있습니다

  - 1. 기억해야할 것이 네 가지에서 세 가지로 줄었다
  - 2. 동작의 이름이 있으므로 각각의 동작을 기억하기 쉽다

- 내 생각
  - `함수형 도구`를 만들 때는 `함수명을 추상화`하다가
  - `추상화 벽`을 만들 때는 `명시적인 이름을 사용`한다

## 앞에서 배운 고차 함수들

- 10장에서 고차 함수에 대한 개념을 처음 배웠습니다
  - 고차 함수: 다른 함수를 인자로 받거나 함수를 리턴값으로 리턴할 수 있는 함수
- 아래를 보면서 고차함수가 얼마나 유용했는지 다시 한번 생각해봅시다

### 배열을 반복할 때 for 반복문 대신 사용하기

- forEach(), map(), filter(), reduce()
- 배열을 효과적으로 다룰 수 있는 고차함수
  - 이 함수들을 조합해 복잡한 계산을 할 수 있다는 것을 배웠습니다
  - p. 257, 294, 301, 306

### 중첩된 데이터를 효율적으로 다루기

- 깊이 중첩된 데이터를 변경하려면 바꾸려는 데이터까지 내려 가는 동안의 데이터를 모두 복사해야 합니다
- update()와 nestedUpdate() 고차 함수로 중첩 단계에 상관없이 특정한 값을 수술하는 것 처럼 바꿀 수 있습니다
  - p. 358, 380

### 카피-온-라이트 원칙 적용하기

- 카피-온-라이트 원칙을 적용한 코드는 중복이 많습니다
- 복사하고 바꾸고 리턴하는 코드가 항상 있습니다
- withArrayCopy()와 withObjectCopy()를 사용하면 중복을 없앨 수 있습니다
  - p. 271, 275

### try/catch 로깅 규칙을 코드화

- wrapLogging()은 어떤 함수를 받아 그 함수가 리턴하는 값을 그대로 리턴해 주지만,
  에러가 발생하면 잡아서 로그를 남기는 함수 입니다
- 어떤 함수에 다른 행동이 추가된 함수로 바꿔 주는 좋은 예제입니다
  - p. 282

## 결론

- 중첩된 데이터를 다루기 위해 같은 리팩터링을 적용했습니다
- 중첩된 데이터에도 동작할 수 있는 코드를 만들기 위해 재귀를 사용했습니다
- 재귀를 설계할 때 고려해야 할 점과 해결 방법에 대해 논의했습니다

## 요점 정리

- update() 일반적인 패턴을 구현한 함수형 도구입니다
  - update()를 사용하면 객체 안에서 값을 꺼내 변경하고 다시 설정하는 일을 수동으로 하지 않아도 됩니다
- nestedUpdate()는 깊이 중첩된 데이터를 다루는 함수형 도구입니다
  - 바꾸려고 하는 값이 어디 있는지 가리키는 키 경로만 알면 중첩된 데이터를 쉽게 바꿀 수 있습니다
- 보통 일반적인 반복문은 재귀보다 명확합니다
  - 하지만 `중첩된 데이터를 다룰 때`는 `재귀가 더 쉽고 명확`합니다
- 재귀는 스스로 불렀던 곳이 어디인지 유지하기 위해 스택을 사용합니다
  - 재귀 함수에서 스택은 중첩된 데이터 구조를 그대로 반영합니다
- 깊이 중첩된 데이터는 이해하기 어렵습니다
  - 깊이 중첩된 데이터를 다룰 때 모든 데이터 구조와 어떤 경로에 어떤 키가 있는지 기억해야 합니다
- 많은 키를 가지고 있는 깊이 중첩된 구조에 추상화 벽을 사용하면 알아야 할 것이 줄어듭니다
  - 추상화 벽으로 깊이 중첩된 구조를 쉽게 다룰 수 있습니다

## 내 생각

- nestedUpdate는 lodash의 set() 함수와 비슷한 역할을 합니다
  - https://lodash.com/docs/4.17.15#set
  - https://github.com/lodash/lodash/blob/2da024c3b4f9947a48517639de7560457cd4ec6c/set.js#L30

## 다음 장에서 배울 내용

- 이제 일급 값과 고차 함수에 대해 조금 익숙해졌을 것입니다
- 현대 프로그래밍에서 가장 어려운 부분인 분산 시스템에 대해 이야기 해보려고 합니다
- 좋든 싫든 오늘날 소프트웨어는 최소한 프런트엔드와 백엔드 컴포넌트로 구성되어 있습니다
- 그리고 프런트엔드와 백엔드 사이에 데이터를 공유하는 일은 복잡합니다
- 일급 값과 고차 함수 개념으로 이러한 것을 다뤄 보려고 합니다
