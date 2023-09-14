# 15. 타임라인 격리하기

#### 이번 장에서 살펴볼 내용

- 코드를 타임라인 다이어그램으로 그리는 방법을 배웁니다
- 버그를 찾기 위해 타임라인 다이어그램 보는 법을 이해합니다
- 타임라인끼리 공유하는 자원을 줄여 코드 설계를 개선하는 방법을 알아봅니다

---

이번장에서는 `시간에 따라` 실행되는 `액션의 순서`를 나타내기 위해 타임라인 다이어그램에 대해 알아보겠습니다

타임라인 다이어그램은 `소프트웨어`가 어떻게 `동작`하는지 `이해`하는 데 도움이 됩니다

특히 웹 서버와 클라이언트 간 통신처럼 분산 시스템을 이해하기 좋습니다

또 타임라인 다이어그램으로 버그를 진단하고 예측할 수 있습니다

그리고 문제를 해결하는 코드를 만들 수 있습니다

## 버그가 있습니다!

- 이슈

  - 장바구니에서 합계 금액이 잘못 표시도니다는 문의가 많이 들어오고 있다
  - 표시되는 금액이랑 결제되는 금액이 다르다

- 버그
  - 천천히 클릭하면 문제가 생기지 않습니다
  - 빠르게 클릭하면 금액이 잘못 표기되는 이슈가 발생합니다
  - 빠르게 두 번 클릭해서 나오는 결과들
    - 14달러(정상)
    - 16달러
    - 22 달러

### 코드를 보면서 버그를 이해해 봅시다

```js
// add_item_to_cart()는 장바구니에 추가 버튼을 클릭할 때 실행되는 핸들러 함수입니다
function add_item_to_cart(name, price, quantity) {
  // 장바구니 전역변수를 읽고 씁니다
  cart = add_item(cart, name, price, quantity);
  calc_cart_total();
}

function calc_cart_total() {
  total = 0;
  // 제품 API로 AJAX 요청을 보냅니다
  cost_ajax(cart, function (cost) {
    // 요청이 완료될 때 실행되는 콜백
    total += cost;
    // 판매 API로 AJAX 요청을 보냅니다
    shipping_ajax(cart, function (shipping) {
      // 판매 API 응답이 오면 실행되는 콜백
      total += shipping;
      // 합계를 DOM에 보여줍니다
      update_total_dom(total);
    });
  });
}
```

![p394](./images/p394.jpeg)

- 유스케이스(use case) 다이어그램

- 장바구니에 제품을 추가하고 다음 제품을 추가할 때 까지 기다리면 시스템은 올바르게 동작합니다
- 고객이 기다리지 않고 다음 제품을 추가할 때 어떻게 되는지 볼 수 있는 방법이 필요합니다
- 이 경우 두 가지 일이 동시에 진행됩니다
  - 타임라인 다이어그램을 통해 동시 진행되는 일을 표현해 봅시다

## 타임라인 다이어그램은 시간에 따라 어떤 일이 일어나는지 보여줍니다

- 타임라인(timeline)은 액션을 순새대로 나열한 것입니다
- 타임라인 다이어그램은 시간에 따른 액션 순서를 시각적으로 표시한 것입니다

![p395](./images/p395.jpeg)

- 왼쪽 다이어그램을 보면 잘못된 동작을 한다는 것을 알 수 있습니다
- 이번 장에서 배울 것들
  - 타임라인 다이어그램 그리는 방법
  - 시간에 관련된 문제를 찾기 위해 다이어그램을 읽는 방법
  - 타임라인 원책일 사용해 이런 종류의 버그를 줄일 방법
- 다이어그램을 그리는 방법부터 시작해봅시다

## 두 가지 타임라인 다이어그램 기본 규칙

- 타임라인 다이어그램으로 알 수 있는 중요한 두 가지 사실

  - 순서대로 실행되는 액션
  - 동시에 나란히 실행되는 액션

- 위와 관련된 두 가지 기본 규칙을 살펴봅시다

### 기본규칙 1. 두 액션이 순서대로 나타나면 같은 타임라인에 넣습니다

- 직렬

```js
// 순서대로 실행되는 경우
sendEmail1();
sendEmail2();
```

### 기본규칙 2. 두 액션이 동시에 실행되거나 순서를 예상할 수 없다면 분리된 타임라인에 넣습니다

- 병렬

```js
// 순서를 예상할 수 없는 경우
setTimeout(sendEmail1, Math.random() * 10000);
setTimeout(sendEmail2, Math.random() * 10000);
```

- 액션이 서로 다른 스레드나 프로세스, 기계, 비동기 콜백에서 실행되면 서로 다른 타임라인에 표시합니다

### 요약

1. 액션은 순서대로 실행되거나 동시에 실행됩니다
2. 순서대로 실행되는 액션은 같은 타임라인에 하나가 끝나면 다른 하나가 실행됩니다
3. 동시에 실행되는 액션은 여러 타임라인에서 나란히 실행됩니다

## 자세히 보면 놓칠 수 있는 액션 순서에 관한 두 가지 사실

### 1. ++와 +=는 사실 세 단계입니다

```js
total++;

// 숨겨진 단계
let temp = total; // 읽기(액션)
temp = temp + 1; // 더하기(계산)
total = temp; // 쓰기(액션)
```

- total이 전역변수라면 첫 번째 단계와 세 번째 단계는 액션입니다
- 두 번째 단계인 1을 더하는 동작은 계산입니다
  - 따라서 다이어그램에 표시하지 않습니다

### 2. 인자는 함수를 부르기 전에 실행됩니다

## add-to-cart 타임라인 그리기: 단계 1

- 타임라인 다이어그램 단계
  - 1. 액션을 확인합니다
  - 2. 순서대로 실행되거나 동시에 실행되는 액션을 그립니다
  - 3. 플랫폼에 특화된 지식을 사용해 다이어그램을 단순하게 만듭니다

### 1. 액션을 확인합니다

- 계산은 다이그램을 그릴 때 신경 쓰지 않아도 됩니다

```js
function add_item_to_cart(name, price, quantity) {
  // 전역변수(cart)를 읽고 씁니다 -> 1. cart 읽기, 2. cart 쓰기
  cart = add_item(cart, name, price, quantity);
  calc_cart_total();
}

function calc_cart_total() {
  total = 0; // 3. total = 0 쓰기
  // 4. cart 읽기 / 5. cost_ajax() 부르기
  cost_ajax(cart, function (cost) {
    total += cost; // 6. total 읽기 / 7. total 쓰기
    // 8. cart 읽기 / 9. shipping_ajax() 부르기
    shipping_ajax(cart, function (shipping) {
      total += shipping; // 10. total 읽기 / 11. total 쓰기
      update_total_dom(total); // 12. total 읽기 / 13 update_total_dom() 부르기
    });
  });
}
```

- 액션

  - 1. cart 읽기
  - 2. cart 쓰기
  - 3. total = 0 쓰기
  - 4. cart 읽기
  - 5. cost_ajax() 부르기
  - 6. total 읽기
  - 7. total 쓰기
  - 8. cart 읽기
  - 9. shipping_ajax() 부르기
  - 10. total 읽기
  - 11. total 쓰기
  - 12. total 읽기
  - 13. update_total_dom() 부르기

- 이 짧은 코드에 13개의 액션이 있습니다
  - 그리고 비동기 콜백 두 개가 있다는 것도 주의해야 합니다(5, 9)
  - 아직 콜백을 그리는 방법은 배우지 않았습니다
- 콜백을 어떻게 그리는지 알아보고 다음 단계를 진행해 봅시다

## 비동기 호출은 새로운 타임라인으로 그립니다

- 자바스크립트 비동기 엔진이 어떻게 동작하는지 알아보겠습니다
- 타임라인다이어그램에 점선이 왜 필요한지도 이야기하겠습니다

```js
// 사용자와 문서를 저장하는 과정에서 로딩 상태를 보여주는 코드

// 서버에 사용자를 저장합니다(ajax)
saveUserAjax(user, function () {
  // 사용자 로딩 표시를 감춥니다
  setUserLoadingDOM(false);
});
setUserLoadingDOM(true); // 사용자 로딩 표시를 보여줍니다

// 서버에 문저를 저장합니다(ajax)
saveDocumentAjax(document, function () {
  // 문서 로딩 표시를 감춥니다
  setDocLoadingDOM(false);
});
setDocLoadingDOM(true); // 문서 로딩 표시를 보여줍니다
```

- 다이어그램을 그리기 위한 세 단계

  - 1. 액션을 확인
  - 2. 각 액션을 그립니다
  - 3. 단순화합니다

- 액션

  - 1. saveUserAjax()
  - 2. setUserLoadingDOM(false)
  - 3. setUserLoadingDOM(true)
  - 4. saveDocumentAjax()
  - 5. setDocLoadingDOM(false)
  - 6. setDocLoadingDOM(true)

- 액션 그리기

![p402](./images/p402.jpeg)

## 서로 다른 언어, 서로 다른 스레드 모델

- 자바스크립트는 단일 스레드, 비동기 모델을 사용합니다
- 하지만 모든 언어가 단일 스레드, 비동기 모델을 사용하는 것은 아닙니다
- 다른 언어에서 사용하는 스레드 모델에 대해 알아봅시다

### 단일 스레드, 동기

- 기본적으로 멀티스레드를 지원하지 않는 언어도 있습니다(e.g. PHP)
- 제약 시스템이 단순하다는 장점이 있습니다
- 스레드가 하나면 타임라인도 하나이지만, 네트워크를 통한 API호출 같은 것은 다른 타임라인이 필요합니다
- 하지만 메모리를 공유하지 않기 때문에 공유 자원을 많이 없앨 수 있습니다

### 단일 스레드, 비동기

- 자바스크립트는 스레드가 하나입니다
- 입출력 작업을 하려면 비동기 모델을 사용해야 합니다
- 입출력의 결과는 콜백으로 받을 수 있지만, 언제 끝날지 알 수 없기 때문에 다른 타임라인에 표현해야 합니다

### 멀티스레드

- 자바, 파이썬, 루비, C, C# 과 같은 많은 언어가 멀티스레드를 지원합니다
- 멀티스레드는 실행 순서를 보장하지 않기 때문에 프로그래밍하기 매우 어렵습니다
- 새로운 스레드가 생기면 새로운 타임라인을 그려야 합니다

### 메시지 패싱(message-passing) 프로세스

- 엘릭서나 얼랭 같은 언어는 서로 다른 프로세스를 동시에 실행할 수 있는 스레드 모델을 지원합니다
- 프로세스는 서로 메모리를 공유하지 않고 메시지로 통신합니다
- 서로 다른 타임라인에 있는 액션은 순서가 섞이지만, 메모리를 공유하지 않기 때문에 가능한 실행 순서가 많아도 문제가 되지 않습니다

## 한 단계씩 타임라인 만들기

```js
// 사용자와 문서를 저장하는 과정에서 로딩 상태를 보여주는 코드

// 서버에 사용자를 저장합니다(ajax)
saveUserAjax(user, function () {
  // 사용자 로딩 표시를 감춥니다
  setUserLoadingDOM(false);
});
setUserLoadingDOM(true); // 사용자 로딩 표시를 보여줍니다

// 서버에 문저를 저장합니다(ajax)
saveDocumentAjax(document, function () {
  // 문서 로딩 표시를 감춥니다
  setDocLoadingDOM(false);
});
setDocLoadingDOM(true); // 문서 로딩 표시를 보여줍니다
```

- 1. saveUserAjax()
  - 타임라인 시작
- 2. setUserLoadingDOM(false)
  - 비동기 콜백 - 새로운 타임라인 필요
  - 요청을 보내기 전엔 응답을 받을 수 없기 때문에 점선으로 순서를 표시해야 합니다
- 3. setUserLoadingDOM(true)
- 4. saveDocumentAjax()
- 5. setDocLoadingDOM(false)
- 6. setDocLoadingDOM(true)

## add-to-cart 타임라인 그리기: 단계 2

```js
function add_item_to_cart(name, price, quantity) {
  // 전역변수(cart)를 읽고 씁니다 -> 1. cart 읽기, 2. cart 쓰기
  cart = add_item(cart, name, price, quantity);
  calc_cart_total();
}

function calc_cart_total() {
  total = 0; // 3. total = 0 쓰기
  // 4. cart 읽기 / 5. cost_ajax() 부르기
  cost_ajax(cart, function (cost) {
    total += cost; // 6. total 읽기 / 7. total 쓰기
    // 8. cart 읽기 / 9. shipping_ajax() 부르기
    shipping_ajax(cart, function (shipping) {
      total += shipping; // 10. total 읽기 / 11. total 쓰기
      update_total_dom(total); // 12. total 읽기 / 13 update_total_dom() 부르기
    });
  });
}
```

- 1. cart 읽기
- 2. cart 쓰기
- 3. total = 0 쓰기
- 4. cart 읽기
- 5. cost_ajax() 부르기
- 6. total 읽기
- 7. total 쓰기
- 8. cart 읽기
- 9. shipping_ajax() 부르기
- 10. total 읽기
- 11. total 쓰기
- 12. total 읽기
- 13. update_total_dom() 부르기

### 2. 순서대로 실행되거나 동시에 실행되는 액션을 그립니다

![p406](./images/p406.jpeg)

- ajax 콜백 두 개는 새로운 타임라인으로 그려야 합니다.

## 타임라인 다이어그램으로 순서대로 실행되는 코드에도 두 가지 종류가 있다는 것을 알 수 있습니다

- 순서대로 실행되는 두 액션 사이에 다른 타임 라인에 있는 액션이 끼어들 수 있습니다
- 하지만 어떤 환경에서는 그렇지 않습니다

  - 예를 들어 자바스크립트 스레드 모델에서 동기화된 액션 사이에는 다른 액션이 끼어들 수 없습니다

- 순서대로 실행되지만 `순서가 섞일 수 있는 코드`와 그렇지 않은 코드(`순서가 섞이지 않는 코드`) 모두 타임라인 다이어그램으로 표현할 수 있습니다
