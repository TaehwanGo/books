# 6. 변경 가능한 데이터 구조를 가진 언어에서 불변성 유지하기

- 일반적인 자바스크립트 배열과 객체에 불변 데이터를 다룰 수 있는 동작을 만들고 적용해 보겠습니다

#### 이번장에서 살펴볼 내용

- `데이터가 바뀌지 않도록` 하기 위해 `카피-온-라이트`를 적용합니다
- 배열과 객체를 데이터에 쓸 수 있는 카피-온-라이트 동작을 만듭니다
- 깊이 중첩된 데이터도 카피-온-라이트가 잘 동작하게 만듭니다

## 모든 동작을 불변형으로 만들 수 있나요?

- 앞(5장)에서 동작 일부에 카피-온-라이트 원칙을 적용하여 구현해봤습니다

  - 배열을 복사하고 값을 바꾼 다음 리턴했습니다

- 아래는 카피-온-라이트를 적용해야하거나 적용해야 할지도 모르는 장바구니와 제품에 대한 동작입니다

### 장바구니에 대한 동작

- 1. 제품 개수 가져오기
- 2. 제품 이름으로 제품 가져오기
- 3. 제품 추가하기 // 이미 구현함
- 4. 제품 이름으로 제품 빼기
- 5. 제품 이름으로 제품 구매 수량 바꾸기 // 중첩된 데이터에 대한 동작

### 제품에 대한 동작

- 1. 가격 설정하기
- 2. 가격 가져오기
- 3. 이름 가져오기

- 어떻게 하면 중첩된 데이터에 대한 불변 동작을 구현할 수 있을까요?

## 동작을 읽기, 쓰기 또는 둘 다로 분류하기

- `읽기` : 데이터를 바꾸지 않고 정보를 꺼내는 것
  - 만약 인자에만 의존해 정보를 가져온느 읽기 동작이라면 `계산`이라고 할 수 있습니다
- 쓰기 : 데이터를 바꾸는 것
  - 어디에서 사용될지 모르기 때문에 바뀌지 않도록 원칙이 필요합니다

### 장바구니 동작

- 1. 제품 개수 가져오기 // 읽기
- 2. 제품 이름으로 제품 가져오기 // 읽기
- 3. 제품 추가하기 // 쓰기
- 4. 제품 이름으로 제품 빼기 // 쓰기
- 5. 제품 이름으로 제품 구매 수량 바꾸기 // 쓰기

### 카피 온 라이트

- 쓰기 동작은 불변성 원칙에 따라 구현해야 합니다
- 불변성 원칙은 카피-온-라이트(copy-on-write)라고 합니다

### 제품에 대한 동작

- 1. 가격 설정하기 // 쓰기
- 2. 가격 가져오기 // 읽기
- 3. 이름 가져오기 // 읽기

## 카피-온-라이트 원칙 세 단계

1. `복사`본 만들기
2. 복사본 `변경`하기
3. 복사본 `리턴`하기

### 예시

```js
function add_element_last(array, element) {
  const new_array = array.slice(); // 1. 복사본 만들기
  new_array.push(element); // 2. 복사본 변경하기
  return copy; // 3. 복사본 리턴하기
}
```

- `카피-온-라이트`는 `쓰기를 읽기로 바꿉니다`
  - `데이터를 바꾸지 않았고 정보를 리턴했기 때문에` `읽기` 입니다

## 카피-온-라이트로 쓰기를 읽기로 바꾸기

```js
// 현재 코드
function remove_item_by_name(cart, name) {
  let idx = null;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].name === name) {
      idx = i;
      break;
    }
  }
  if (idx !== null) {
    cart.splice(idx, 1);
  }
}
```

```js
// 인자를 복사하도록 바꾼 코드
function remove_item_by_name(cart, name) {
  let new_cart = cart.slice(); // 1. 복사본 만들기
  let idx = null;
  for (let i = 0; i < new_cart.length; i++) {
    // 2. 복사본 변경하기
    if (new_cart[i].name === name) {
      idx = i;
      break;
    }
  }
  if (idx !== null) {
    new_cart.splice(idx, 1);
  }
  return new_cart; // 3. 복사본 리턴하기
}
```

- Array.prototype.slice() 는 배열을 얕은 복사합니다

## 읽으면서 쓰기도 하는도 하는 동작은 어떻게 해야 할까요?

- shift 같이 배열을 바꾸면서 값을 리턴하는 동작은 어떻게 해야 할까요?
  - 1. 읽기와 쓰기 함수로 각각 분리한다
  - 2. 함수에서 값을 두 개 리턴한다

### 읽으면서 쓰기도 하는 함수를 읽기 함수로 바꾸기

- 값을 두 개 리턴하는 함수로 만들기

```js
// before
function shift(array) {
  return array.shift();
}

// after
function shift(array) {
  const array_copy = array.slice(); // 1. 복사본 만들기
  const first = array_copy.shift(); // 2. 복사본 변경하기
  // 3. 복사본 리턴하기
  return {
    first,
    array: array_copy,
  };
}

// 또 다른 방법 - 두 값을 객체로 조합하기
function shift(array) {
  // 사용하는 두 함수 모두 계산이기 때문에 조합해도 이 함수는 계산입니다
  return {
    first: first_element(array),
    array: drop_first(array),
  };
}
```

## 불변 데이터 구조를 읽는 것은 계산입니다

- 변경 가능한 데이터를 읽는 것은 액션입니다

- 쓰기는 데이터를 변경 가능한 구조로 만듭니다

- 어떤 데이터에 쓰기가 없다면 데이터는 변경 불가능한 데이터입니다

- 불변 데이터 구조를 읽는 것은 계산입니다

- 쓰기를 읽기로 바꾸면 코드에 계산이 많아집니다
  - 데이터 구조를 불변형으로 만들수록 코드에 더 많은 계산이 생기고 액션은 줄어듭니다

## 애플리케이션에는 시간에 따라 변하는 상태가 있습니다

- 모든 값을 불변형으로 만들더라도 시간에 따라 바뀌는 값을 다룰 수 있어야 합니다
- e.g. 장바구니 전역변수
- 장바구니 값(shopping_cart)은 새 값으로 교체(swapping)된다고 할 수 있습니다

```js
shopping_cart = add_item(shopping_cart, item);
// add_item : 읽기, 바꾸기
// shopping_cart = add_item(shopping_cart, item) : 쓰기
```

- shopping_cart 전역변수는 항상 최신값을 나타냅니다
- 필요할 때 새로운 값으로 교체합니다
- 교체하는 방법은 함수형 프로그래밍에서 일반적으로 사용하는 방법입니다
- 교체를 사용하면 되돌리기를 쉽게 구현할 수 있습니다
  - Part 2에서 교체를 사용해서 애플리케이션을 더 견고하게 만드는 방법에 대해 알아봅니다

## 불변 데이터 구조는 충분히 빠릅니다

- 일반적으로 불변 데이터구조는 변경 가능한 데이터 구조보다 메모리를 더 많이 쓰고 느립니다
- 하지만 불변 데이터 구조를 사용하면서 대용량의 고성능 시스템을 구현하는 사례는 많이 있습니다
  - 충분히 빠르다는 증거입니다

### 언제든 최적화할 수 있습니다

- 성능 개선을 할 때는 보통 미리 최적화하지 말라고 합니다
- 불변 데이터 구조를 사용하고 속도가 느린 부분이 있다면 그때 최적화하세요

### 가비지 콜렉터는 매우 빠릅니다

### 생각보다 많이 복사하지 않습니다

- 최상위 단계만 복사하는 것을 얕은 복사(shallow copy)라고 합니다
  - 구조적 공유(structural sharing)

### 함수형 프로그래밍 언어에는 빠른 구현체가 있습니다

- Clojure 같은 언어에서 지원하는 불변 데이터 구조

## 객체에 대한 카피-온-라이트

- 객체를 복사할 때는 Object.assign()을 사용합니다

```js
const new_object = Object.assign({}, object);
```

```js
// before
function setPrice(item, new_price) {
  item.price = new_price;
}

// after
function setPrice(item, new_price) {
  const new_item = Object.assign({}, item); // 빈객체 생성 후 그곳에 item을 할당 => 복사
  new_item.price = new_price;
  return new_item;
}
```

### 얕은 복사

- 중첩된 데이터 구조에 최상위 데이터만 복사합니다

### 구조적 공유

- 두 개의 중첩된 데이터 구조가 어떤 참조를 공유한다면 구조적 공유라고 합니다
- 구조적 공유는 메모리를 적게 사용하고, 모든 것을 복사하는 것보다 빠릅니다

## 자바스크립트 객체 훑어보기

- key로 value를 가져오는 방법

  - `object[key]`
  - `object.key`

- 키/값 쌍 지우기

  - `delete object[key]`
  - `delete object.key`

- 객체 복사하기

  - `Object.assign({}, object)`

- 키 목록 가져오기
  - `Object.keys(object)`
    - {key1: value1, key2: value2} => [key1, key2]

## 연습 문제

- 카피 온 라이트 연습

```js
// 1.
o["price"] = 37;

function objectSet(object, key, value) {
  //
}

// 2. 위 objectSet 함수를 사용해서 아래 함수를 리팩터링
function setPrice(item, new_price) {
  const new_item = Object.assign({}, item);
  new_item.price = new_price;
  return new_item;
}

// 3. objectSet() 함수를 이용해 제품 개수를 설정하는 setQuantity() 함수를 만들어보세요
function setQuantity(item, new_quantity) {
  //
}

// 4. 객체의 키로 키/값 쌍을 지우는 delete 연산을 카피-온-라이트 버전으로 만들어보세요
const a = { x: 1, y: 2 };
delete a["x"];
console.log(a); // {y: 2}

function objectDelete(object, key) {
  //
}
```

- [ ] 발표하면서 이 문제들 같이 풀어보기

## 중첩된 쓰기를 읽기로 바꾸기

- 순회하면서 쓰기를 읽기로 바꾸기
- 내 생각) lodash의 deepClone() 함수를 사용하면 중첩된 객체를 복사할 수 있습니다

## 요점 정리

- 함수형 프로그래밍에서 불변 데이터가 필요합니다
  - 계산에서는 변경 가능한 데이터에 쓰기를 할 수 없습니다
- 카피-온-라이트는 데이터를 불변형으로 유지할 수 있는 원칙입니다
  - 복사본을 만들고 원본 대신 복사본을 변경하는 것을 말합니다
- 카피-온-라이트는 값을 변경하기 전에 얕은 복사를 합니다
  - 그리고 리턴합니다
  - 이렇게 하면 통제 할 수 있는 범위에서 불변성을 구현할 수 있습니다
- 보일러 플레이트 코드(boilerplate code)를 줄이기 위해 기본적인 배열과 객체 동작에 대한 카피-온-라이트 버전을 만들어 두는 것이 좋습니다

## 다음장에서 배울 내용

- 카피-온-라이트 원칙은 좋습니다
- 하지만 모든 코드에 우리가 만든 카피-온-라이트를 사용할 수는 없습니다
- 기존에 많은 코드가 카피-온-라이트 원칙이 적용되지 않은 상태로 있습니다
- 그래서 `데이터를 변경하지 않고 데이터를 교체할 수 있는 방법`이 필요합니다
- 다음 장에서는 이러한 문제를 해결할 수 있도록 `방어적 복사(defensive copy)`라는 원칙에 대해 알아보겠습니다
