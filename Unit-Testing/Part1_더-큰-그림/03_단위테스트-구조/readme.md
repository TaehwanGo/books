# 3. 단위 테스트 구조

#### 3장에서 다루는 내용

- 단위 테스트 구조
- 좋은 단위 테스트 명명법
- 매개변수화된 테스트 작성
- Fluent Assertions 사용

#### 서론

- 준비(Arrange), 실행(Act), 검증(Assert) 패턴(AAA 패턴)으로 작성된 단위 테스트의 구조를 살펴볼 것이다
- 단위 테스트 명명법 소개
- 단위 테스트 프로세스를 간소화하는 테스트 프레임워크의 몇 가지 기능 소개

## 3.1 단위 테스트를 구성하는 방법

- 준비, 실행, 검증

### 3.1.1 AAA 패턴 사용

- AAA 패턴은 각 테스트를 준비, 실행, 검증이라는 세 부분으로 나눌 수 있다

```cs
public class CalculatorTests
{
  [Fact] // 테스트를 나타내는 xUnit 속성
  public void Sum_of_two_numbers() // 단위 테스트 이름
  {
    // 준비(Arrange)
    double first = 10;
    double second = 20;
    var calculator = new Calculator();

    // 실행(Act)
    double result = calculator.Sum(first, second);

    // 검증(Assert)
    Assert.Equal(30, result);
  }
}
```

- AAA 패턴은 스위트 내 모든 테스트가 단순하고 균일한 구조를 갖는 데 도움이 된다
- 이러한 일관성이 이 패턴의 가장 큰 장점 중 하나다
- 일단 익숙해지면 모든 테스트를 쉽게 읽을 수 있고 이해할 수 있다
- 결국 전체 테스트 스위트의 유지보수 비용이 줄어든다

- AAA 구조

  - 준비 구절에서는 테스트 대상 시스템(SUT, System Under Test)과 해당 의존성을 원하는 상태로 만든다
  - 실행 구설에서는 SUT에서 메서드를 호출하고 준비된 의존성을 전달하며 (출력이 있으면) 출력 값을 캡처한다
  - 검증 구절에서는 결과를 검증한다
    - 결과는 반환 값이나 SUT와 협력자의 최종 상태, SUT가 협력자에 호출한 메서드 등으로 표시될 수 있다

- Given-When-Then 패턴

  - AAA 패턴은 Given-When-Then 패턴과 유사하다
  - Given: 준비 구절에 해당
  - When: 실행 구절에 해당
  - Then: 검증 구절에 해당

- 테스트를 작성할 때는 준비 구절부터 시작하는 것이 자연스럽다
- 검증 구절로 시작하는 것도 가능한 옵션이다.
  - 테스트 주도 개발(TDD, Test-Driven Development)을 실천할 때,
    즉, 기능을 개발하기 전에 실패할 테스트를 만들 때는 아직 기능이 어떻게 동작할지 충분히 알지 못한다
  - 따라서 먼저 기대하는 동작으로 윤곽을 잡은 다음, 이러한 기대에 부응하기 위한 시스템을 어떻게 개발할지 아는 것이 좋다
- TDD는 특정 동작이 무엇을 해야 하는지에 대한 목표를 생각하면서 시작한다
  - 그 다음 실제 문제 해결이다
  - 다른 것을 하기 전에 검증문을 작성하는 것은 단지 사고의 형식이다
  - 그러나 다시 말하지만, 이 지침은 TDD를 실천할 때, 즉 제품 코드 전에 테스트를 작성할 때만 적용될 수 있다
- TDD가 아닌 경우엔 준비 구절부터 시작하는 것이 좋다

### 3.1.2 여러 개의 준비, 실행, 검증 구절 피하기

- 여러개의 준비, 실행, 검증 구절은 테스트가 너무 많은 것을 한 번에 검증한다는 의미이다
  - 이러한 테스트는 여러 테스트로 나눠서 해결한다
- 여러 개를 테스트 하는 것은 통합 테스트다
  - 통합테스트에서 속도가 느리면 여러 개를 테스트 할 수도 있다
- 단위 테스트나 충분히 빠른 통합테스트에서는 이러한 최적화는 필요하지 않다
  - 항상 다단계 단위 테스트를 여러 개의 테스트로 나누는 것이 더 좋다

### 3.1.3 테스트 내 if문 피하기

- 단위 테스트 안에서 if문은 한 번에 너무 많은 것을 검증한다는 표시다
- 이러한 테스트는 반드시 여러 테스트로 나눠야 한다
- 통합 테스트에서도 예외는 없다
- 테스트에 분기가 있어서 얻는 이점은 없다

### 3.1.4 각 구절은 얼마나 커야 하는가?

- AAA 패턴으로 시작할 때 보통 하는 질문
  - 각 구절의 크기가 얼마나 되는가?
  - 테스트가 끝난 후에 정리되는 종료(teardown) 구절은 어떻게 하는가?
- 테스트 구절의 크기에 따라 각기 다른 지침이 있다

#### 준비 구절이 가장 큰 경우

- 일반적으로 준비 구절이 세 구절 중 가장 크며, 실행과 검증을 합친 만큼 클 수도 있다
- 그러나 너무 크면 테스트 클래스 내 비공개 메서드 또는 별도의 팩토리 클래스로 도출하는 것이 좋다
- 준비 구절에서 코드 재사용에 도움이 되는 두 가지 패턴
  - Object Mother 패턴
  - Test Data Builder 패턴

#### 실행 구절이 한 줄 이상인 경우를 경계하라

- 실행 구절은 보통 코드 한 줄이다
- 실행 구절이 두 줄 이상인 경우 SUT의 공개 API에 문제가 있을 수 있다

```cs
// 예제 3.2 한 줄로 된 실행 구절
[Fact]
public void Purchase_succeeds_when_enough_inventory()
{
  // Arrange
  var store = new Store();
  store.AddInventory(Product.Shampoo, 10);
  var customer = new Customer();

  // Act
  bool success = customer.Purchase(store, Product.Shampoo, 5);

  // Assert
  Assert.True(success);
  Assert.Equal(5, store.GetInventory(Product.Shampoo));
}

// 예제 3.3 두 줄로 된 실행 구절
[Fact]
public void Purchase_succeeds_when_enough_inventory()
{
  // Arrange
  var store = new Store();
  store.AddInventory(Product.Shampoo, 10);
  var customer = new Customer();

  // Act
  bool success = customer.Purchase(store, Product.Shampoo, 5);
  store.RemoveInventory(success, Product.Shampoo, 5);

  // Assert
  Assert.True(success);
  Assert.Equal(5, store.GetInventory(Product.Shampoo));
}
```

- 예제 3.3의 실행 구절로 알 수 있는 내용

  - 첫 번째 줄: 고객이 상점에서 샴푸 다섯 개를 얻으려고 한다
  - 두 번째 줄: 재고가 감소되는데, Purchase() 호출이 성공을 반환하는 경우에만 수행된다

- 예제 3.3의 문제점은 단일 작업을 수행하는 데 두 개의 메서드 호출이 필요하다는 것이다
  - 테스트는 구매 프로세스라는 동일한 동작 단위를 검증한다
  - 이 경우 테스트문제가 아닌, Customer 클래스의 API에 문제가 있으며, 클라이언트에게 메서드 호출을 더 강요해서는 안 된다
    - 두 번째 줄을 호출하지 않으면 제품은 얻을 수 있지만, 재고 수량은 줄어들지 않을 것이다
    - 이러한 모순을 불변 위반(invariant violation)이라고 한다
    - 잠재적 모순으로부터 코드를 보호하는 행위를 캡슐화(encapsulation)라고 한다
- 해결책은 코드 캡슐화를 항상(must, always) 지키는 것이다

- 실행 구절을 한 줄로 하는 지침은 비즈니스 로직을 포함하는 대부분 코드에 적용된다
  - 그렇지만, 유틸리티나 인프라 코드는 덜 적용된다
  - 그러므로 절대 두 줄 이상 두지 말라고 할 수 없다

### 3.1.5 검증 구절에는 검증문이 얼마나 있어야 하는가

- 단위 테스트의 단위는 동작의 단위이지 코드의 단위가 아니다
- 단일 동작 단위는 여러 결과를 낼 수 있으며, 하나의 테스트로 그 모든 결과를 평가하는 것이 좋다
- 그렇기는 해도 검증 구절이 너무 커지는 것은 경계해야 한다
  - 제품 코드에서 추상화가 누락됐을 수 있다

### 3.1.6 종료 단계는 어떤가

- 준비, 실행, 검증 이후의 네 번째 구절로 종료 구절을 따로 구분하기도 한다
  - 예를 들면 테스트에 의해 작성된 파일을 지우거나 데이터베이스 연결을 종료하고자 이 구절을 사용할 수 있다
  - 종료는 일반적으로 별도의 메서드로 도출돼, 클래스 내 모든 테스트에서 재사용된다.
  - AAA 패턴에는 이 단계를 포함하지 않는다
- 대부분의 단위 테스트는 종료 구절이 필요 없다
  - 단위 테스트는 프로세스 외부에 종속적이지 않으므로 처리해야 할 사이드 이펙트를 남기지 않는다
  - 종료는 통합 테스트의 영역이다
  - 3부에서 통합 테스트 후 올바르게 정리하는 법을 자세히 설명한다

### 3.1.7 테스트 대상 시스템(SUT, System Under Test) 구별하기

- SUT는 테스트에서 중요한 역할을 하는데, 애플리케이션에서 호출하고자 하는 동작에 대한 진입점을 제공한다
  - 동작은 여러 클래스에 걸쳐 있을 만큼 클 수도 있고 단일 메서드로 작을 수도 있다
  - 그러나 진입점은 오직 하나만 존재할 수 있다(동작을 수행할 하나의 클래스다).
- 따라서 SUT를 의존성과 구분하는 것이 중요하다

```cs
// Calculator 인스턴스 이름을 바꾸고 난 후의 CalculatorTests
// 예제 3.4 의존성과 SUT 구별하기
public class CalculatorTests
{
  [Fact]
  public void Sum_of_two_numbers()
  {
    // Arrange
    double first = 10;
    double second = 20;
    var sut = new Calculator(); // Calculator를 이제 sut라고 한다

    // Act
    double result = sut.Sum(first, second);

    // Assert
    Assert.Equal(30, result);
  }
}
```

### 3.1.8 준비, 실행, 검증 주석 제거하기

- 의존성에서 SUT를 떼어내는 것이 중요하듯이, 테스트 내에서 특정 부분이 어떤 구절에 속해 있는지 파악하는 데 시간을 많이 들이지 않도록 세 구절을 서로 구분하는 것 역시 중요하다
  - 이를 위한 방법으로 주석을 다는 것이 있다
- 다른 방법은 예제와 같이 빈 줄로 분리하는 것이다

```cs
// 예제 3.5 빈 줄로 각 구절을 구분한 Calculator
public class CalculatorTests
{
  [Fact]
  public void Sum_of_two_numbers()
  {
    double first = 10;
    double second = 20;
    var sut = new Calculator();

    double result = sut.Sum(first, second);

    Assert.Equal(30, result);
  }
}
```

- 빈 줄로 구절을 구분하면 간결성과 가독성 사이에서 균형을 잡을 수 있다
- 그러나 대규모 테스트에서는 잘 작동하지 않는다
  - 대규모 테스트에서는 준비 단계에 빈 줄을 추가해 설정 단계를 구분할 수도 있다
  - 통합 테스트에는 복잡한 설정을 포함하는 경우가 많다. 그러므로 아래와 같이 주석 규칙을 정리해보자

#### 주석 규칙

- AAA패턴을 따르고 준비 및 검증 구절에 빈 줄을 추가하지 않아도 되는 테스트라면 구절 주석들을 제거하라
- 그렇지 않으면 구절 주석을 유지하라

## 3.2 xUnit 테스트 프레임워크 살펴보기

- 이전에 추가 구성([TestFixture] 또는 [SetUp] 등)이 필요했던 많은 개념이 이제 컨벤션과 내장 언어 구조에 의존하게 됐다
- 테스트가 제품 코드의 기능을 무조건 나열하면 안 된다
- 오히려 애플리케이션 동작에 대해 고수준의 명세가 있어야 한다
- 이상적으로 이 명세는 프로그래머뿐만 아니라 비즈니스 담당자에게도 의미가 있어야 한다

## 3.3 테스트 간 테스트 픽스쳐 재사용

- 테스트에서 언제 어떻게 코드를 재사용하는지 아는 것이 중요하다
- 준비 구절에서 코드를 재사용하는 것이 테스트를 줄이면서 단순화하기 좋은 방법이고, 이 절에서는 올바른 방법을 알아본다

> ### 테스트 픽스처
>
> 테스트 픽스처라는 단어는 다음과 같이 두 가지 공통된 의미가 있다 <br />
>
> 1. `테스트 픽스처`는 `테스트 실행 대상 객체`다.
>    이 객체는 정규 의존성, 즉 SUT로 전달되는 인수다.
>    데이터베이스에 있는 데이터나 하드 디스크에 있는 파일일 수도 있다.
>    이러한 객체는 각 테스트 실행 전에 알려진 고정 상태로 유지하기 때문에 동일한 결과를 생성한다
>    따라서 픽스처라는 단어가 나왔다. <br />
> 2. 다른 정의는 NUnit 테스트 프레임워크에서 비롯된다
>    NUnit에서 [TestFixture]는 테스트가 포함된 클래스를 표시하는 특성이다. <br />
>
> 이 책에서는 첫 번째 정의를 사용한다

- 테스트 픽스처를 재사용하는 올바르지 않은 방법은 다음과 같이 테스트 이전에 호출하는 것이다

```cs
// 예제 3.7. 안좋은 예 - 테스트 생성자에서 초기화 코드 추출
public class CustomerTests
{
  private readonly Store _store;
  private readonly Customer _sut;

  public CustomerTests()
  {
    // 클래스 내 각 테스트 이전에 호출
    _store = new Store();
    _store.AddInventory(Product.Shampoo, 10);
    _sut = new Customer();
  }

  [Fact]
  public void Purchase_succeeds_when_enough_inventory()
  {
    bool success = _sut.Purchase(_store, Product.Shampoo, 5);

    Assert.True(success);
    Assert.Equal(5, _store.GetInventory(Product.Shampoo));
  }

  [Fact]
  public void Purchase_fails_when_not_enough_inventory()
  {
    bool success = _sut.Purchase(_store, Product.Shampoo, 15);

    Assert.False(success);
    Assert.Equal(10, _store.GetInventory(Product.Shampoo));
  }
}
```

- 준비 구절이 동일하므로 CustomerTests의 생성자를 추출한 예제이다
- 그러나 이 기법은 두 가지 중요한 단점이 있다

  - 테스트 간 결합도가 높아진다
  - 테스트 가독성이 떨어진다

- 이러한 단점을 자세히 살펴보자

### 3.3.1 테스트 간의 높은 결합도는 안티 패턴이다

- 지침: 테스트를 수정해도 다른 테스트에 영향을 주어서는 안된다
  - 이 지침은 2장에서 다룬 바와 같이, 테스트는 서로 격리돼 실행해야 한다는 것과 비슷하다
- 이 지침을 따르려면 테스트 클래스에 공유 상태를 두지 말아야 한다

### 3.3.2 테스트 가독성을 떨어뜨리는 생성자 사용

- 준비 코드를 생성자로 추출할 때의 또 다른 단점은 테스트 가독성을 떨어뜨리는 것이다
- 테스트만 보고 더 이상 전체 그림을 볼 수 없다
- 테스트 메서드가 무엇을 하는지 이해하려면 클래스의 다른 부분도 봐야 한다
- 준비 로직이 별로 없더라도 테스트 메서드로 바로 옮기는 것이 좋다

### 3.3.3 더 나은 테스트 픽스처 재사용법

- 테스트 픽스처를 재사용할 때 생성자 사용이 최선의 방법은 아니다
- 두 번째 방법은 다음 예제와 같이 테스트 클래스에 비공개 팩토리 메서드(private factory method)를 두는 것이다

```cs
// 예제 3.8 비공개 팩토리 메서드로 도출한 공통 초기화 코드
public class CustomerTests
{
  [Fact]
  public void Purchase_succeeds_when_enough_inventory()
  {
    Store store = CreateStoreWithInventory(Product.Shampoo, 10);
    Customer sut = CreateCustomer();

    bool success = sut.Purchase(store, Product.Shampoo, 5);

    Assert.True(success);
    Assert.Equal(5, store.GetInventory(Product.Shampoo));
  }

  [Fact]
  public void Purchase_fails_when_not_enough_inventory()
  {
    Store store = CreateStoreWithInventory(Product.Shampoo, 10);
    Customer sut = CreateCustomer();

    bool success = sut.Purchase(store, Product.Shampoo, 15);

    Assert.False(success);
    Assert.Equal(10, store.GetInventory(Product.Shampoo));
  }

  private Store CreateStoreWithInventory(Product product, int quantity)
  {
    Store store = new Store();
    store.AddInventory(product, quantity);
    return store;
  }

  private static Customer CreateCustomer()
  {
    return new Customer();
  }
}
```

- 공통 초기화 코드를 비공개 팩토리 메서드로 추출해 테스트 코드를 짧게 하면서, 동시에 테스트 진행 상황에 대한 전체 맥락을 유지할 수 있다
  - 게다가 비공개 메서드를 충분히 일반화하는 한, 테스트가 서로 결합되지 않는다
- 테스트 픽스처 재사용 규칙에 한 가지 예외가 있다
  - 테스트 전부 또는 대부분에 사용되는 생성자에 픽스처를 인스턴스화할 수 있다
    - 이는 데이터 베이스와 작동하는 통합 테스트에 종종 해당한다
    - 이러한 모든 테스트는 데이터베이스 연결이 필요하며, 이 연결을 한 번 초기화한 다음 어디에서나 재사용할 수 있다
    - 그러나 `기초 클래스`를 둬서 개별 테스트 클래스가 아니라 `클래스 생성자에서 데이터 베이스 연결을 초기화`하는 것이 더 합리적이다

```cs
// 예제 3.9 기초 클래스 내 공통 초기화 코드
public class CustomerTests: IntegrationTests
{
  [Fact]
  public void Purchase_succeeds_when_enough_inventory()
  {
    // 여기에서 _database 사용
  }
}

public abstract class IntegrationTests: IDisposable
{
  protected readonly Database _database;

  protected IntegrationTests()
  {
    _database = new Database();
  }

  public void Dispose()
  {
    _database.Dispose();
  }
}
```

- CustomerTests가 생성자 없이 작성됐다는 것을 알 수 있다
- IntegrationTests 기초 클래스 상속을 통해 \_database 인스턴스에 접근한다

## 3.4 단위 테스트 명명법

- 테스트에 표현력 있는 이름을 붙이는 것이 중요하다
- 올바른 명칭은 테스트가 검증하는 내용과 기본 시스템의 동작을 이해하는 데 도움이 된다
- 단위 테스트 이름을 어떻게 정해야 하는가?

  - 가장 유명하지만 도움이 되지 않는 관습: `[테스트 대상 메서드]_[시나리오]_[예상 결과]`
    - 테스트 대상 메서드: 테스트 중인 메서드의 이름
    - 시나리오: 메서드를 테스트하는 조건
    - 예상 결과: 현재 시나리오에서 테스트 대상 메서드에 기대하는 것
  - 위 관습은 동작 대신 구현 세부 사항에 집중하게 부추기기 때문에 도움이 되지 않는다
  - 간단하고 쉬운 영어 구문이 훨씬 더 효과적이며, 엄격한 명명 구조에 얽매이지 않고 표현력이 뛰어나다
    - 고객이나 도메인 전문가에게 의미 있는 방식으로 시스템 동작을 설명할 수 있다

- Sum_of_two_numbers을 안좋은 규칙으로 다시 쓰면 어떻게 될까?
  - Sum_TwoNumbers_ReturnsSum
  - 이 이름은 논리적으로 보이지만, 테스트 가독성에 도움이 되지 않는다

### 3.4.1 단위 테스트 명명 지침

- 표현력 있고 읽기 쉬운 테스트 이름을 지으려면 다음 지침을 따르자
  - 엄격한 명명 정책을 따르지 않는다.
    - 복잡한 동작에 대한 높은 수준의 설명을 이러한 정책의 좁은 상자 안에 넣을 수 없다
    - 표현의 자유를 허용하자
  - 문제 도메인에 익숙한 비개발자들에게 시나리오를 설명하는 것처럼 테스트 이름을 짓자
    - 도메인 전문가 또는 비즈니스 분석가에게 설명하는 것 처럼
  - 단어를 밑줄(underscore, \_) 표시로 구분한다
    - 그러면 특히 긴 이름에서 가독성을 향상 시키는 데 도움이 된다
- 테스트 이름을 지정할 때 [클래스명]Tests 패턴을 사용하지만 그 단위는 클래스 단위가 아니라 동작의 단위일 수도 있다

### 3.4.2 예제: 지침에 따른 테스트 이름 변경

```cs
// 예제 3.10 엄격한 정책으로 명명된 테스트
[Fact]
public void IsDeliveryValid_InvalidDate_ReturnsFalse()
{
  DeliveryService sut = new DeliveryService();
  DateTime pastDate = DateTime.Now.AddDays(-1);
  Delivery delivery = new Delivery(pastDate);

  bool isValid = sut.IsDeliveryValid(delivery);

  Assert.False(isValid);
}
```

- 이 테스트는 DeliveryService가 잘못된 날짜의 배송을 올바르게 식별하는지 검증한다

- 테스트 이름을 쉬운 영어로 어떻게 다시 작성할까?
  - 첫 번째 시도
    - Delivery_with_invalid_date_should_be_considered_invalid
    - 두 가지가 눈에 띈다
      - 더 쉽게 이해할 수 있다
      - SUT의 메서드 이름은 더 이상 테스트 명에 포함되지 않는다
    - 더 좋아 질 수 있다
      - 배송 날짜가 무효하다는 것은 정확히 무슨 뜻인가?
        - 무효한 날짜는 과거의 어느 날짜임을 알 수 있다
  - 두 번째 시도
    - Delivery_with_invalid_past_date_should_be_considered_invalid
    - 너무 장황하다
      - considered라는 단어를 제거해도 의미가 퇴색되지 않는다
  - 세 번째 시도
    - Delivery_with_invalid_past_date_should_be_considered_invalid
    - should be 문구는 또 다른 일반적인 안티 패턴이다
      - 단순 원자적 사실이므로 소망이나 욕구가 들어가지 않는다
      - is로 바꿔보자
  - 네 번째 시도
    - Delivery_with_invalid_past_date_is_invalid
    - 마지막으로 기초 영문법을 지켜야 한다
    - 관사를 붙이면 테스트를 완벽하게 읽을 수 있다
      - a를 테스트 이름에 추가하자
  - 마지막
    - Delivery_with_invalid_a_past_date_is_invalid

## 3.5 매개변수화된 테스트 리팩터링하기

- 테스트 하나로는 동작 단위를 완벽하게 설명하기에 충분하지 않다
  - 이 단위는 일반적으로 여러 구성 요소를 포함하며, 각 구성 요소는 자체 테스트로 캡처해야 한다
  - 동작이 충분히 복잡하면, 이를 설명하는 데 테스트 수가 급격히 증가할 수 있으며 관리하기 어려워질 수 있다
  - 다행히도 `대부분의 단위 테스트 프레임워크`는 매개변수화된 테스트를 사용해 `유사한 테스트를 묶을 수 있는 기능을 제공`한다
- 테스트 그룹핑 예제를 살펴보자
  - Delivery_with_invalid_a_past_date_is_invalid에 아래 세 개를 추가해보자
    - Delivery_for_today_is_valid
    - Delivery_for_tomorrow_is_valid
    - The_soonest_delivery_date_is_two_days_from_now
  - 유일한 차이점은 배송 날짜 뿐이다

```cs
public class DeliveryServiceTests
{
  [InlineData(-1, false)] // InlineData 특성은 테스트 메서드에 입력 값 집합을 보낸다
  [InlineData(0, false)] // 각 라인은 동작에 대해 별개의 사실을 나타낸다
  [InlineData(1, false)]
  [InlineData(2, true)]
  [Theory] // Theory 특성은 동작에 대한 사실(Fact) 묶음이다
  public void Can_detect_an_invalid_delivery_date(int daysFromNow, bool expected)
  {
    DeliveryService sut = new DeliveryService();
    DateTime deliveryDate = DateTime.Now.AddDays(daysFromNow);
    Delivery delivery = new Delivery(deliveryDate);

    bool isValid = sut.IsDeliveryValid(delivery);

    Assert.Equal(expected, isValid);
  }
}
```

- 이름에서 더 이상 구성된 날짜가 올바른지 잘못됐는지에 대해 언급할 필요가 없으므로 좀 더 일반적으로 바꿨다
  - Delivery_with_invalid_a_past_date_is_invalid -> Can_detect_an_invalid_delivery_date
- 매개변수화된 테스트를 사용하면 테스트 코드의 양을ㄹ 크게 줄일 수 있지만, 비용이 발생한다
  - 이제 테스트 메서드가 나타내는 사실을 파악하기가 어려워졌다
  - 그리고 매개변수가 많을 수록 더 어렵다
  - 절충안으로 `긍정적인 테스트 케이스`는 `고유한 테스트로 도출`하고, 가장 중요한 부분을 잘 설명하는 이름을 쓰면 좋다

```cs
// 예제 3.12 긍정적인 시나리오와 부정적인 시나리오를 검증하는 두 가지 테스트
public class DeliveryServiceTests
{
  [InlineData(-1)]
  [InlineData(0)]
  [InlineData(1)]
  [Theory]
  public void Can_detect_an_invalid_delivery_date(int daysFromNow)
  {
    DeliveryService sut = new DeliveryService();
    DateTime deliveryDate = DateTime.Now.AddDays(daysFromNow);
    Delivery delivery = new Delivery(deliveryDate);

    bool isValid = sut.IsDeliveryValid(delivery);

    Assert.False(isValid);
  }

  [Fact]
  public void The_soonest_delivery_date_is_two_days_from_now()
  {
    DeliveryService sut = new DeliveryService();
    DateTime deliveryDate = DateTime.Now.AddDays(2);
    Delivery delivery = new Delivery(deliveryDate);

    bool isValid = sut.IsDeliveryValid(delivery);

    Assert.True(isValid);
  }
}
```

- 이 방법으로 테스트 매개변수에서 boolean 매개변수를 제거할 수 있다
- 만약 부정케이스의 동작이 너무 복잡하면 매개변수화된 테스트를 사용하지 말자

## 요약

- 모든 단위 테스트는 AAA 패턴(준비, 실행, 검증)을 따라야 한다
  - 테스트 내 준비나 실행 또는 검증 구절이 여러 개 있으면, 테스트가 여러 동작 단위를 한 번에 검증한다는 표시다
  - 이 테스트가 단위 테스트라면 각 동작에 하나씩 여러 개의 테스트로 나눠야 한다
- 실행 구절이 한 줄 이상이면 SUT의 API에 문제가 있다는 뜻이다
  - 클라이언트가 항상 이러한 작업을 같이 수행해야 하고, 이로 인해 잠재적 모순으로 이어질 수 있다
  - 이러한 모순을 불변 위반이라고 한다
  - 잠재적 불변 위반으로부터 코드를 보호하는 것을 캡슐화라고 한다
- SUT의 이름을 sut로 지정해 SUT를 테스트에서 구별하자
- 구절 사이에 빈 줄을 추가하거나 준비, 실행, 검증 구절 주석을 각각 앞에 둬서 구분하라
- 테스트 픽스처 초기화 코드는 생성자에 두지 말고 팩토리 메서드를 도입해서 재사용하자
  - 이러한 재사용은 테스트 간 결합도를 상당히 낮게 유지하고 가독성을 향상시킨다
- 엄격한 테스트 명명 정책을 시행하지 말라
  - 문제 도메인에 익숙한 비개발자들에게 시나리오를 설명하는 것처럼 각 테스트의 이름을 지정하자
  - 테스트 이름에서 밑줄 표시로 단어를 구분하고, 테스트 대상 메서드 이름을 넣지 말자
- 매개변수화된 테스트로 유사한 테스트에 필요한 코드의 양을 줄일 수 있다
  - 단점은 테스트 이름을 더 포괄적으로 만들수록 테스트 이름을 읽기 어렵게 하는 것이다
- 검증문 라이브러리를 사용하면, 쉬운 영어 처럼 읽도록 검증문에서 단어 순서를 재구성해 테스트 가독성을 더욱 향상시킬 수 있다
