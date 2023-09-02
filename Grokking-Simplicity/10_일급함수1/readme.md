# Part 2. First class abstractions

- 일급 값(first-class value)에 대한 개념을 배워봅시다
  - 일급 함수(first-class function)를 중심으로 알아보겠습니다
- 일급 값에 대한 개념을 배우고 나면
  - 함수적으로 반복하는 방법에 대해 배울 수 있습니다
  - 동작을 연결해 복잡한 계산을 만들 수 있습니다
  - 중첩된 데이터를 다루는 방법도 알 수 있습니다
- 시간 차이 때문에 생기는 버그를 없애기 위해 액션의 순서와 반복을 다루는 방법도 배울 것입니다
- 서비스를 구성하기 위한 두 가지 아키텍처에 대해 알아보겠습니다

# 10. 일급 함수1

#### 이번 장에서 살펴볼 내용

- 왜 일급 값이 좋은지 알아봅니다
- 문법을 일급 함수로 만드는 방법에 대해 알아봅니다
- 고차 함수로 문법을 감싸는 방법을 알아봅니다
- 일급 함수와 고차 함수를 사용한 리팩터링 두 개를 살펴봅니다
  - 리팩터링 두 개
    - 암묵적 인자를 드러내기
    - 본문을 콜백으로 바꾸기

## 이번 장 미리 보기

- 이 장에서는 코드의 냄새와 중복을 없애 추상화를 잘할 수 있는 리팩터링 두 개를 알아보겠습니다
  - 여기서 배운 기술은 이 장과 파트2에서 계속 사용할 것입니다
  - 아래는 짧게 정리한 내용입니다

### 코드의 냄새: 함수 이름에 있는 암묵적 인자

- 코드의 냄새(code smell)은 더 큰 문제를 가져올 수 있는 코드입니다
- 일급 값으로 바꾸면 표현력이 더 좋아집니다
- 특징
  - 1. 거의 똑같이 구현된 함수가 있다
  - 2. 함수 이름이 구현에 있는 다른 부분을 가리킨다

### 리팩터링: 암묵적 인자를 드러내기

- 암묵적 인자가 일급 값이 되도록 함수에 인자를 추가합니다

  - 잠재적 중복을 없애고 코드의 목적을 더 잘 표현할 수 있습니다

- 단계
  - 1. 함수 이름에 있는 암묵적 인자를 확인합니다
  - 2. 명시적인 인자를 추가합니다
  - 3. 함수 본문에 하드 코딩된 값을 새로운 인자로 바꿉니다
  - 4. 함수를 호출하는 곳을 고칩니다

### 리팩터링: 함수 본문을 콜백으로 바꾸기

- 함수 본문에 어떤 부분(비슷한 함수에 있는 서로 다른 부분)을 콜백으로 바꿉니다
- 이렇게 하면 일급 함수로 어떤 함수에 동작을 전달할 수 있습니다
- 이 방법은 원래 있던 코드를 고차 함수로 만드는 강력한 방법입니다

- 단계
  - 1. 함수 본문에서 바꿀 부분의 앞부분과 뒷부분을 확인합니다
  - 2. 리팩터링할 코드를 함수로 빼냅니다
  - 3. 빼낸 함수의 인자로 넘길 부분을 또 다른 함수로 빼냅니다

## 마케팅팀은 여전히 개발팀과 협의해야 합니다

- 추상화 벽은 마케팅팀이 사용하기 좋은 API였습니다
- 하지만 예상만큼 잘 안 되었습니다
  - 대부분 개발팀과 협의 없이 일할 수 있었지만,
  - 주어진 API로는 할 수 없는 일이 있어서 새로운 API를 개발팀에 요청해야 합니다
  - 아래는 새로운 요구사항입니다

### 검색 결과: 마케팅팀에서 개발팀에 요청한 새로운 기능

- 요구사항: 장바구니에 있는 제품 값을 설정하는 기능
- 요구사항: 장바구니에 있는 제품 개수를 설정하는 기능
- 요구사항: 장바구니에 있는 제품에 배송을 설정하는 기능
- 모든 요구사항이 설정하는 필드만 다르고 비슷합니다

## 코드의 냄새

```js
// 이전 코드
// 함수 이름에 문자열이 그대로 들어있습니다
function setPriceByName(cart, name, price) {
  const item = cart[name];
  const newItem = objectSet(item, "price", price); // 'price'만 다른 비슷한 함수들이 있습니다
  const newCart = objectSet(cart, name, newItem);
  return newCart;
}
```

### 냄새를 맡는 법

- 함수 이름에 있는 암묵적 인자(implicit argument in function name) 냄새는 두 가지 특징을 보입니다
  - 1. 함수 구현이 거의 똑같습니다
  - 2. 함수 이름이 구현의 차이를 만듭니다
- 함수 이름에서 서로 다른 부분이 암묵적 인자입니다

## 리팩터링: 암묵적 인자를 드러내기

1. 함수이름에 있는 암묵적 인자를 확인합니다
2. 명시적인 인자를 추가합니다
3. 함수 본문에 하드 코딩된 값을 새로운 인자로 바꿉니다
4. 함수를 부르는 곳을 고칩니다

```js
// 리팩터링 전
function setPriceByName(cart, name, price) {
  const item = cart[name];
  const newItem = objectSet(item, "price", price); // 'price'만 다른 비슷한 함수들이 있습니다
  const newCart = objectSet(cart, name, newItem);
  return newCart;
}

// 리팩터링 후
function setFieldByName(cart, name, field, value) {
  const item = cart[name];
  const newItem = objectSet(item, field, value);
  const newCart = objectSet(cart, name, newItem);
  return newCart;
}
```

- 리팩터링으로 비슷한 함수를 모두 일반적인 함수 하나로 바꿨습니다
- 이제 일반적인 setFieldByName() 함수가 있기 때문에 많은 함수가 없어도 됩니다

- `암묵적인 이름`은 인자로 넘길 수 있는 `값이 되었습니다`

  - 값은 변수나 배열에 담을 수 있습니다
  - 그래서 일급(first-class)이라고 부릅니다
  - 일급 값은 언어 전체에 어디서나 쓸 수 있습니다

- 필드명을 문자열로 넘기는 것이 안전하지 않다고 느낄지도 모릅니다

  - 이 부분은 뒤에서 자세히 다루겠습니다

- 일급 값(first-class value) : 언어에 있는 다른 `값처럼 쓸 수 있습니다`

## 일급인 것과 일급이 아닌 것을 구별하기

### 자바스크립트에는 일급이 아닌 것과 일급인 것이 섞여 있습니다.

- 숫자로 할 수 있는 것
  - 함수에 인자로 넘길 수 있고
  - 함수의 리턴 값으로 받을 수 있습니다
  - 변수에 넣을 수 있고 배열이나 객체의 항목으로 넣을 수도 있습니다
- 문자열이나 불리언값, 배열, 객체도 비슷하게 할 수 있습니다

- 자바스크립트에 일급 값이 아닌 것
  - 연산자(e.g. '+')
  - if나 while 같은 키워드
  - 대부분의 언어가 일급이 아닌 것을 가지고 있습니다
    - 중요한 것은 일급이 아닌 것을 일급으로 바꾸는 방법을 아는 것입니다

## 필드명을 문자열로 사용하면 버그가 생기지 않을까요?

- 문자열에 오타가 있으면 어떻게 될까?
- 이 문제를 해결할 수 있는 방법 두 가지

  - 컴파일 타임에 검사하는 것
  - 런타임에 검사하는 것

- `컴파일 타임에 검사`

  - 정적 타입 시스템에서 사용하는 방법
  - `타입스크립트`

- `런타임에 검사`
  - 접근 가능한 필드를 추가하고 검사

```js
const validItemFields = ["price", "quantity", "shipping", "tax"];
function setFieldByName(cart, name, field, value) {
  if (!validItemFields.includes(field)) {
    // 런타임에 확인
    throw new Error(`${field} is not a valid field!`);
  }
  const item = cart[name];
  const newItem = objectSet(item, field, value);
  const newCart = objectSet(cart, name, newItem);
  return newCart;
}

function objectSet(object, key, value) {
  const copy = { ...object };
  copy[key] = value;
  return copy;
}
```

## 일급 필드를 사용하면 API를 바꾸기 더 어렵나요?

- 엔티티(entity) 필드명을 일급으로 만들어 사용하는 것이 세부 구현을 밖으로 노출하는 것이 아닌지 걱정하고 있습니다
- 장바구니와 제품은 어떤 필드명과 함께 추상화 벽 아래에서 정의한 객체입니다
- 추상화 벽 아래에서 정의한 필드명이 `추상화 벽 위에 있는 사람들에게 전달`되는 것은 `추상화벽의 원칙을 위반하는 것이 아닐까요?`
  - 또 API 문서에 필드명을 명시하면 영원히 필드명을 바꾸지 못하는 것이 아닌가요?
    - => 맞습니다 필드명은 계속 유지해야 합니다
      - 하지만 구현이 외부에 노출된 것은 아닙니다
      - 만약 내부에서 정의한 필드명이 바뀐다고 해도 사용하는 사람들이 원래 필드명을 그대로 사용하게 할 수 있습니다
        - `내부에서 그냥 바꿔주면 됩니다`
        - 예를 들어 quantity 필드명이 어떤 이유로 number로 바뀌었다고 생각해봅시다
        - 전체 코드를 바꾸지 않고 추상화 벽 위에서 quantity 필드명을 그대로 사용하고 싶다면 내부에서 간단히 필드명을 바꿔주면 됩니다

```js
// 내부에서 필드명 변경 예시
const validItemFields = ["price", "quantity", "shipping", "tax"];
const translations = { quantity: "number" }; // 내부에서 필드명 맵을 만들어서 필드명을 바꿔줍니다
function setFieldByName(cart, name, field, value) {
  if (!validItemFields.includes(field)) {
    throw new Error(`${field} is not a valid field!`);
  }
  if (translations[field]) {
    field = translations[field]; // 원래 필드명을 새로운 필드명으로 단순히 바꿔줍니다
  }
  const item = cart[name];
  const newItem = objectSet(item, field, value);
  const newCart = objectSet(cart, name, newItem);
  return newCart;
}
```

- 이런 방법은 `필드명이 일급`이기 때문에 할 수 있는 것입니다
  - 필드명이 `일급`이라는 말은 `객체나 배열에 담을 수 있다`는 뜻입니다

## 연습문제1

- 함수 이름에 있는 암묵적 인자를 드러내기 리팩터링으로 중복을 없애봅시다

```js
// before
function multiplyByFour(x) {
  return x * 4;
}

// after
function multiply(x, y) {
  return x * y;
}
```

## 연습문제2

```js
// before
function incrementQuantityByName(cart, name) {
  const item = cart[name];
  const quantity = item["quantity"];
  const newQuantity = quantity + 1;
  const newItem = objectSet(item, "quantity", newQuantity);
  const newCart = objectSet(cart, name, newItem);
  return newCart;
}

// after
function incrementFieldByName(cart, name, field) {
  const item = cart[name];
  const value = item[field];
  const newValue = value + 1;
  const newItem = objectSet(item, field, newValue);
  const newCart = objectSet(cart, name, newItem);
  return newCart;
}
```

## 연습문제3

- 지원하지 않는 필드가 들어왔을 때 에러를 던지는 함수를 만들어봅시다
  - price나 name같은 필드는 이 함수를 사용해서 값을 늘릴 수 없습니다 !

```js
function setFieldByName(cart, name, field, value) {
  if (field !== "size" || field !== "quantity") {
    throw new Error(`This ${field} cannot be incremented!`);
  }
  const item = cart[name];
  const newItem = objectSet(item, field, value);
  const newCart = objectSet(cart, name, newItem);
  return newCart;
}
```

## 객체와 배열을 너무 많이 쓰게 됩니다

- 장바구니와 제품처럼 일반적인 엔티티는 객체와 배열처럼 일반적인 데이터 구조를 사용해야 합니다
- 데이터 지향
  - 이벤트와 엔티티에 대한 사실을 표현하기 위해 `일반 데이터 구조를 사용`하는 프로그래밍
  - 이 책에서 이 원칙을 계속 사용할 것입니다

## 정적 타입 vs. 동적 타입

- 정적 타입
  - 컴파일 타임에 타입을 검사하는 것
- 동적 타입
  - 런타임에 타입을 검사하는 것
- 장단점이 있다
  - 여러분과 여러분의 팀이 선택한 언어가 편하다면 걱정말고 계속 사용하시면 됩니다

## 모두 문자열로 통신합니다

- JSON : 문자열
- SQL : 문자열
  - 웹 서버는 명령어를 데이터베이스로 전달하기 위해 문자열로 직렬화해야 합니다
- API는 클라이언트에게 받은 데이터를 런타임에 체크해야 합니다
  - 오타나 악의적인 의도로 잘못된 문자열을 넣을 수 있는 가능성은 많이 있습니다
- 데이터의 단점
  - 항상 해석이 필요하다

## 어떤 문법이든 일급함수로 바꿀 수 있습니다

```js
// 일급이 아닌 + 연산자를 일급 함수로 바꾸기
function plus(x, y) {
  return x + y;
}
```

- 일급으로 만들면 강력한 힘이 생깁니다

## 반복문 예제: 먹고 치우기

### 반복문을 안쓰게 할 수 있을까?

- 반복문을 일급으로 만들어보자
- 일급함수를 인자로 받는 함수를 만든다 == 고차 함수
- `일급(first-class)`은 `인자로 전달할 수 있다`는 뜻입니다
- `고차함수(higher-order)`라는 말은 `함수가 다른 함수를 인자로 받을 수 있다`는 말입니다
  - 일급 함수가 없다면 고차 함수를 만들 수 없습니다
- 고차 함수(higher-order function)
  - 인자로 함수를 받거나 리턴 값으로 함수를 리턴할 수 있는 함수
- 본문을 콜백으로 바꾸기(replace body with callback)이라는 리팩터링을 해보자

### 반복문을 콜백으로 바꾸기

```js
// 기존 코드
function cookAndEatFoods() {
  for (let i = 0; i < foods.length; i++) {
    const food = foods[i];
    cook(food);
    eat(food);
  }
}
function cleanDishes() {
  for (let i = 0; i < dishes.length; i++) {
    const dish = dishes[i];
    wash(dish);
    dry(dish);
    putAway(dish);
  }
}

// 기존 코드 실행
cookAndEatFoods();
cleanDishes();
```

```js
/**
 * 리팩터링
 * - 인자 이름을 둘 다 item 으로 변경
 * - 함수 이름을 일반적인 이름으로 변경
 * - 배열을 인자로 받음
 * - 실행할 함수를 인자로 받음
 */
function operateOnArray(array, f) {
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    f(item);
  }
}

function cookAndEat(food) {
  cook(food);
  eat(food);
}

function clean(dish) {
  wash(dish);
  dry(dish);
  putAway(dish);
}

// 리팩터링된 코드 실행
operateOnArray(foods, cookAndEat);
operateOnArray(dishes, clean);

// 자바스크립트에서는 이런 함수를 foreEach()라고 하므로 함수 이름도 바꿔봅시다
// operateOnArray() -> forEach()
function forEach(array, f) {
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    f(item);
  }
}

forEach(foods, cookAndEat);
forEach(dishes, clean);
```

- 리팩터링 단계

  - 1. 함수 이름에 있는 암묵적 인자를 확인합니다
  - 2. 명시적인 인자를 추가합니다
  - 3. 함수 본문에 하드 코딩된 값을 새로운 인자로 바꿉니다
  - 4. 함수를 호출하는 곳을 고칩니다

#### forEach

- forEach() 함수는 배열과 함수를 인자로 받습니다
- 함수를 인자로 받으므로 고차함수입니다
  - 고차함수 : 인자로 함수를 받거나 리턴 값으로 함수를 리턴할 수 있습니다

#### 위 예제 리팩터링 단계 정리

- 코드를 함수로 감싸기
- 더 일반적인 이름으로 바꾸기
- 암묵적 인자를 드러내기
- 함수 추출하기
- 암묵적 인자를 드러내기

## 리팩터링: 함수 본문을 콜백으로 바꾸기

- 이슈
  - try-catch로 감싸서 에러 로깅 시스템으로 에러를 보내야한다
  - try-catch + 에러 로깅에 대한 중복된 코드가 많다

```js
// 원래 코드
try {
  // 앞부분
  saveUserData(user); // 본문
} catch (error) {
  logToSnapErrors(error); // 뒷부분
}

try {
  // 앞부분
  fetchProduct(productId); // 본문
} catch (error) {
  logToSnapErrors(error); // 뒷부분
}
```

- 앞부분과 뒷부분은 재사용하면서 본문을 바꿀 방법이 필요합니다

1. 본문과 본문의 앞부분과 뒷부분을 구분합니다 // 이미 구분되어 있습니다
2. 전체를 함수로 빼냅니다
3. 본문 부분을 빼낸 함수의 인자로 전달한 함수로 바꿉니다

```js
// 함수로 빼내고 콜백으로 빼낸 코드
function withLogging(f) {
  try {
    f();
  } catch (error) {
    logToSnapErrors(error);
  }
}
// 실행 예시
withLogging(() => saveUserData(user)); // 본문을 인라인 함수로 전달
```

- 왜 본문을 함수로 감싸서 넘기나요? 이것은 무슨 문법이죠?

## 이것은 무슨 문법인가요?

- 함수를 정의하고 전달하는 일반적인 방법
  - 1. 전역으로 정의하기
    - 일반적인 함수 선언
  - 2. 지역적으로 정의하기
    - 함수 안에 함수를 선언 해당 함수 안에서만 사용
  - 3. 인라인으로 정의하기
    - 익명 함수를 사용(1회성)

## 왜 본문을 함수로 감싸서 넘기나요?

- 함수로 감싼 이유는 코드가 바로 실행되면 안되기 때문
  - 마치 얼음 속에 있는 생선 처럼 '보관' 되어있다고 생각할 수 있습니다
- 이 방법은 함수의 실행을 미루는 일반적인 방법입니다
- 함수는 일급이기 때문에 함수를 정의할 수 있는 방법은 여러 가지가 있습니다
  - 변수에 저장해서
  - 이배열이나 객체 같은 자료구조에 보관
  - 그냥 그대로 전달

```js
// 이름 붙이기(함수를 변수에 저장)
const saveUserDataWithLogging = () => saveUserData(user);

// 컬렉션에 저장
array.push(() => saveUserData(user));

// 그냥 전달
withLogging(() => saveUserData(user));
```

- 함수 안에 담아 실행이 미뤄진 함수는
  - 선택적으로 호출될 수 있고
  - 나중에 호출될 수도 있습니다
  - 또는 어떤 문맥 안에서 실행할 수도 있습니다

```js
// 선택적으로 호출하기
function callOnThursday(f) {
  if (today === "Thursday") f();
}

// 나중에 호출하기
setTimeout(() => saveUserData(user), 1000);

// 어떤 문맥 안에서 실행하기
function withLogging(f) {
  try {
    f();
  } catch (error) {
    logToSnapErrors(error);
  }
}
```

## 쉬는 시간

### Q1. 본문을 콜백으로 바꾸기 리팩터링은 중복을 없애는 데 좋은 것 같습니다

- 그런데 중복을 없애는 것이 전부인가요?

- A1. 어떤 의미에선 그렇습니다
  - 본문을 콜백으로 바꾸기 리팩터링은 중복을 없애는 것에 관한 리팩터링입니다
  - 고차 함수를 사용하지 않아도 중복을 없앨 수 있습니다
  - 중복된 본문을 고차 함수 대신 함수 이름으로 실행하면 됩니다
    - 이렇게 하면 고차함수를 사용하는 것과 같지만 일반 데이터가 아니고 함수를 실행해야 한다는 점이 다릅니다

### Q2. 왜 함수에 일반 데이터값으로 전달하지 않고 함수를 전달하나요?

- A2. 앞에서 본 try/catch 예제에서 함수 대신 '일반적'인 데이터를 인자로 전달했다고 가정해봅시다

```js
// try/catch 예제에서 함수 대신 '일반적'인 데이터를 인자로 전달했다고 가정
function withLogging(data) {
  try {
    data;
  } catch (error) {
    logToSnapErrors(error);
  }
}

// 실행 예시
withLogging(saveUserData(user));
```

- saveUserData(user)는 try/catch가 처리해줄까요?
  - 아닙니다 withLogging() 함수를 부르기 전에 예외가 발생하고 에러를 던집니다
  - 이 경우 try/catch는 아무런 도움이 되지 않습니다
- `함수로 전달하는 이유`는 함수 안에 있는 `코드가 특정 문맥 안에서 실행`돼야 하기 때문입니다

## 결론

- 이 장에서 `일급 값(first-class value)`과 `일급 함수(first-class function)`, `고차 함수(high-order function)`에 대해 배웠습니다
- 다음 장에서 이 개념의 숨은 힘에 대해 알아보겠습니다
- Part2는 함수형 프로그래밍의 새로운 힘에 대한 내용을 다룹니다

## 요점 정리

- 일급 값은 변수에 저장할 수 있고 인자로 전달하거나 함수의 리턴값으로 사용할 수 있습니다
  - 일급 값은 코드로 다룰 수 있는 값입니다
- 언어에는 일급이 아닌 기능이 많이 있습니다. 일급이 아닌 기능은 함수로 감싸 일급으로 만들 수 있습니다
- 어떤 언어는 함수를 일급 값처럼 쓸 수 있는 일급 함수가 있습니다
  - 일급 함수는 어떤 단계 이상의 함수형 프로그래밍을 하는 데 필요합니다
- 고차 함수는 다른 함수에 인자로 넘기거나 리턴 값으로 받을 수 있는 함수입니다
  - 고차 함수로 다양한 동작을 추상화할 수 있습니다
- 함수 이름에 있는 암묵적 인자는 함수의 이름으로 구분하는 코드의 냄새입니다
  - 이 냄새는 코드로 다룰 수 없는 함수 이름 대신 일급 값인 인자로 바꾸는 암묵적 인자를 드러내기 리팩터링을 적용해서 없앨 수 있습니다
- 동작을 추상화하기 위해 본문을 콜백으로 바꾸기 리팩터링을 사용할 수 있습니다
  - 서로 다른 함수의 동작 차이를 일급 함수 인자로 만듭니다

## 다음 장에서 배울 내용

- 계산과 액션에서 고차함수가 얼마나 도움이 되는지 살펴봅니다
