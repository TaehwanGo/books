# 5. 더 좋은 액션 만들기

#### 이번 장에서 살펴볼 내용

- 암묵적 입력과 출력을 제거해서 재사용하기 좋은 코드를 만드는 방법을 알아봅니다
- 복잡하게 엉킨 코드를 풀어 더 좋은 구조로 만드는 법을 배웁니다

## 비즈니스 요구 사항과 설계를 맞추기

### 요구 사항에 맞춰 더 나은 추상화 단계 선택하기

- 요구 사항 : 합계 금액과 제품 가격에 대한 무료 배송여부가 아니고
  - 주문 결과가 무료 배송인지 확인해야 합니다

```js
/* before */
function gets_free_shipping(total, item_price) {
  // total, item_price는 요구사항과 맞지 않습니다
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

- 함수 시그니처가 바뀌었기 때문에 사용하는 부분ㄷ오 고쳐야 합니다

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
