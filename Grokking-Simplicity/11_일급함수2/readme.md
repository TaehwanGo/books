# 11. 일급 함수2

- 지난 장에서 고차 함수를 만드는 방법을 배웠습니다.
- 이 장에서 다양한 예제를 통해 앞에서 배운 고차 함수에 대해 더 자세히 알아보겠습니다
- 먼저 카피-온-라이트 원칙을 코드로 옮기는 예제를 살펴보고 앞 장에서 살펴본 로그 시스템을 개선해보겠습니다.

#### 이번 장에서 살펴볼 내용

- 함수 본문을 콜백으로 바꾸기 - 리팩터링
- 함수를 리턴하는 함수가 가진 강력한 힘
- 고차 함수에 익숙해지기 위해 여러 고차함수를 만들어 봅시다

## 코드 냄새 하나와 리팩터링 두 개

- 10장 내용을 다시 한번 정리해봅시다

### 코드의 냄새: 함수 이름에 있는 암묵적 인자

- 냄새 : 함수 이름에 있는 암묵적 인자
- 특징
  - 1. 거의 똑같이 구현된 함수가 있다
  - 2. 함수 이름이 구현에 있는 다른 부분을 가리킨다

### 리팩터링: 암묵적 인자를 드러내기

- 암묵적 인자가 일급 값이 되도록 함수에 인자를 추가합니다

1. 함수 이름에 있는 암묵적 인자를 확인합니다
2. 명시적인 인자를 추가합니다
3. 함수 본문에 하드 코딩된 값을 새로운 인자로 바꿉니다
4. 함수를 호출하는 곳을 고칩니다

### 리팩터링: 함수 본문을 콜백으로 바꾸기

- 원래 있던 코드를 고차 함수로 만드는 강력한 방법

1. 본문에서 바꿀 부분의 앞부분과 뒷부분을 확인합니다
2. 리팩터링 할 코드를 함수로 빼냅니다
3. 빼낸 함수의 인자로 넘길 부분을 또 다른 함수로 빼냅니다

- 이제 위 리팩터링 기술들이 습관이 될 수 있도록 반복해서 적용해 봅시다

## 카피-온-라이트 리팩터링

- 카피-온-라이트 단계

  - 1. 복사본을 만듭니다 // 앞부분
  - 2. 복사본을 변경합니다 // 본문
  - 3. 복사본을 리턴합니다 // 뒷부분

- 함수 본문을 콜백으로 바꾸기 단계
  - 1. 본문과 앞부분, 뒷부분을 확인하기
  - 2. 함수 빼내기
  - 3. 콜백 빼내기

## 배열에 대한 카피-온-라이트 리팩터링

### 1. 본문과 앞부분, 뒷부분을 확인하기

```js
function arraySet(array, idx, value) {
  const copy = array.slice(); // 앞부분 - 공통 작업
  copy[idx] = value; // 본문 - 고유 작업
  return copy; // 뒷부분 - 공통 작업
}
```

### 2. 함수 빼내기

```js
// 원래 코드
function arraySet(array, idx, value) {
  const copy = array.slice(); // 앞부분 - 공통 작업
  copy[idx] = value; // 본문 - 고유 작업
  return copy; // 뒷부분 - 공통 작업
}

// 함수로 빼낸 코드
function arraySet(array, idx, value) {
  return withArrayCopy(array);
}

function withArrayCopy(array) {
  const copy = array.slice(); // 앞부분 - 공통 작업
  copy[idx] = value; // 본문 - 고유 작업 (함수로 빼내기)
  return copy; // 뒷부분 - 공통 작업
}
```

### 3. 콜백 빼내기

```js
// 원래 코드
function arraySet(array, idx, value) {
  return withArrayCopy(array);
}

function withArrayCopy(array) {
  const copy = array.slice(); // 앞부분 - 공통 작업
  copy[idx] = value; // 본문 - 고유 작업 (함수로 빼내기)
  return copy; // 뒷부분 - 공통 작업
}

// 콜백으로 빼낸 코드
function arraySet(array, idx, value) {
  return withArrayCopy(array, function (copy) {
    copy[idx] = value;
  });
}

function withArrayCopy(array, callback) {
  const copy = array.slice(); // 앞부분 - 공통 작업
  callback(copy); // 본문 - 고유 작업 (함수로 빼내기)
  return copy; // 뒷부분 - 공통 작업
}
```

#### 리팩터링 전 후 비교

```js
// 리팩터링 전
function arraySet(array, idx, value) {
  const copy = array.slice();
  copy[idx] = value;
  return copy;
}

// 리팩터링 후
function arraySet(array, idx, value) {
  return withArrayCopy(array, function (copy) {
    copy[idx] = value;
  });
}

function withArrayCopy(array, callback) {
  const copy = array.slice();
  callback(copy);
  return copy;
}
```

#### 리팩터링으로 얻은 것

- 1. 표준화된 원칙
  - 거의 똑같이 구현된 함수들을 하나로 합칠 수 있습니다
- 2. 새로운 동작에 원칙을 적용할 수 있음
- 3. 여러 개를 변경할 때 최적화

## 연습 문제

```js
// 리팩터링 전
try {
  sendEmail();
} catch (error) {
  logToSnapErrors(error);
}

// 리팩터링 후 - tryCatch() 함수로 빼내기
function tryCatch(f, errorhandler) {
  try {
    return f();
  } catch (error) {
    return errorhandler(error);
  }
}
```

## 함수를 리턴하는 함수

```js
// 리팩터링 전
try {
  // 앞부분
  saveUserData(user); // 본문
} catch (error) {
  // 뒷부분
  logToSnapErrors(error);
}

// 10장에서 리팩터링한 코드
function withLogging(f) {
  try {
    f();
  } catch (error) {
    logToSnapErrors(error);
  }
}

/**
 * 문제점
 * - 1. 어떤 부분에 로그를 남기는 것을 깜빡할 수 있습니다
 * - 2. 모든 코드에 수동으로 withLogging() 함수를 추가해야 합니다
 *
 * 중복 코드를 많이 줄였지만 여전히 불편할 정도로 중복 코드가 있습니다
 * 에러를 잡아 로그를 남길 수 있는 기능이 추가된 함수를
 * 일반 함수 처럼 그냥 호출할 수 있으면 좋겠습니다
 */
// 함수로 감싸고 이름을 없애자
function (arg) {
  try {
    f(arg);
  } catch (error) {
    logToSnapErrors(error);
  }
}

// 리팩터링 후
// 콜백에 인자를 추가하는 대신 이 함수를 새로운 함수로 감싸자
function wrapLogging(f) {
  return function (arg) {
    try {
      f(arg);
    } catch (error) {
      logToSnapErrors(error);
    }
  };
}

const saveUserDataWithLogging = wrapLogging(saveUserData);
saveUserDataWithLogging(user);
```

- 원래 동작
- -> 고차함수로 전달
- -> 고차함수 행동을 새로운 함수로 감싸 실행을 미룹니다
- -> 새로운 함수를 리턴합니다
- -> 원래 행동에 `새로운 행동이 추가`되었습니다

## 쉬는 시간 1

- 인자가 여러개인 wrapLogging() 함수 -> wrapAlert 참고

```js
export function wrapAlert(f) {
  return (...params) => {
    try {
      return f(...params);
    } catch (error) {
      console.error(error);
      alert(
        "An error occurred. Please check the console for more information."
      );
    }
  };
}
```

## 쉬는 시간 2

- Q. 전체 프로그램을 고차 함수로 만들면 안되나요?
- A. 그것이 정말 필요한가?
  - 마치 복잡한 퍼즐을 풀고 똑똑해진 것 같은 느낌을 받을 순 있지만
  - 좋은 엔지니어링은 퍼즐을 푸는 것이 아닙니다
  - 효과적으로 문제를 해결할 수 있어야 합니다
  - 만약 고차함수로 만든 좋은 방법을 찾았다면 직관적인 방법과 항상 비교해보세요
- 요점
  - 고차함수는 강력한 기능입니다
  - 하지만 비용이 따릅니다

## 결론

- 이 장에서 일급 값과 일급 함수, 고차 함수에 대해 배웠습니다
- 다음 장에서 이 개념의 숨은 힘에 대해 알아보겠습니다
- 액션과 계산, 데이터를 구분하고 나서 고차 함수에 대한 개념은 함수형 프로그래밍 힘에 대한 새로운 세계를 열어줬습니다
- 이 책의 파트2는 함수형 프로그래밍의 새로운 힘에 대한 내용을 다룹니다

## 요점 정리

- 고차 함수로 패턴이나 원칙을 코드로 만들 수 있습니다
  - 고차 함수를 사용하지 않는다면 일일이 수작업을 해야 합니다
  - 고차함수는 한번 정의하고 필요한 곳에 여러 번 사용할 수 있습니다
- 고차 함수로 함수를 리턴하는 함수를 만들 수 있습니다
  - `리턴 받은 함수`는 `변수에 할당해서 이름이 있는 일반 함수처럼 쓸 수 있습니다`
- 고차 함수를 사용하면서 잃는 것도 있습니다
  - 고차 함수는 많은 중복 코드를 없애 주지만 가독성을 해칠 수도 있습니다
  - 잘 익혀서 적절한 곳에 써야 합니다

## 다음 장에서 배울 내용

- 앞에서 배열을 순회하는 forEach() 함수를 살펴봤습니다
- 다음 장에서는 forEach() 함수 개념을 더 확자유해서 함수형 스타일로 순회하는 것에 대해 알아보겠습니다
  - 배열을 순회하는 일반적인 함수형 패턴에 대해 알아보겠습니다
