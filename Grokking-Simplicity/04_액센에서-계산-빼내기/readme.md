# 4. 액션에서 계산 빼내기

#### 이번 장에서 살펴볼 내용

- 어떻게 함수로 정보가 들어가고 나오는지 살펴봅니다
- 테스트하기 쉽고 재사용성이 좋은 코드를 만들기 위한 함수형 기술에 대해 알아봅니다
- 액션에서 계산을 빼내는 방법을 배웁니다

## MegaMart.com에 오신 것을 환영합니다

## 무료 배송비 계산하기

## 세금 계산하기

## 테스트하기 쉽게 만들기

### 테스트 개선을 위한 조지의 제안

테스트를 더 쉽게 하려면 다음 조건일 필요합니다

- DOM 업데이트와 비즈니스 규칙은 분리되어야 합니다
- 전역변수가 없어야 합니다

## 재사용하기 쉽게 만들기

### 개발팀 제나의 제안

재사용하려면 아래와 같은 조건이 필요합니다

- 전역변수에 의존하지 않아야 합니다
- DOM을 사용할 수 있는 곳에서 실행된다고 가정하면 안 됩니다
- 함수가 결괏값을 리턴해야 합니다

## 액션과 계산, 데이터를 구분하기

- 액션과 계산, 데이터를 구분하기

```js
var shopping_cart = []; // action : 이 전역변수는 변경 가능하기 때문에 액션
var shopping_cart_total = 0; // action

function add_to_cart(name, price) {
  // action
  shopping_cart.push({ name: name, price: price });
  calc_cart_total();
}

function update_shipping_icons() {
  // action
  var buy_buttons = get_buy_buttons_dom(); // DOM에서 읽는 것은 액션입니다
  for (var i = 0; i < buy_buttons.length; i++) {
    var button = buy_buttons[i];
    var item = button.item;
    if (item.price + shopping_cart_total >= 20) {
      button.show_free_shipping_icon();
    } else {
      button.hide_free_shipping_icon();
    }
  }
}

function update_tax_dom() {
  // action
  set_tax_dom(shopping_cart_total * 0.1); // DOM을 변경하는 것은 액션입니다
}

function calc_cart_total() {
  // action
  shopping_cart_total = 0; // 전역변수를 바꾸는 것은 액션입니다
  for (var i = 0; i < shopping_cart.length; i++) {
    var item = shopping_cart[i];
    shopping_cart_total += item.price;
  }
  set_cart_total_dom();
  update_shipping_icons();
  update_tax_dom();
}
```

## 함수에는 입력과 출력이 있습니다

- 입력은 함수가 계산을 하기 위한 외부 정보입니다
- 출력은 함수 밖으로 나오는 정보나 어떤 동작입니다

- 전역 변수를 바꾸는 것은 출력입니다

### 입력과 출력은 명시적이거거나 암묵적일 수 있습니다

- 인자는 명시적인 입력입니다
- 리턴 값은 명시적인 출력입니다
- 하지만 암묵적으로 함수로 들어가거나 나오는 정보도 있습니다
  - 전역변수를 읽는 것은 암묵적 입력입니다
  - 콘솔에 찍는 것은 암묵적 출력입니다
  - 전역변수를 바꾸는 것도 암묵적 출력입니다

### 함수에 암묵적 입력과 출력이 있으면 액션이 됩니다

- 함수에서 암묵적 입력과 출력을 없애면 계산이 됩니다

## 테스트와 재사용성은 입출력과 관련이 있습니다

### 조지1: DOM 업데이트와 비즈니스 규칙은 분리되어야 합니다

- DOM 업데이터 : 어떤 정보가 나오는 것이기 때문에 출력입니다
  - 하지만 리턴값이 아니기 때문에 암묵적 출력입니다
- 사용자가 정보를 볼 수 있어야 하기 때문에 DOM 업데이트는 어디선가 해야합니다
  - 조지는 암묵적인 출력인 DOM 업데이트와 비즈니스 규칙을 분리하자고 제안합니다

### 조지2: 전역변수가 없어야 합니다

- 전역변수를 읽는 것은 암묵적 입력이고 바꾸는 것은 암묵적 출력입니다
- 조지는 결국 암묵적 입력과 암묵적 출력을 없애야 한다고 제안한 것입니다
- 압묵적 입력은 함수에 인자로 넣고 암묵적 출력은 리턴값으로 바꾸면 됩니다

### 제나1: 전역변수에 의존하지 않아야 합니다

- 조지의 두 번째 제안과 같은 내용
  - 암묵적 입력과 암묵적 출력을 없애자

### 제나2: DOM을 사용할 수 있는 곳에서 실행된다고 가정하면 안 됩니다

- DOM을 사용하는 것은 암묵적 출력입니다
- 암묵적 출력은 리턴값으로 바꿀 수 있습니다

### 제나3: 함수가 결괏값을 리턴해야 합니다

- 제나는 암묵적 출력 대신 명시적 출력을 사용하자고 제안하고 있습니다

## 액션에서 계산 빼내기 - p. 70

```js
// 원래 코드
function calc_cart_total() {
  shopping_cart_total = 0;
  for (var i = 0; i < shopping_cart.length; i++) {
    var item = shopping_cart[i];
    shopping_cart_total += item.price;
  }
  set_cart_total_dom();
  update_shipping_icons();
  update_tax_dom();
}
```

```js
// 바꾼 코드 : 리팩터링 단계 1 - 서브루틴 추출하기 : 함수로 빼내기
function calc_cart_total() {
  calc_total(); // 새로 만든 함수를 호출
  set_cart_total_dom();
  update_shipping_icons();
  update_tax_dom();
}

function calc_total() {
  // 새로 만든 함수
  shopping_cart_total = 0; // 전역변수 사용 중
  for (var i = 0; i < shopping_cart.length; i++) {
    var item = shopping_cart[i];
    shopping_cart_total += item.price;
  }
}
```

```js
// 바꾼 코드 : 리팩터링 단계 2 - 암묵적 입력과 출력을 명시적으로 바꾸기
function calc_cart_total() {
  shopping_cart_total = calc_total(shopping_cart);
  set_cart_total_dom();
  update_shipping_icons();
  update_tax_dom();
}

function calc_total(cart) {
  var total = 0; // 지역변수로 변경
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    total += item.price;
  }
  return total; // 지역변수를 리턴
}
```

- 조지와 제나의 모든 고민은 해결되었습니다
  - 테스트를 담당하고 있는 조지
    - DOM 업데이트와 비즈니스 규칙은 분리되어야 합니다
    - 전역변수가 없어야 합니다
  - 개발팀 제나
    - 전역변수에 의존하지 않아야 합니다
    - DOM을 사용할 수 있는 곳에서 실행된다고 가정하면 안 됩니다
    - 함수가 결괏값을 리턴해야 합니다

## 액션에서 또 다른 계산 빼내기

- 앞에서 한 것처럼 장바구니를 바꾸는 코드에도 적용해봅시다

```js
// 원래 코드
function add_item_cart(name, price) {
  shopping_cart.push({
    name,
    price,
  });

  calc_cart_total();
}
```

```js
// 바꾼 코드 : 단계 1. 함수 추출하기 리팩터링
function add_item_cart(name, price) {
  addItem(name, price);
  calc_cart_total();
}

function add_item(name, price) {
  shopping_cart.push({
    name,
    price,
  });
}
```

```js
// 바꾼 코드 : 단계 2. 암묵적 입력과 출력을 명시적으로 바꾸기 리팩터링
function add_item_cart(name, price) {
  // 원래 함수에선 맅턴 값을 받아 전역변수에 할당합니다
  shopping_cart = addItem(shopping_cart, name, price);
  calc_cart_total();
}

// 전역변수 대신 인자를 사용하도록 합니다
function add_item(cart, name, price) {
  // 복사본을 변경하고 복사본을 리턴합니다
  const newCart = cart.slice(); // 복사하는 이유 : 6장
  newCart.push({
    name,
    price,
  });
  return newCart;
}
```

## 계산 추출을 단계별로 알아보기

- 액션에서 계산을 빼내는 작업은 반복적인 과정입니다

1. 계산 코드를 찾아 빼냅니다
2. 새 함수에 암묵적 입력과 출력을 찾습니다
3. 암묵적 입력은 인자로, 암묵적 출력은 리턴값으로 바꿉니다

## 요점 정리

- 액션은 암묵적인 입력 또는 출력을 가지고 있습니다
- 계산의 정의에 따르면 계산은 암묵적인 입력이나 출력이 없어야 합니다
- 공유 변수(`전역변수` 같은)는 일반적으로 암묵적 입력 또는 출력이 됩니다
- 암묵적 입력은 인자로 바꿀 수 있습니다
- 암묵적 출력은 리턴값으로 바꿀 수 있습니다
- 함수형 원칙을 적용하면 액션을 줄어들고 계산은 늘어난다는 것을 확인했습니다

## 다음 장에서 배울 내용

- 액션을 없앨 수 없는 상황에서 코드를 개선하려면 어떻게 해야 할까요?
