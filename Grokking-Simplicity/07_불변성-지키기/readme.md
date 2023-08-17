# 7. 신뢰할 수 없는 코드를 쓰면서 불변성 지키기

- 지난 장에서 불변성을 유지하기 위한 카피-온-라이트에 대해 배웠습니다
- 하지만 `카피 온 라이트를 적용할 수 없는 코드`를 함께 사용해야 할 때도 있습니다
- 바꿀 수 없는 `라이브러리`나 `레거시 코드`가 데이터를 변경한다면 카피 온 라이트를 적용할 수 없습니다
- 어떻게 이런 코드에 불변 데이터를 전달할 수 있을까요?
- 이번 장에서 데이터를 변경하는 코드를 함께 사용하면서 불변성을 지키는 방법에 대해 배우겠습니다

#### 이번 장에서 살펴볼 내용

- 레거시 코드나 신뢰할 수 없는 코드로부터 내 코드를 보호하기 위해 `방어적 복사`를 만듭니다
- `얕은 복사와 깊은 복사를 비교`합니다
- 카피-온-라이트와 방어적 복사를 언제 사용하면 좋은지 알 수 있습니다

## 레거시 코드와 불변성

- 레거시 코드 : 오래전에 만든 것으로, 지금 당장 고칠 수 없어서 그대로 사용해야 하는 코드

```js
function add_item_to_cart(name, price) {
  const item = make_cart_item(name, price);
  shopping_cart = add_item(shopping_cart, item);
  const total = calc_total(shopping_cart);
  set_cart_total_dom(total);
  update_shipping_icons(shopping_cart);
  update_tax_dom(total);

  // 이번 블랙 프라이데이 세일을 위해 새로 추가하는 레거시 코드
  black_friday_promotion(shopping_cart); // 이 코드를 추가해야 하지만 이 코드는 장바구니 값을 바꿉니다
}
```

- 추가된 함수(`black_friday_promotion`)를 호출하면 카피 온 라이트 원칙을 지킬 수 없습니다
- 그리고 black_friday_promotion 함수를 고칠 수도 없습니다
- 카피 온 라이트 원칙을 지키면서 안전하게 함수를 사용할 수 있는 다른 원칙 : `방어적 복사`

## 우리가 만든 카피 온 라이트 코드는 신뢰할 수 없는 코드와 상호작용해야 합니다

- 카피 온 라이트 패턴은 데이터를 바꾸기 전에 복사합니다
- 반면, 블랙 프라이데이 코드는 분석하기 힘든 레거시 코드라 어떤 일이 일어날지 정확히 알 수 없습니다
- 그래서 `데이터가 바뀌는 것을 완벽히 막아주는 원칙`이 필요합니다
  - 이 원칙을 `방어적 복사`라고 합니다

## 방어적 복사는 원본이 바뀌는 것을 막아줍니다

- 신뢰할 수 없는 코드와 데이터를 주고 받는 문제를 푸는 방법은 `복사본을 만드는 것`입니다
- `깊은 복사` 사용
  - 깊은 복사(deep copy)는 위에서 아래로 모든 계층에 있는 중첩된 데이터 구조를 복사합니다

## 방어적 복사 구현하기

```js
function add_item_to_cart(name, price) {
  const item = make_cart_item(name, price);
  shopping_cart = add_item(shopping_cart, item);
  const total = calc_total(shopping_cart);
  set_cart_total_dom(total);
  update_shipping_icons(shopping_cart);
  update_tax_dom(total);

  const cart_copy = deepCopy(shopping_cart); // 넘기기 전에 복사: 방어적 복사
  black_friday_promotion(cart_copy);
}
```

## 방어적 복사 규칙

### 규칙 1. 데이터가 안전한 코드에서 나갈 때 복사하기

- 변경 불가능한 데이터가 신뢰할 수 없는 코드로 나갈 때(신뢰할 수 없는 코드의 입력으로 들어갈 때),
  아래 단계로 원본 데이터를 보호할 수 있습니다
  - 1. 불변성 데이터를 위한 깊은 복사본을 만듭니다
  - 2. 신뢰할 수 없는 코드로 `복사본을 전달`합니다

### 규칙 2. 안전한 코드로 데이터가 들어올 때 복사하기

- 신뢰할 수 없는 코드에서 변경될 수도 있는 데이터가 들어온다면 다음 단계를 따릅니다

  - 1. 변경될 수도 있는 데이터가 들어오면 바로 깊은 복사본을 만들어 안전한 코드로 전달합니다
  - 2. 복사본을 안전한 코드에서 사용합니다

## 신뢰할 수 없는 코드 감싸기

```js
function add_item_to_cart(name, price) {
  const item = make_cart_item(name, price);
  shopping_cart = add_item(shopping_cart, item);
  const total = calc_total(shopping_cart);
  set_cart_total_dom(total);
  update_shipping_icons(shopping_cart);
  update_tax_dom(total);

  black_friday_promotion_safe(shopping_cart);
}

// 신뢰할 수 없는 코드를 감싸는 함수
function black_friday_promotion_safe(cart) {
  const cart_copy = deepCopy(cart); // 레거시 코드에 사용할 데이터를 깊은 복사
  black_friday_promotion(cart_copy); // 레거시 코드
  return deepCopy(cart_copy); // 레거시 코드가 변경한 데이터를 깊은 복사 후 리턴
}
```

## 연습 문제

```js
// # 1.
// 신뢰할 수 없는 payrollCalc
function payrollCalc(employees) {
  // ...
  return payrollChecks;
}

// 안전한 payrollCalc
function payrollCalc_safe(employees) {
  // 구현해보세요
}

// # 2.
// 신뢰할 수 없는 코드로 오는 데이터
// 안전한 processUser(user)

// 방어적 복사를 적용하기 전
userChanges.subscribe((user) => {
  processUser(user);
});

// 방어적 복사를 적용
userChanges.subscribe((user) => {
  // 구현해보세요
});
```

## 방어적 복사가 익숙할 수도 있습니다

- 대부분의 웹 기반 API는 암묵적으로 방어적 복사를 합니다
- JSON데이터가 들어온 경우
  - JSON데이터는 깊은복사본입니다

## 카피 온 라이트와 방어적 복사를 비교해 봅시다

| -              | 카피 온 라이트                                                                                    | 방어적 복사                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 언제 쓰나요?   | `통제할 수 있는 데이터`를 바꿀 때 카피 온 라이트를 씁니다                                         | `신뢰할 수 없는 코드와 데이터`를 주고 받아야 할 때 방어적 복사를 씁니다                                          |
| 어디서 쓰나요? | `안전지대` 어디서나 쓸 수 있습니다. 사실 카피-온-라이트가 불변성을 가진 안전지대를 만듭니다       | `안전지대의 경계`에서 데이터가 오고 갈 때 방어적 복사를 씁니다                                                   |
| 복사 방식      | 얕은 복사(shallow copy)                                                                           | 깊은 복사(deep copy)                                                                                             |
| 규칙           | 1. 바꿀 데이터의 얕은 복사를 만듭니다 <br /> 2. 복사본을 변경합니다 <br /> 3. 복사본을 리턴합니다 | 1. 안전지대로 들어오는 데이터에 깊은 복사를 만듭니다 <br /> 2. 안전지대에서 나가는 데이터에 깊은 복사를 만듭니다 |

## 깊은 복사는 얕은 복사보다 비쌉니다

## 자바스크립트에서 깊은 복사를 구현하는 것은 어렵습니다

- lodash의 cloneDeep 함수를 사용하면 깊은 복사를 할 수 있습니다
- 모든 항목을 재귀적으로 복사합니다

## 결론

- 방어적 복사(defensive copy)는 불변성을 스스로 구현할 수 있기 때문에 더 강력합니다
- 하지만 더 많은 비용이 듭니다
- 그래서 카피 온 라이트와 함께 사용하면 필요할 때 언제든 적용할 수 있는 강력함과 얕은 복사로 인한 효율성에 대한 장점을 모두 얻을 수 있습니다

## 요점 정리

- 방어적 복사는 불변성을 구현하는 원칙입니다
  - 데이터가 들어오고 나갈 때 복사본을 만듭니다
- 방어적 복사는 깊은 복사를 합니다
  - 그래서 카피-온-라이트보다 비용이 더 듭니다
- 카피-온-라이트와 다르게 방어적 복사는 불변성 원칙을 구현하지 않은 코드로부터 데이터를 보호해 줍니다
- `복사본이 많이 필요하지 않기 때문에` `카피 온 라이트를 더 많이 사용`합니다
  - `방어적 복사는 신뢰할 수 없는 코드와 함께 사용할 때만 사용`합니다
- 깊은 복사는 위에서 아래로 중첩된 데이터 전체를 복사합니다
  - 얕은 복사는 필요한 부분만 최소한으로 복사합니다

## 다음 장에서 배울 내용

- 다음 장에서는 지금까지 배운 내용을 모두 합쳐서 시스템 설계를 개선하기 위해 코드를 어떻게 구성해야 하는지 알아보겠습니다
