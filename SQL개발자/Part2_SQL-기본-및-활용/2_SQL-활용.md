# Chapter 2. SQL 활용

## 1. 서브쿼리

- 하나의 쿼리 안에 존재하는 또 다른 쿼리이다
- 서브쿼리는 위치에 따라 다음과 같이 나눌 수 있다
  - SELECT절 : 스칼라 서브쿼리(Scalar Subquery)
  - FROM절 : 인라인 뷰(Inline View)
  - WHERE절, HAVING절 : 중첩 서브쿼리(Nested Subquery)

### (1) 스칼라 서브쿼리(Scalar Subquery)

- 주로 SELECT절에 위치하지만 컬럼이 올 수 있는 대부분 위치에 사용할 수 있다
- 컬럼 대신 사용되므로 반드시 하나의 값만을 반환해야 하며 그렇지 않은 경우 에러를 발생시킨다

```sql
SELECT M.PRODUCT_CODE,
       (SELECT S.PRODUCT_NAME
          FROM PRODUCT S
         WHERE S.PRODUCT_CODE = M.PRODUCT_CODE) AS PRODUCT_NAME,
       M.MEMBER_ID,
       M.CONTENT
FROM PRODUCT_REVIEW M;
```

### (2) 인라인 뷰(Inline View)

- FROM절 등 테이블명이 올 수 있는 위치에 사용 가능하다

```sql
SELECT M.PRODUCT_CODE,
       S.PRODUCT_NAME,
       S.PRICE,
       M.MEMBER_ID,
       M.CONTENT
FROM PRODUCT_REVIEW M,
     (SELECT PRODUCT_CODE,
             PRODUCT_NAME,
             PRICE
        FROM PRODUCT) S
WHERE M.PRODUCT_CODE = S.PRODUCT_CODE;
```

#### Level up test

```sql
SELECT A.FIRST_NAME,
       A.LAST_NAME,
       (SELECT B.DEPT_NAME
          FROM DEPT B
         WHERE B.DEPT_ID = A.DEPT_ID) AS DEPT_NAME
FROM EMP A;

-- 위와 같은 SQL
SELECT A.FIRST_NAME,
       A.LAST_NAME,
       B.DEPT_NAME
FROM EMP A LEFT OUTER JOIN DEPT B
ON A.DEPT_ID = B.DEPT_ID;
```

### (3) 중첩 서브쿼리(Nested Subquery)

- WHERE절이나 HAVING절에 사용되는 서브쿼리이다

#### 중첩 서브쿼리는 메인 쿼리와의 관계에 따라 다음과 같이 나눌 수 있다

- 비연관 서브쿼리(Uncorreleted Subquery) : 메인 쿼리와 관계를 맺고 있지 않음
- 연관 서브쿼리(Correleted Subquery) : 메인 쿼리와 관계를 맺고 있음

##### 비연관 서브쿼리(Uncorreleted Subquery)

- 서브쿼리 내에 메인 쿼리의 컬럼이 존재하지 않음

```sql
SELECT NAME, JOB, BIRTHDAY, AGENCY_CODE
FROM ENTERTAINER
WHERE AGENCY_CODE = (SELECT AGENCY_CODE
                       FROM AGENCY
                      WHERE AGENCY_NAME = 'EDAM엔터테인먼트');
```

##### 연관 서브쿼리(Correleted Subquery)

- 서브쿼리 내에 메인 쿼리의 컬럼 존재

```sql
SELECT ORDER_NO,
       DRINK_CODE,
       ORDER_CNT
FROM CAFE_ORDER A
WHERE ORDER_CNT = (SELECT MAX(ORDER_CNT)
                     FROM CAFE_ORDER B
                    WHERE A.DRINK_CODE = B.DRINK_CODE);
```

- 서브쿼리의 WHERE절에 DRINK_CODE 라는 컬럼이 메인쿼리와 서브쿼리 둘 다 존재한다

#### 중첩 서브쿼리는 반환하는 데이터 형태에 따라 다음과 같이 나눌 수 있다

- 단일 행(Single Row) 서브쿼리
  - 서브쿼리가 1건 이하의 데이터를 반환
  - 단일 행 비교 연산자와 함께 사용
  - 단일 행 비교 연산자 : =, >, <, >=, <=, <>
- 다중 행(Multiple Row) 서브쿼리
  - 서브쿼리가 여러 건의 데이터를 반환
  - 다중 행 비교 연산자와 함께 사용
  - 다중 행 비교 연산자 : IN, ANY, ALL, EXISTS
- 다중 컬럼(Multiple Column) 서브쿼리
  - 서브쿼리가 여러 컬럼의 데이터를 반환

##### 단일 행 서브쿼리(Single Row Subquery)

- 항상 1건 이하의 결과만 반환

```sql
SELECT * FROM PRODUCT
WHERE PRICE = (SELECT MAX(PRICE) FROM PRODUCT);
-- 가격이 가장 비싼 상품을 조회
```

##### 다중 행 서브쿼리(Multiple Row Subquery)

- 2건 이상의 행을 반환

```sql
SELECT * FROM PRODUCT
WHERE PRICE_CODE IN (SELECT PRODUCT_CODE FROM PRODUCT_REVIEW);
-- 상품 리뷰가 존재하는 상품을 조회
```

##### 다중 컬럼 서브쿼리(Multiple Column Subquery)

- 서브쿼리가 여러 컬럼의 데이터를 반환

```sql
SELECT * FROM EMPLOYEES
WHERE (JOB_ID, SALARY) IN (SELECT JOB_ID, MAX_SALARY
                           FROM JOBS
                           WHERE MAX_SALARY = 10000);
-- MAX_SALARY가 10,000인 직업을 가지고 있으며 실제 SALARY가 MAX_SALARY와 일치하는 직원의 정보를 조회
```

## 2. 뷰

- 특정 SELECT 문에 이름을 붙여서 재사용이 가능하도록 저장해놓은 오브젝트이다
- SQL에서 테이블처럼 사용할 수 있으며 앞서 배운 인라인 뷰를 뷰로 정의한다고 가정해보면 쿼리 작성 시 안라인 뷰가 들어가는 위치에 뷰 이름만 기술하게 될 것이다
- 뷰는 가상 테이블이다. 실제 데이터를 저장하지는 않고 해당 데이터를 조회하는 SELECT 문만 가지고 있다

```sql
CREATE OR REPLACE VIEW DEPT_MEMBER AS
SELECT A.DEPARTMENT_ID,
       A.DEPARTMENT_NAME,
       B.FIRST_NAME,
       B.LAST_NAME,
LEFT OUTER JOIN EMPLOYEES B
ON A.DEPARTMENT_ID = B.DEPARTMENT_ID;
```

- 다음 쿼리는 IT부서의 인원을 조회한다

```sql
SELECT * FROM DEPT_MEMBER WHERE DEPARTMENT_NAME = 'IT';
```

- 다음 쿼리는 부서별 인원을 카운트하여 인원이 많은 부서부터 정렬한다

```sql
SELECT DEPARTMENT_NAME, COUNT(*)
FROM DEPT_MEMBER
GROUP BY DEPARTMENT_NAME
ORDER BY COUNT(*) DESC;
```

- VIEW 삭제

```sql
DROP VIEW DEPT_MEMBER;
```

## 3. 집합 연산자

- 집합 연산자는 `각 쿼리의 결과 집합`을 가지고 `연산`을 하는 명령어이다
- UNION ALL : 합집합. 중복된 행도 그대로 출력된다
- UNION : 합집합. 중복된 행은 하나만 출력된다
- INTERSECT : 교집합. 중복된 행은 한 줄로 출력된다
- MINUS/EXCEPT : 앞에 있는 쿼리의 결과 집합에서 뒤에 있는 쿼리의 결과 집합을 뺀 차집합이다
  - 중복된 행은 한줄로 출력된다

```sql
-- UNION ALL : 합집합. 중복된 행도 그대로 출력된다
SELECT * FROM RUNNING_MAN
UNION ALL
SELECT * FROM INFINITE_CHALLENGE;

-- UNION : 합집합. 중복된 행은 하나만 출력된다
SELECT * FROM RUNNING_MAN
UNION
SELECT * FROM INFINITE_CHALLENGE;

-- INTERSECT : 교집합. 중복된 행은 한 줄로 출력된다
SELECT * FROM RUNNING_MAN
INTERSECT
SELECT * FROM INFINITE_CHALLENGE;

-- MINUS : 앞에 있는 쿼리의 결과 집합에서 뒤에 있는 쿼리의 결과 집합을 뺀 차집합이다
SELECT * FROM RUNNING_MAN
MINUS
SELECT * FROM INFINITE_CHALLENGE;
```

## 4. 그룹 함수

- 데이터를 GROUP BY 하여 나타낼 수 있는 데이터를 구하는 함수
- 역할에 따라 구분해보면 집계 함수와 소계(총계) 함수로 나눌 수 있다

- 집계 함수 : COUNT, SUM, AVG, MAX, MIN 등
- 소계(총계) 함수 : ROLLUP, CUBE, GROUPING SETS 등

### (1) ROLLUP

- 소그룹 간의 소계 및 총계를 계산하는 함수이다
- ROLLUP(A)
  - A로 그룹핑
  - 총합계
- ROLLUP(A,B)
  - A, B로 그룹핑
  - A로 그룹핑
  - 총합계
- ROLLUP(A,B,C)
  - A, B, C로 그룹핑
  - A, B로 그룹핑
  - A로 그룹핑
  - 총합계

```sql
SELECT ORDER_DT, ORDER_ITEM, REG_NAME, COUNT(*)
FROM STARBUCKS_ORDER
GROUP BY ROLLUP(ORDER_DT, ORDER_ITEM, REG_NAME);
ORDER BY ORDER_DT;
-- ORDER_DT : 날짜
-- ORDER_ITEM : 주문음료
-- REG_NAME : 판매사원
```

- A, B, C로 그룹핑 : ORDER_DT, ORDER_ITEM, REG_NAME
  - 날짜, 주문음료, 판매사원을 총 합친 그룹별 총 합계
- A, B로 그룹핑 : ORDER_DT, ORDER_ITEM
  - 날짜, 주문음료를 합친 그룹별 총 합계
- A로 그룹핑 : ORDER_DT
  - 날짜별 총 합계

```sql
SELECT ORDER_DT, ORDER_ITEM, REG_NAME, COUNT(*)
FROM STARBUCKS_ORDER
GROUP BY ROLLUP((ORDER_DT, ORDER_ITEM), REG_NAME)
ORDER BY ORDER_DT;
```

- GROUP BY ROLLUP(ORDER_DT, ORDER_ITEM, REG_NAME)과 비교했을 때
  - 날짜별로 그룹핑한 Row가 빠진다

```sql
SELECT ORDER_DT, ORDER_ITEM, REG_NAME, COUNT(*)
FROM STARBUCKS_ORDER
GROUP BY ROLLUP(ORDER_DT, (ORDER_ITEM, REG_NAME))
ORDER BY ORDER_DT;
```

- GROUP BY ROLLUP(ORDER_DT, ORDER_ITEM, REG_NAME)과 비교했을 때
  - 날짜별, 주문음료별로 그룹핑한 Row가 빠진 것을 알 수 있다

### (2) CUBE

- 소그룹 간의 소계 및 총계를 다차원적으로 계산할 수 있는 함수
- GROUP BY가 일방향으로 그룹핑하며 소계를 구했다면 CUBE는 `조합할 수 있는 모든 그룹`에 대한 소계를 집계한다

  - 내 생각 : CROSS JOIN 처럼 모든 경우의 수를 구한다고 생각하면 될 것 같다

- CUBE(A)
  - A로 그룹핑
  - 총합계
- CUBE(A,B)
  - A, B로 그룹핑
  - A로 그룹핑
  - B로 그룹핑
  - 총합계
- CUBE(A,B,C)
  - A, B, C로 그룹핑
  - A, B로 그룹핑
  - A, C로 그룹핑
  - B, C로 그룹핑
  - A로 그룹핑
  - B로 그룹핑
  - C로 그룹핑
  - 총합계

```sql
SELECT ORDER_DT, ORDER_ITEM, REG_NAME, COUNT(*)
FROM STARBUCKS_ORDER
GROUP BY CUBE(ORDER_DT, ORDER_ITEM, REG_NAME)
ORDER BY ORDER_DT;
```

```sql
SELECT ORDER_DT, ORDER_ITEM, REG_NAME, COUNT(*)
FROM STARBUCKS_ORDER
GROUP BY CUBE((ORDER_DT, ORDER_ITEM), REG_NAME)
ORDER BY ORDER_DT;
```

### (3) GROUPING SETS

- 특정 항목에 대한 소계를 계산하는 함수
- 인자값으로 ROLLUP이나 CUBE를 사용할 수도 있다
- GROUPING SETS(A, B)
  - A로 그룹핑
  - B로 그룹핑
- GROUPING SETS(A, B, ())
  - A로 그룹핑
  - B로 그룹핑
  - 총합계
- GROUPING SETS(A, ROLLUP(B))
  - A로 그룹핑
  - B로 그룹핑
  - 총합계
- GROUPING SETS(A, ROLLUP(B,C))
  - A로 그룹핑
  - B, C로 그룹핑
  - B로 그룹핑
  - 총합계
- GROUPING SETS(A, B, ROLLUP(C))
  - A로 그룹핑
  - B로 그룹핑
  - C로 그룹핑
  - 총합계

```sql
SELECT ORDER_DT, ORDER_ITEM, COUNT(*)
FROM STARBUCKS_ORDER
GROUP BY GROUPING SETS(ORDER_DT, ORDER_ITEM)
ORDER BY ORDER_DT;
```

- 날짜별(ORDER_DT) 그룹핑
- 주문음료별(ORDER_ITEM) 그룹핑

```sql
SELECT ORDER_DT, ORDER_ITEM, COUNT(*)
FROM STARBUCKS_ORDER
GROUP BY GROUPING SETS(ORDER_DT, ORDER_ITEM, ())
ORDER BY ORDER_DT;

-- 위와 같은 SQL
SELECT ORDER_DT, ORDER_ITEM, COUNT(*)
FROM STARBUCKS_ORDER
GROUP BY GROUPING SETS(ORDER_DT, ROLLUP(ORDER_ITEM))
ORDER BY ORDER_DT;
```

- 날짜별(ORDER_DT) 그룹핑
- 주문음료별(ORDER_ITEM) 그룹핑
- 총합계

> Tip. ROLLUP 함수는 인수의 순서에 따라 결과가 달라지며
> CUBE함수와 GROUPING SETS 함수는 인수의 순서에 상관없이 결과가 동일하다

- 내 생각 정리
  - CUBE는 각각이 풀어져있으면서 소계 및 총합계를 구하는 것이고
  - GROUPING SETS은 각 단위별로 하나씩 묶는 것이다
    - 만약 GROUPING SETS에 총합계나 소계가 포함되려면 () 또는 ROLLUP을 사용해야 한다

### (4) GROUPING 함수

- GROUPING 함수는 ROLLUP, CUBE, GROUPING SETS 등과 함께 쓰이며 소계를 나타내는 Row를 구분할 수 있게 해준다
- 앞서 보여준 예제에서는 소계를 나타내는 Row에서 그룹핑의 기준이 되는 컬럼을 제외하고 모두 NULL값으로 표현되었지만 GROUPING 함수를 이용하면 원하는 위치에 원하는 텍스트를 출력할 수 있다

```sql
SELECT ORDER_DT, GROUPING(ORDER_DT), COUNT(*)
FROM STARBUCKS_ORDER
GROUP BY ROLLUP(ORDER_DT);
ORDER BY ORDER_DT;
```

- GROUPING 함수의 결과값이 1이 되고 나머지 Row에서는 0이 된다

| ORDER_DT | GROUPING(ORDER_DT) | COUNT(\*) |
| -------- | ------------------ | --------- |
| 20190101 | 0                  | 7         |
| 20190102 | 0                  | 13        |
| 20190103 | 0                  | 8         |
| 20190104 | 0                  | 12        |
| NULL     | 1                  | 40        |

- 위 결과 값을 CASE문을 이용하여 원하는 텍스트를 출력해보자

```sql
SELECT CASE GROUPING(ORDER_DT)
            WHEN 1 THEN 'TOTAL' ELSE ORDER_DT
       END AS ORDER_DT,
       COUNT(*)
FROM STARBUCKS_ORDER
GROUP BY ROLLUP(ORDER_DT);
ORDER BY ORDER_DT;
```

| ORDER_DT | COUNT(\*) |
| -------- | --------- |
| 20190101 | 7         |
| 20190102 | 13        |
| 20190103 | 8         |
| 20190104 | 12        |
| TOTAL    | 40        |

- Oracle의 경우 아래와 같이 DECODE문으로 CASE 문을 대체할 수 있다

```sql
SELECT DECODE(GROUPING(ORDER_DT), 1, 'TOTAL', ORDER_DT) AS ORDER_DT,
       COUNT(*)
FROM STARBUCKS_ORDER
GROUP BY ROLLUP(ORDER_DT);
ORDER BY ORDER_DT;
```

그룹핑 하는 컬럼이 두 개일 때도 동일한 방법으로 쿼리를 작성해줄 수 있다

```sql
SELECT ORDER_DT,
       GROUPING(ORDER_DT),
       ORDER_ITEM,
       GROUPING(ORDER_ITEM),
       COUNT(*)
FROM STARBUCKS_ORDER
GROUP BY ROLLUP(ORDER_DT, ORDER_ITEM)
ORDER BY ORDER_DT;

-- CASE문으로 정리

SELECT CASE GROUPING(ORDER_DT)
            WHEN 1 THEN 'TOTAL' ELSE ORDER_DT
       END AS ORDER_DT,
       CASE GROUPING(ORDER_ITEM)
            WHEN 1 THEN 'TOTAL' ELSE ORDER_ITEM
       END AS ORDER_ITEM,
       COUNT(*)
FROM STARBUCKS_ORDER
GROUP BY ROLLUP(ORDER_DT, ORDER_ITEM)
ORDER BY ORDER_DT;
```

### 5. 윈도우 함수

- OVER 키워드와 함께 사용되며 역할에 따라 다음과 같이 나눌 수 있다
- 순위 함수 : RANK, DENSE_RANK, ROW_NUMBER
- 집계 함수 : SUM, AVG, COUNT, MAX, MIN
- 행 순서 함수 : FIRST_VALUE, LAST_VALUE, LEAD, LAG
- 비율 함수 : CUME_DIST, PERCENT_RANK, NTILE, RATIO_TO_REPORT

#### (1) 순위 함수

| 함수       | 설명                                             | 예시          |
| ---------- | ------------------------------------------------ | ------------- |
| RANK       | 동일 순위가 존재하면 다음 순위를 건너뛴다        | 1, 2, 2, 4, 5 |
| DENSE_RANK | 동일 순위가 존재하면 다음 순위를 건너뛰지 않는다 | 1, 2, 2, 3, 4 |
| ROW_NUMBER | 동일 순위가 존재하더라도 순위를 건너뛰지 않는다  | 1, 2, 3, 4, 5 |

##### RANK

- 순위를 매기면서 같은 순위가 존재하면 존재하는 수만큼 다음 순위를 건너뛴다

```sql
-- 날짜별로 주문 건수를 카운트한 순위
SELECT ORDER_DT, COUNT(*),
       RANK() OVER(ORDER BY COUNT(*) DESC) AS RANK
FROM STARBUCKS_ORDER
GROUP BY ORDER_DT;
```

| ORDER_DT | COUNT(\*) | RANK |
| -------- | --------- | ---- |
| 20190102 | 13        | 1    |
| 20190104 | 12        | 2    |
| 20190103 | 12        | 2    |
| 20190105 | 8         | 4    |

##### DENSE_RANK

```sql
-- 날짜별로 주문 건수를 카운트한 순위
SELECT ORDER_DT, COUNT(*),
       DENSE_RANK() OVER(ORDER BY COUNT(*) DESC) AS RANK
FROM STARBUCKS_ORDER
GROUP BY ORDER_DT;
```

| ORDER_DT | COUNT(\*) | RANK |
| -------- | --------- | ---- |
| 20190102 | 13        | 1    |
| 20190104 | 12        | 2    |
| 20190103 | 12        | 2    |
| 20190105 | 8         | 3    |

##### ROW_NUMBER

```sql
-- 날짜별로 주문 건수를 카운트한 순위
SELECT ORDER_DT, COUNT(*),
       ROW_NUMBER() OVER(ORDER BY COUNT(*) DESC) AS RANK
FROM STARBUCKS_ORDER
GROUP BY ORDER_DT;
```

| ORDER_DT | COUNT(\*) | RANK |
| -------- | --------- | ---- |
| 20190102 | 13        | 1    |
| 20190104 | 12        | 2    |
| 20190103 | 12        | 3    |
| 20190105 | 8         | 4    |

#### (2) 집계 함수

##### SUM

```sql
SELECT SUM(SCORE) AS TOTAL_SCORE FROM SQLD;
```

- SQLD 시험 성적 데이터에서 모든 사람들의 점수를 합한 결과

| TOTAL_SCORE |
| ----------- |
| 210         |

```sql
-- 개인별 총점수를 구하는 쿼리
SELECT STUDENT_NAME, SUBJECT, SCORE,
       SUM(SCORE) OVER(PARTITION BY STUDENT_NAME) AS TOTAL_SCORE
FROM SQLD;
```

| STUDENT_NAME | SUBJECT             | SCORE | TOTAL_SCORE |
| ------------ | ------------------- | ----- | ----------- |
| 김철수       | 데이터모델링의 이해 | 19    | 96          |
| 김철수       | SQL 기본 및 활용    | 19    | 77          |

##### MAX

```sql
-- 과목별 최대 점수를 받은 사람만 출력
SELECT STUDENT_NAME,
       SUBJECT,
       SCORE,
FROM (
  SELECT STUDENT_NAME,
         SUBJECT,
         SCORE,
         MAX(SCORE) OVER(PARTITION BY SUBJECT) AS MAX_SCORE
  FROM SQLD
)
WHERE SCORE = MAX_SCORE;
```

##### MIN

- 데이터의 최솟값을 구하는 함수

```sql
-- 과목별 최소 점수를 받은 사람만 출력
SELECT STUDENT_NAME,
       SUBJECT,
       SCORE,
FROM (
  SELECT STUDENT_NAME,
         SUBJECT,
         SCORE,
         MIN(SCORE) OVER(PARTITION BY SUBJECT) AS MIN_SCORE
  FROM SQLD
)
WHERE SCORE = MIN_SCORE;
```

- PARTITION BY {컬럼} 은 컬럼을 기준으로 그룹핑을 하겠다는 의미이다

##### AVG

```sql
-- 과목별 평균 점수 이상을 받은 사람만 출력
SELECT STUDENT_NAME,
       SUBJECT,
       SCORE,
FROM (
  SELECT STUDENT_NAME,
         SUBJECT,
         SCORE
         ROUND(AVG(SCORE) OVER(PARTITION BY SUBJECT)) AS AVG_SCORE
  FROM SQLD
)
WHERE SCORE >= AVG_SCORE;
```

| STUDENT_NAME | SUBJECT             | SCORE |
| ------------ | ------------------- | ----- |
| 김철수       | 데이터모델링의 이해 | 19    |
| 김철수       | SQL 기본 및 활용    | 77    |
| 이솔         | 데이터모델링의 이해 | 15    |

##### COUNT

- 데이터 건수를 카운트하는 함수

#### (3) 행 순서 함수

##### FIRST_VALUE

- 파티션 별 가장 선두에 위치한 데이터를 구하는 함수
- MySQL에서는 지원하지 않는다

##### LAST_VALUE

- 파티션 별 가장 마지막에 위치한 데이터를 구하는 함수
- MySQL에서는 지원하지 않는다

##### LAG

- 파티션 별로 특정 수만큼 앞선 데이터를 구하는 함수
- MySQL에서는 지원하지 않는다

##### LEAD

- 파티션 별 특정 수만큼 뒤에 있는 데이터를 구하는 함수
- MySQL에서는 지원하지 않는다

#### (4) 비율 함수

##### RATIO_TO_REPORT

- 파티션 별 합계에서 차지하는 비율을 구하는 함수
- MySQL에서는 지원하지 않는다

##### PERCENT_RANK

- 해당 파티션의 맨위 값이 0, 맨 아래 값이 1이 되도록 0~1 사이의 값을 반환하는 함수
- MySQL에서는 지원하지 않는다

##### CUME_DIST

- 해당 파티션에서 누적 백분율을 구하는 함수
- MySQL에서는 지원하지 않는다

##### NTILE

- 주어진 수만큼 행들을 n등분한 후 현재 행에 해당하는 등급을 구하는 함수
