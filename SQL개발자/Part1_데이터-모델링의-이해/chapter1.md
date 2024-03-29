# 1. 데이터 모델링의 이해

## 1. 데이터 모델의 이해

### (1) 모델링이란?

- 데이터베이스의 모델링 : 현실 세계를 단순화하여 표현하는 기법
- 모델링이 갖춰야 할 조건
  - 현실세계를 반영해야 한다
  - 단순화하여 표현해야 한다
  - 관리하고자 하는 데이터를 모델로 설계한다

### (2) 모델링의 특징

- 추상화(Abstraction)
  - 현실 세계를 일정한 형식으로 표현하는 것
  - 아이디어나 개념을 간략하게 표현하는 과정
- 단순화(Simplification)
  - 복잡한 현실 세계를 정해진 표기법으로 단순하고 쉽게 표현
- 명확화(Clarity)
  - 불분명함을 제거하고 명확하게 해석할 수 있도록 기술한다는 의미

### (3) 모델링의 세 가지 관점

- `데이터` 관점(What, Data)
  - 데이터 위주의 모델링
  - 어떤 데이터들이 업무와 얽혀있는지, 그리고 그 데이터 간에는 어떤 관계가 있는지에 대해서 모델링하는 방법이다
- `프로세스` 관점(How, Process)
  - 프로세스 위주의 모델링
  - 이 업무가 실제로 처리하고 있는 일은 무엇인지 또는 앞으로 처리해야 하는 일은 무엇인지를 모델링하는 방법이다
- `데이터와 프로세스`의 상관 관점(Data vs. Process, Interaction)
  - 데이터와 프로세스의 `관계를 위주`로 한 모델링이라고 할 수 있다
  - `프로세스의 흐름에 따라 데이터가 어떤 영향을 받는지`를 모델링하는 방법이다

### (4) 모델링의 세 가지 단계

- 개념적 데이터 모델링(Conceptual Data Modeling)
  - 전사적 데이터 모델링 수행 시 행해지며, 추상화 레벨이 가장 높은 모델링이다
  - 이 단계에서는 업무 중심적ㅇ이고 포괄적인 수준의 모델링이 진행된다
- 논리적 데이터 모델링(Logical Data Modeling)
  - 재사용성이 가장 높은 모델링으로 데이터베이스 모델에 대한 key, 속성, 관계 등을 모두 표현하는 단계이다
- 물리적 데이터 모델링(Physical Data Modeling)
  - 실제 데이터베이스로 구현할 수 있도록 성능이나 가용성 등의 물리적인 성격을 고려하여 모델을 표현하는 단계이다

### (5) 데이터의 독립성

- 외부 단계(스키마): Multiple User's Views
  | 논리적 데이터 독립성
- 개념 단계(스키마): Conceptual View of DB
  | 물리적 데이터 독립성
- 내부 단계(스키마): Physical Representation

- ANSI-SPARC(American National Standards Institute, Standards Planning and Requirements Committee) 아키텍처
  - 1975년에 제안된 데이터베이스 관리 시스템(DBMS)의 추상적인 설계 표준이다
  - ANSI-SPARC 아키텍처에서는 스키마를 3단계 구조로 나누는데, 이렇게 분리하는 목적은 데이터베이스에 대한 사용자들의 관점과 데이터베이스가 실제로 표현되는 물리적인 방식을 분리하기 위함이다
- 어플리케이션에 영향을 주지 않고 데이터베이스의 구조를 변경할 수 있어야 한다(독립성 보장)

- 3단계 스키마 구조

  - 외부 스키마(External Schema)
    - 사용자의 관점 단계로 각 사용자가 보는 데이터베이스의 스키마를 정의한다
  - 개념 스키마(Conceptual Schema)
    - 통합된 관점 단계로 모든 사용자가 보는 데이터베이스의 스키마를 통합하여 전체 데이터베이스를 나타내는 것이다
    - 데이터베이스에 저장되는 데이터들을 표현하고 데이터들 간의 관계를 나타낸다
  - 내부 스키마(Internal Schema)
    - 물리적인 관점 단계로 물리적인 저장 구조를 나타낸다
    - 실질적인 데이터의 저장 구조나 컬럼 정의, 인덱스 등이 포함된다

- 3단계 스키마 구조가 보장하는 독립성

  - ANSI-SPARC 아키텍처에서 이렇게 스미카를 3단계 구조로 나누는 이유는 데이터베이스에 대한 사용자들의 관점과 데이터베이스가 실제로 표현되는 물리적인 방식을 분리하여 독립성을 보장하기 위한 것이라고 하였다
  - 그렇다면 어떤 독립성이 보장되는지 알아보자
  - 논리적 독립성: 개념 스키마가 변경되어도 외부 스키마는 영향받지 않는다
  - 물리적 독립성: 내부 스키마가 변경되어 외부/개념 스키마는 영향받지 않는다

### (6) ERD(Entity Relationship Diagram)

- 시스템에 어떤 엔터티들이 존재하며 그들 간에 어떤 관계가 있는지 나타내는 다이어그램이다
- ERD 표기 방식
  - Peter Chen: 주로 대학교재에서 사용
  - IDEF1X(Integration Definition for Information Modeling)
    - 실무에서 사용하는 경우도 있으며 ERWin(ERD를 그리는 모델링 툴)에서 사용되는 모델
  - IE/Crow's Foot: 까마귀발 표기법
    - 가장 많이 사용
  - Min-Max/ISO
    - 각 엔터티의 참여도를 좀 더 상세하게 나타내는 표기법
  - UML: 소프트웨어 공학에서 주리 사용되는 모델
  - Case \* Method/Barker: Oracle에서 사용되는 모델로 Crow's Foot과 비슷하다
- IE/Crow's Foot 표기법
- ERD 작성 순서
  - 어떤 표기법을 사용하든 ERD를 작성하는 순서는 공통된 룰이며, 다음의 표기 순서를 따른다
  - 1. 엔터티를 도출하고 그린다
  - 2. 엔터티를 적절하게 배치한다
  - 3. 엔터티 간의 관계를 설정한다
  - 4. 관계명을 기입한다
  - 5. 관계의 참여도를 기입한다
  - 6. 관계의 필수/선택 여부를 기입한다

## 2. 엔터티(Entity)

### (1) 엔터티란?

- 독립체
- 데이터베이스에서 엔터티는 `식별이 가능한 객체`라는 의미를 가지고 있다
  - 업무에서 쓰이는 데이터를 용도별로 분류한 그룹
- e.g.
  - 회원
    - 아이디, 비밀번호, 이름, 핸드폰 번호, 주소
  - 상품
    - 상품코드, 상품명, 카테고리, 배송비

### (2) 엔터티의 특징

- 업무에서 쓰이는 정보
- 유니크함을 보장할 수 있는 식별자가 있어야 한다
- 2개 이상의 인스턴스를 가지고 있어야 한다
  - 인스턴스: 엔터티의 실체(e.g. 학생엔터티 -> 홍길동, 김철수, 박영희)
- 반드시 속성을 가지고 있어야 한다
  - 자신
- 내 생각
  - 엔터티는 데이터베이스에서 테이블을 의미한다고 생각하면 될 것 같다

## 적중 예상 문제

### 2. 엔터티 분류

- 발생 시점에 따른 분류

  - 기본 엔터티(Fundamental Entity)
  - 중심 엔터티(Main Entity)
  - 행위 엔터티(Active Entity)

- 유.무형에 따른 엔터티 분류
  - 유형 엔터티(Tangible Entity)
  - 개념 엔터티(Conceptual Entity)
  - 사건 엔터티(Event Entity)

### 3. ERD

- 비일관성 : ERD에서는 존재에 의한 관계와 행위에 의한 관계를 구분하지 않고 표현한다
  - 클래스 다이어그램에서는 이것을 구분하여 연관 관계와 의존 관계로 표현한다

### 4. 데이터 모델링 유의사항

### 6. 식별자 관계

| 식별자 관계                                   | 비식별자 관계                                  |
| --------------------------------------------- | ---------------------------------------------- |
| 강한 관계                                     | 약한 관계                                      |
| 부모 엔터티의 식별자가 자식 엔터티의 주식별자 | 부모 엔터티의 식별자가 자식 엔터티의 일반 속성 |
| 부모 엔터티가 있어야 생성 가능                | 부모 엔터티 없는 자식 엔터티 생성 가능         |
| 실선으로 표현                                 | 점선으로 표현                                  |

### 7. 모델 관계

- 필수 관계 : 동그라미가 없는 것

### 9. ERD 작성 순서

- 엔터티를 그린다
- 엔터티를 적절하게 배치한다
- 엔터티 간의 관계를 나타낸다
- 관계명을 정의한다
- 관계의 참여도를 나타낸다
- 관계의 필수 여부를 나타낸다

### 10. ERD 표기법 중 까마귀 발(Crow's Foot) 표기법

- 까마귀 발 기호는 2개 이상을 의미한다
- 엔터티는 사각형으로 표기한다
- 해시 마크(|)는 1개를 의미한다
- 점선은 비식별자 관계를 의미한다

### 11. 엔터티 종류

- 기본 엔터티
  - 업무에 원래 존재하는 정보
  - 독립적으로 생성되며, 자식 엔터티를 가질 수 있음
  - e.g. 상품, 회원, 사원, 부서
- 중심 엔터티
  - 기본 엔터티로부터 파생되고, 행위 엔터티 생성
  - 업무에 있어서 중심(핵심)적인 역할을 하며 데이터 양이 많이 발생
  - e.g. 주문, 매출, 계약
- 행위 엔터티
  - 2개 이상의 엔터티로부터 파생
  - 데이터가 자주 변경되거나 증가할 수 있음
  - e.g. 주문 내역, 이벤트 응모 이력

### 13. 속성

- 속성은 프로세스에 사용되는 데이터로 더 이상 쪼개지지 않고 인스턴스에서 관리된다
  - 인스턴스 : 엔터티의 실체, e.g. 학생 엔터티 -> 홍길동, 김철수, 박영희

### 16. 엔터티 간의 관계

- 관계명 - 관계의 이름
- 관계차수 - 1:1, 1:M, M:N과 같은 관계의 기수성을 나타낸다
- 관계선택사양 - 관계가 필수 관계인지, 선택 관계인지를 나타낸다

### 17. 엔터티 간의 관계 정의

- 두 엔터티 사이를 이어주는 동사가 존재해야 한다
- 두 엔터티는 부모-자식 관계 외에 다른 관계도 존재할 수 있다
- 두 엔터티 사이에 조합되는 정보가 존재해야 한다
- 두 엔터티 사이에 영향력 있는 관계가 존재해야 한다

### 18. 보조식별자

- 보조 식별자는 인스턴스를 식별할 수는 있지만 대표 식별자가 아닌 식별자로
  - 다른 엔터티와 참조 관계로 연결되지 않고
  - e.g. 회원 -> 아이디

### 20. 식별자 종류

- 복합식별자(Composite identifier) : 두 개 이상의 속성으로 구성된 식별자
- 대리식별자(인조식별자) : 주식별자의 속성이 두 개 이상인 경우 그 속성들을 하나로 묶어서 사용하는 식별자
- 보조 식별자(Alternate identifier) : 인스턴스를 식별할 수는 있지만 대표 식별자가 아님.
  - 다른 엔터티와 참조관계로 연결되지 않음
- 외부식별자(Foreign identifier) : 다른 엔터티에서 온 식별자, 다른 엔터티와의 연결고리 역할
