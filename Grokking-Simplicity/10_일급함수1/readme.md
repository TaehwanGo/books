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

## 이번 장 미리 보기

- 이 장에서는 코드의 냄새와 중복을 없애 추상화를 잘할 수 있는 리팩터링 두 개를 알아보겠습니다
  - 여기서 배운 기술은 이 장과 파트2에서 계속 사용할 것입니다
  - 아래는 짧게 정리한 내용입니다

### 코드의 냄새: 함수 이름에 있는 암묵적 인자

- 일급 값으로 바꾸면 표현력이 더 좋아집니다
- 특징
  - 거의 똑같이 구현된 함수가 있다
  - 함수 이름이 구현에 있는 다른 부분을 가리킨다

### 리팩터링: 암묵적 인자를 드러내기

- 암묵적 인자가 일급 값이 되도록 함수에 인자를 추가합니다

  - 잠재적 중복을 없애고 코드의 목적을 더 잘 표현할 수 있습니다

- 단계
  - 함수 이름에 있는 암묵적 인자를 확인합니다
  - 명시적인 인자를 추가합니다
  - 함수 본문에 하드 코딩된 값을 새로운 인자로 바꿉니다
  - 함수를 호출하는 곳을 고칩니다

### 리팩터링: 함수 본문을 콜백으로 바꾸기

- 함수 본문에 어떤 부분(비슷한 함수에 있는 서로 다른 부분)을 콜백으로 바꿉니다
- 이렇게 하면 일급 함수로 어떤 함수에 동작을 전달할 수 있습니다
- 이 방법은 원래 있던 코드를 고차 함수로 만드는 강력한 방법입니다

- 단계
  - 함수 본문에서 바꿀 부분의 앞부분과 뒷부분을 확인합니다
  - 리팩터링할 코드를 함수로 빼냅니다
  - 빼낸 함수의 인자로 넘길 부분을 또 다른 함수로 빼냅니다

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

- 코드의 냄새는 더 큰 문제를 가져올 수 있는 코드입니다

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

- 암묵적인 이름은 인자로 넘길 수 있는 값이 되었습니다

  - 값은 변수나 배열에 담을 수 있습니다
  - 그래서 일급(first-class)이라고 부릅니다
  - 일급 값은 언어 전체에 어디서나 쓸 수 있습니다

- 필드명을 문자열로 넘기는 것이 안전하지 않다고 느낄지도 모릅니다

  - 이 부분은 뒤에서 자세히 다루겠습니다

- 일급 값(first-class value) : 언어에 있는 다른 값처럼 쓸 수 있습니다

## 일급인 것과 일급이 아닌 것을 구별하기

### 자바스크립트에는 일급이 아닌 것과 일급인 것이 섞여 있습니다.

- 숫자로 할 수 있는 것
  - 함수에 인자로 넘길 수 있고
  - 함수의 리턴 값으로 받을 수 있습니다
  - 변수에 넣을 수 있고 배열이나 객체의 항목으로 넣을 수도 있습니다
- 문자열이나 불리언값, 배열, 객체도 비슷하게 할 수 있습니다

- 자바스크립트에 ㅣㅇ륵ㅂ 값이 아닌 것
  - 연산자(e.g. '+')
  - if나 while 같은 키워드
  - 대부분의 언어가 일급이 아닌 것을 가지고 있습니다
    - 중요한 것은 일급이 아닌 것을 일급으로 바꾸는 방법을 아는 것입니다

## 필드명을 문자열로 사용하면 버그가 생기지 않을까요?

- 문자열에 오타가 있으면 어떻게 될까?
- 이 문제를 해결할 수 있는 방법 두 가지

  - 컴파일 타임에 검사하는 것
  - 런타임에 검사하는 것

- 컴파일 타임에 검사

  - 정적 타입 시스템에서 사용하는 방법
  - 타입스크립트

- 런타임에 검사
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
- 추상화 벽 아래에서 정의한 필드명이 추상화 벽 위에 있는 사람들에게 전달되는 것은 추상화벽의 원칙을 위반하는 것이 아닐까요?
  - 또 API 문서에 필드명ㅇ르 명시하면 영원히 필드명을 바꾸지 못하는 것이 아닌가요?
    - => 맞습니다 필드명은 계속 유지해야 합니다
      - 하지만 구현이 외부에 노출된 것은 아닙니다
      - 만약 내부에서 정의한 필드명이 바뀐다고 해도 사용하는 사람들이 원래 필드명을 그대로 사용하게 할 수 있습니다
        - 내부에서 그냥 바꿔주면 됩니다
        - 예를 들어 quantity 필드명이 어떤 이유로 number로 바뀌었다고 생각해봅시다
        - 전체 코드를 바꾸지 않고 추상화 벽 위에서 quantity 필드명을 그대로 사용하고 싶다면 내부에서 간단히 필드명을 바꿔주면 됩니다

```js
// 내부에서 필드명 변경 예시
const validItemFields = ["price", "quantity", "shipping", "tax"];
const translations = { quantity: "number" };
function setFieldByName(cart, name, field, value) {
  if (!validItemFields.includes(field)) {
    // 런타임에 확인
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

- 이런 방법은 필드명이 일급이기 때문에 할 수 있는 것입니다
  - 필드명이 일급이라는 말은 객체나 배열에 담을 수 있다는 뜻입니다

## 객체와 배열을 너무 많이 쓰게 됩니다

- 장바구니와 제품처럼 일반적인 엔티티는 객체와 배열처럼 일반적인 데이터 구조를 사용해야 합니다
- 데이터 지향
  - 이벤트와 엔티티에 대한 사실을 표현하기 위해 일반 데이터 구조를 사용하는 프로그래밍

## 정적 타입 vs. 동적 타입

- 정적 타입
  - 컴파일 타임에 타입을 검사하는 것
- 동적 타입
  - 런타임에 타입을 검사하는 것
- 장단점이 있다

## 모두 문자열로 통신합니다

- JSON : 문자열
- API는 클라이언트에게 받은 데이터를 런타임에 체크해야 합니다

## 어떤 문법이든 일급함수로 바꿀 수 있습니다

- 일급으로 만들면 강력한 힘이 생깁니다

## TODO

- 252쪽 부터(고차함수 시작 부분)
