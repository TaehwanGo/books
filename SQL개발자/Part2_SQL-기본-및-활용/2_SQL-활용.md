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
