# 5. 더 좋은 액션 만들기

#### 이번 장에서 살펴볼 내용

- `암묵적 입력과 출력을 제거`해서 `재사용하기 좋은 코드`를 만드는 방법을 알아봅니다
- 복잡하게 엉킨 코드를 풀어 더 좋은 구조로 만드는 법을 배웁니다

## 비즈니스 요구 사항과 설계를 맞추기

### 요구 사항에 맞춰 더 나은 추상화 단계 선택하기

- 요구 사항 : 합계 금액과 제품 가격에 대한 무료 배송여부가 아니고
  - 주문 결과가 무료 배송인지 확인해야 합니다

```js
/* before */
function gets_free_shipping(total, item_price) {
  // total, item_price 인자는 요구사항과 맞지 않습니다
  return total + item_price >= 20;
}

function calc_total(cart) {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].price; // get_free_shipping에 합계를 계산하는 코드가 중복되어 있습니다
  }
  return total;
}
```

```js
/* after */
function gets_free_shipping(cart) {
  return calc_total(cart) >= 20;
}

function calc_total(cart) {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].price;
  }
  return total;
}
```

## 비즈니스 요구 사항과 함수를 맞추기

- 함수의 동작을 바꿨기 때문에 엄밀히 말하면 리팩터링이라고 할 수 없습니다
- 함수 시그니처가 바뀌었기 때문에 사용하는 부분도 고쳐야 합니다

```js
// 원래 코드
function update_shipping_icons() {
  const buttons = get_buy_buttons_dom();
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    const item = button.item;
    if (gets_free_shipping(shopping_cart_total, item.price)) {
      button.show_free_shipping_icon();
    } else {
      button.hide_free_shipping_icon();
    }
  }
}
```

```js
// 새 시그니처를 적용한 코드
function update_shipping_icons() {
  const buttons = get_buy_buttons_dom();
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    const item = button.item;
    const new_cart = add_item(shopping_cart, item.name, item.price); // 복사본을 사용할 때 얻는 것이 더 많이 있습니다 -> 6장, 7장
    if (gets_free_shipping(new_cart)) {
      button.show_free_shipping_icon();
    } else {
      button.hide_free_shipping_icon();
    }
  }
}
```

## 원칙 : 암묵적 입력과 출력은 적을수록 좋습니다

- 암묵적 입력과 출력이 있는 함수는 아무나 때나 실행할 수 없기 때문에 테스트하기 어렵습니다
- 계산은 암묵적 입력과 출력이 없기 때문에 테스트하기 쉽습니다

## 암묵적 입력과 출력 줄이기

- 전역변수를 파라미터로 받아서 하위 함수로 드릴링하는 방법을 사용

## 코드 다시 살펴보기

```js
// 원래 코드
function add_item_to_cart(name, price) {
  shopping_cart = add_item(shopping_cart, name, price);
  calc_cart_total(shopping_cart);
}

function calc_cart_total(cart) {
  const total = calc_total(cart);
  set_cart_total_dom(total);
  update_shipping_icons(cart);
  update_tax_dom(total);
  shopping_cart_total = total;
}

// 개선한 코드
function add_item_to_cart(name, price) {
  shopping_cart = add_item(shopping_cart, name, price);

  const total = calc_total(shopping_cart);
  set_cart_total_dom(total);
  update_shipping_icons(shopping_cart);
  update_tax_dom(total);
}
```

- 함수형 원칙을 더 적용할 수 있는 부분이 있는지 살펴보는 것도 중요하지만
- 중복이나 불필요한 코드가 있는지도 살펴봐야 합니다
- 과해보이는 함수는 없는지 살펴보고 과한 코드는 합쳐도 됩니다

## 계산 분류하기

- 의미 있는 계층에 대해 알아보기 위해 계산을 분류해봅시다
- `계층`은 `엉켜있는 코드를 풀면` 자연스럽게 `만들어집니다`
- 다음 원칙인 엉켜있는 코드를 푸는 것에 대해 알아봅시다

## 원칙: 설계는 엉켜있는 코드를 푸는 것이다

- 분리된 것은 언제든 쉽게 조합할 수 있습니다

### 재사용하기 쉽다

- 함수는 작을수록 재사용하기 쉽습니다
- 하는 일도 적고 쓸 때 가정을 많이 하지 않아도 됩니다

### 유지보수하기 쉽다

- 작은 함수는 쉽게 이해할 수 있고 유지보수하기 쉽습니다
- 코드가 작기 때문에 올바른지 아닌지 명확하게 알 수 있습니다

### 테스트하기 쉽다

- 작은 함수는 테스트하기 좋습니다
- 한 가지 일만 하기 때문에 한 가지만 테스트하면 됩니다
- 함수에 특별한 문제가 없어도 꺼낼 것이 있다면 분리하는 것이 좋습니다
  - 그렇게 하면 더 좋은 설계가 됩니다

### 설계 ~ 실타래(p. 98)

- 설계가 없는 경우 : 실타래가 엉켜 있는 경우
- 분리된 경우 : 실타래를 풀어 놓은 경우
- 조합된 경우 : 문제를 풀기 위해 조합할 수 있습니다

## add_item()을 분리해 더 좋은 설계 만들기

- add_item() 함수는 장바구니에 제품을 추가하는 간단한 일만 하는 것 같습니다
  - 정말 그럴까요?
  - add_item() 함수도 네 부분으로 나눌 수 있습니다

```js
// 원래 코드
function add_item(cart, name, price) {
  const new_cart = cart.slice(); // 1. 배열을 복사합니다
  new_cart.push({ name, price }); // 2. item 객체를 만듭니다. 3. 복사본에 item을 추가합니다
  return new_cart; // 4. 복사본을 리턴합니다
}
```

```js
// 분리한 코드
function make_cart_item(name, price) {
  return {
    // 2. item 객체를 만듭니다
    name,
    price,
  };
}

function add_item(cart, item) {
  const new_cart = cart.slice(); // 1. 배열을 복사합니다
  new_cart.push(item); // 3. 복사본에 item을 추가합니다
  return new_cart; // 4. 복사본을 리턴합니다
}

add_item(shopping_cart, make_cart_item("shoes", 3.45));
```

- item 구조만 알고 있는 함수(make_cart_item)와 cart 구조만 알고 있는 함수(add_item)로 분리했습니다
- 이렇게 분리하면 cart와 item을 독립적으로 확장할 수 있습니다
- 예를 들어, 배열인 cart를 해시 맵 같은 자료구조로 바꾼다고 할 때 변경해야 할 부분이 적습니다
- `1.`, `3.`, `4.`는 값으르 바꿀 때 복사하는 `카피-온-라이트(copy-on-write)`를 구현한 부분이기 때문에 함께 두는 것이 좋습니다
  - 이 부분은 6장에서 자세히 다룹니다

## 카피-온-라이트 패턴을 빼내기

- add_item() 함수는 자세히 보면 카피-온-라이트를 사용해 배열에 항목을 추가하는 함수 입니다
- 이 함수는 배열과 항목에 쓸 수 있지만 이름은 일반적이지 않습니다
- 이름만 보면 장바구니를 넘겨야 쓸 수 있을 것 같습니다
- 함수 이름과 인자 이름을 더 일반적인 이름으로 바꿔봅시다

```js
// 원래 코드(일반적이지 않은 이름: cart)
function add_item(cart, item) {
  const new_cart = cart.slice();
  new_cart.push(item);
  return new_cart;
}
```

```js
// 일반적인 이름으로 바꾼 코드 - 어떤 곳에서도 적용할 수 있습니다
function add_element_last(array, elem) {
  const new_array = array.slice();
  new_array.push(elem);
  return new_array;
}

// 원래 add_item() 함수는 간단하게 다시 만들 수 있습니다
function add_item(cart, item) {
  return add_element_last(cart, item);
}
```

- 장바구니와 제품에만 쓸 수 있는 함수가 아닌 어떤 배열이나 항목에도 쓸 수 있는 이름으로 바꿨습니다
- 이 함수는 `재사용할 수 있는 유틸리티 함수`입니다
- 변경 불가능한 배열이 필요할 수도 있습니다 -> 6장, 7장에서 살펴보겠습니다

## 계산을 분류하기

- 계산이라도 분류를 할 수 있다
- C : cart에 대한 동작 표시
- I : item에 대한 동작 표시
- B : 비즈니스 규칙
- A : 배열 유틸리티

```js
function add_element_last(array, elem) {
  // A : 배열 유틸리티
  const new_array = array.slice();
  new_array.push(elem);
  return new_array;
}

function add_item(cart, item) {
  // C : cart에 대한 동작 표시
  return add_element_last(cart, item);
}

function make_cart_item(name, price) {
  // I : item에 대한 동작 표시
  return {
    name,
    price,
  };
}

function calculate_total(cart) {
  // C, I, B
  // 이 함수는 세 분류가 다 묶여 있습니다
  return cart.reduce((total, item) => total + item.price, 0);
}

function gets_free_shipping(cart) {
  // B: 비즈니스 규칙
  return calc_total(cart) >= 20;
}

function calc_tax(amount) {
  // B: 비즈니스 규칙
  return amount * 0.1;
}
```

## 쉬는 시간

#### Q. 왜 계산으르 유틸리티와 장바구니, 비즈니스 규칙으로 다시 나누는 것인가요?

- 좋은 질문입니다.
- 이렇게 나누는 이유는 나중에 다룰 설계 기술을 미리 보여주기 위해서 입니다
- 최종적 코드는 구분된 그룹과 분리된 계층으로 구성할 것입니다
- 그전에 비슷한 구조를 미리 보면 나중에 이해하는 데 도움이 될 것이라고 생각합니다

#### Q. 그럼 비즈니스 규칙과 장바구니 기능은 어떤 차이가 있나요? 전자상거래를 만드는 것이라면 장바구니에 관한 것은 모두 비즈니스 규칙이 아닌가요?

- 장바구니는 대부분 전자상거래 서비스에서 사용하는 일반적인 개념입니다
- 그리고 장바구니가 동작하는 방식도 모두 비슷합니다
- 하지만 비즈니스 규칙은 다릅니다
  - MegaMart에서 운영하는 특별한 규칙이라고 할 수 있습니다
  - 예를 들어, 다른 전자상거래 서비스에도 장바구니 기능이 있을 것이라고 기대하지만, MegaMart와 똑같은 무료 배송 규칙이 있을 것이라고 기대하지는 않습니다

#### Q. 비즈니스 규칙과 장바구니에 대한 동작에 모두 속하는 함수도 있나요?

- 정말 좋은 질문입니다!
- 지금 시점에서는 "예"라고 할 수 있습니다
  - 하지만 계층 관점에서 보면 코드에서 나는 냄새입니다
- 비즈니스 규칙에서 장바구니가 배열인지 알아야 한다면 문제가 될 수 있습니다
- 비즈니스 규칙은 장바구니 구조와 같은 하위 계층보다 빠르게 바뀝니다
- 설계를 진행하면서 이 부분은 분리해야 합니다
- 하지만 지금은 그대로 두겠습니다

## 연습문제

- update_shipping_icons() 함수는 크기 때문에 많은 일을 하고 있습니다
- 이 함수가 하는 일을 나열하고 분류하고 나눠봅시다

```js
function update_shipping_icons(cart) {
  const buy_buttons = get_buy_buttons_dom();
  for (let i = 0; i < buy_buttons.length; i++) {
    const button = buy_buttons[i];
    const item = button.item;
    const new_cart = add_item(cart, item);
    if (gets_free_shipping(new_cart)) {
      button.show_free_shipping_icon();
    } else {
      button.hide_free_shipping_icon();
    }
  }
}
```

- 함수가 하는 일
  - 1. 모든 버튼 가져오기
  - 2. 버튼을 가지고 반복하기
  - 3. 버튼에 관련된 제품을 가져오기
  - 4. 가져온 제품을 가지고 새 장바구니 만들기
  - 5. 장바구니가 무료 배송이 필요한지 확인하기
  - 6. 아이콘 표시하거나 감추기

## 정답

- 함수가 하려는 일을 명확하게 나눴습니다

```js
function update_shipping_icons(cart) {
  const buy_buttons = get_buy_buttons_dom(); // 1. 모든 버튼 가져오기
  for (let i = 0; i < buy_buttons.length; i++) {
    // 2. 버튼을 가지고 반복하기
    const button = buy_buttons[i];
    const item = button.item; // 3. 버튼에 관련된 제품을 가져오기
    const hasFreeShipping = gets_free_shipping_with_item(cart, item);
    set_free_shipping_icon(button, hasFreeShipping);
  }
}

function gets_free_shipping_with_item(cart, item) {
  const new_cart = add_item(cart, item); // 4. 가져온 제품을 가지고 새 장바구니 만들기
  return gets_free_shipping(new_cart); // 5. 장바구니가 무료 배송이 필요한지 확인하기
}

function set_free_shipping_icon(button, hasFreeShipping) {
  // 6. 아이콘 표시하거나 감추기
  if (hasFreeShipping) {
    button.show_free_shipping_icon();
  } else {
    button.hide_free_shipping_icon();
  }
}
```

## 작은 함수와 많은 계산

## 결론

- 이제 액션은 데이터를 몰라도 됩니다
- 그리고 재사용할 수 있는 유용한 인터페이스 함수가 많이 생겼습니다
- 하지만 MegaMart가 아직 모르고 있는 버그가 장바구니에 숨어있습니다
  - 어떤 버그 일까요?
  - 그 전에 불변성에 대해 자세히 알아봐야 합니다

## 요점 정리

- 일반적으로 `암묵적 입력과 출력`은 `인자와 리턴값으로 바꿔` 없애는 것이 좋습니다
- `설계는 엉켜있는 것을 푸는 것입니다. 풀려있는 것은 언제든 다시 합칠 수 있습니다`
- 엉켜있는 것을 풀어 각 함수가 하나의 일만 하도록 하면, 개념을 중심으로 쉽게 구성할 수 있습니다

## 다음 장에서 배울 내용

- 설계에 대한 내용은 8장에서 다시 살펴보겠습니다
- 다음 두 장(6장, 7장)에서 불변성에 대해 알아보겠습니다
- 기존 코드와 상호작용하면서 새로운 코드에 불변성을 적용하려면 어떻게 해야 할까요?
