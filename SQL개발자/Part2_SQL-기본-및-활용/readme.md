# Part2. SQL 기본 및 활용

## 1. SQL 기본

### 1. 관계형 데이터베이스 개요

### 2. SELECT 문

#### (1) SELECT

> SELECT 컬럼1, 컬럼2, ... FROM 테이블 WHERE 컬럼1 = '아무개';

```sql
SELECT BAND.BAND_NAME, BAND_MEMBER.MEMBER_NAME
FROM BAND, BAND_MEMBER
WHERE BAND.BAND_CODE = BAND_MEMBER.BAND_CODE;
```

```sql
SELECT B.BAND_NAME, BM.MEMBER_NAME
FROM BAND B, BAND_MEMBER BM
WHERE B.BAND_CODE = BM.BAND_CODE;
```

- 별칭(Alias)
  - 테이블명이나 컬럼명에 별도의 별칭(Alias)을 붙여 줄 수 있는데, 목적은 줄임말을 쓰는 이유와 비슷하다
  - 여러 개의 테이블을 JOIN하거나 서브쿼리가 있을 때 컬럼명 앞에 테이블명을 같이 명시해야 하는 경우 테이블명은 비교적 길기 때문에 짧게 줄여 쓰기 위해 Alias를 붙여주는 것이다
  - 테이블명에 Alias를 설정하면 테이블명 대신 Alias를 사용해야 한다

#### (2) 산술 연산자

| 연산자 |               의미               | 우선순위 |
| :----: | :------------------------------: | :------: |
|  `()`  | 괄호로 우선순위를 조정할 수 있음 |    1     |
|  `*`   |               곱셈               |    2     |
|  `/`   |              나눗셈              |    2     |
|  `+`   |               덧셈               |    3     |
|  `-`   |               뺄셈               |    3     |

#### (3) 합성 연산자

- 문자와 문자를 연결할 때 사용하는 연산자이다

| COL1 |   COL2   |
| :--: | :------: |
| 나는 | 합격한다 |

```sql
SELECT COL1 || ' ' || 'SQLD' || ' ' ||COL2 AS RESULT FROM SAMPLE;
```

- 결과: 나는 SQLD 합격한다

### 3. 함수

#### (1) 문자 함수

##### CHR(ASCII 코드)

- ASCII 코드를 인수로 입력했을 때 매핑되는 문자가 무엇인지를 알려주는 함수이다
- MySQL에서는 CHAR() 함수를 사용한다
- e.g. CHR(65) -> A

##### LOWER(문자열)

- 문자열을 소문자로 변환해주는 함수이다
- e.g. LOWER('SQLD') -> sqld

##### UPPER(문자열)

- 문자열을 대문자로 변환해주는 함수이다
- e.g. UPPER('sqld') -> SQLD

##### LTRIM(문자열[,특정문자])

- [,특정문자]는 생략 가능하다
- 특정문자를 따로 명시해주지 않으면 문자열의 왼쪽 공백을 제거하고,
  - 명시해주었을 경우 문장열을 왼쪽부터 한 글자씩 특정문자와 비교하여 특정문자에 포함되어 있으면 제거하고
  - 특정문자에 포함되어 있지 않으면 그 뒤의 문자열은 모두 출력한다
- e.g.
  - LTRIM(' SQLD') -> SQLD
  - LTRIM(' SQLD', 'S') -> QLD

##### RTRIM(문자열[,특정문자])

- [,특정문자]는 생략 가능하다
- 특정문자를 따로 명시해주지 않으면 문자열의 오른쪽 공백을 제거하고,
  - 명시해주었을 경우 문장열을 오른쪽부터 한 글자씩 특정문자와 비교하여 특정문자에 포함되어 있으면 제거하고
  - 특정문자에 포함되어 있지 않으면 그 앞의 문자열은 모두 출력한다
- e.g.
  - RTRIM('SQLD ') -> SQLD
  - RTRIM('SQLD ', 'D') -> SQL

##### Level up test1

- SELECT RTRIM(LTRIM(' SQ L D ')) FROM DUAL;
- 결과: SQ L D
- 해설: LTRIM 함수를 먼저 실행하면 왼쪽 공백이 제거되고, RTRIM 함수를 실행하면 오른쪽 공백이 제거되어 결과는 SQ L D가 된다

##### Level up test2

- SELECT RTRIM(LTRIM('SQL DEVELOPER', 'S'), 'SQL') FROM DUAL;
- 결과: QL DEVELOPER
- 해설: LTRIM으로 'S'만 지워진다. RTRIM으로 오른쪽부터 'SQL'이라는 문자열을 찾지만 없기 때문에 진행을 멈춘다

##### TRIM(`[위치][특정문자][FROM]문자열`)

- []는 옵션
- 옵션이 하나도 없을 경우 : 왼쪽과 오른쪽 공백을 제거
- 옵션이 있는 경우 : 문자열을 위치로 지정된 곳부터 한 글자씩 문자와 비교하여 같으면 제거, 같지 않으면 출력
  - LTRIM, RTRIM과 달리 특정문자는 한 글자만 지정할 수 있다
- MySQL의 경우 공백제거만 가능하다
- e.g.
  - TRIM(' JENNIE ') -> JENNIE
  - TRIM(LEADING '블' FROM '블랙핑크') -> 랙핑크
  - TRIM(TRAILING '크' FROM '블랙핑크') -> 블랙핑

##### SUBSTR(문자열, 시작점[,길이])

- []는 옵션
- 문자열의 원하는 부분만 잘라서 반환해주는 함수이다
- 길이를 명시하지 않았을 경우 문자열의 시작점부터 문자열의 끝까지 반환된다
- MySQL의 경우 SUBSTRING() 함수를 사용한다
- e.g.
  - SUBSTR('블랙핑크제니', 3, 2) -> 핑크
  - SUBSTR('블랙핑크제니', 3, 4) -> 핑크제니
  - SUBSTR('블랙핑크제니', 3) -> 핑크제니

##### LENGTH(문자열)

- 문자열의 길이를 반환해주는 함수이다
- MySQL의 경우 LEN() 함수를 사용한다
- e.g.
  - LENGTH('JENNIE') -> 6
  - LENGTH('블랙핑크') -> 4

##### Levelup test

|  COL1  |   COL2    |
| :----: | :-------: |
| ORACLE | DATABASE  |
|  SQL   | DEVELOPER |

```sql
SELECT LENGTH(RTRIM(COL1, 'LE')) + LENGTH(LTRIM(COL2, 'DE')) AS RESULT FROM SAMPLE;
```

- 결과

| RESULT |
| :----: |
|   11   |
|   9    |

- RTRIM(COL1, 'LE')이 두 번째 줄에 적용될 때, SQL에서 L은 같아서 사라지지만 E는 다르므로 멈춘다

| RTRIM(COL1, 'LE') | LTRIM(COL2, 'DE') |
| :---------------: | :---------------: |
|       ORACL       |      ATABAS       |
|        SQ         |      VLOPER       |

##### REPLACE(문자열, 찾을문자열, 바꿀문자열)

- 문자열에서 찾을 문자열을 바꿀 문자열로 바꾸어주는 함수이다
- 바꿀 문자열을 생략하면 찾을 문자열을 모두 제거한다

```sql
SELECT REPLACE('블랙핑크제니', '제니', '지수') FROM DUAL;
```

- 결과: 블랙핑크지수

```sql
SELECT REPLACE('블랙핑크제니', '제니') FROM DUAL;
```

- 결과: 블랙핑크

#### (2) 숫자 함수

##### ABS(숫자)

- 숫자의 절대값을 반환해주는 함수이다

```sql
SELECT ABS(-10) FROM DUAL;
```

##### SIGN(숫자)

- 숫자가 양수이면 1, 음수이면 -1, 0이면 0을 반환해주는 함수이다

##### ROUND(숫자[,자릿수])

- []는 옵션
- 자릿수를 명시하지 않으면 소수점 첫째 자리에서 반올림한다
- 자릿수를 명시하면 소수점 n번째 자리에서 반올림한다

##### TRUNC(숫자[,자릿수])

- []는 옵션
- 자릿수를 명시하지 않으면 소수점을 버린다
- 자릿수를 명시하면 소수점 n번째 자리에서 버림한다

##### CEIL(숫자)

- 숫자보다 크거나 같은 정수 중 가장 작은 정수를 반환해주는 함수이다(올림)

##### FLOOR(숫자)

- 숫자보다 작거나 같은 정수 중 가장 큰 정수를 반환해주는 함수이다(버림)
- e.g.
  - FLOOR(3.14) -> 3
  - FLOOR(-3.14) -> -4

##### MOD(숫자1, 숫자2)

- 숫자1을 숫자2로 나눈 나머지를 반환해주는 함수이다
- e.g.
  - MOD(10, 3) -> 1
  - MOD(15, -4) -> 3
  - MOD(-15, -4) -> -3

#### (3) 날짜 함수

##### SYSDATE

- 현재 시스템의 날짜와 시간을 반환해주는 함수이다
- MySQL의 경우 GETDATE() 함수를 사용한다
- e.g.
  - SYSDATE -> 2021-08-01 15:00:00

##### EXTRACT(단위 FROM 날짜)

- 날짜에서 원하는 단위(YEAR, MONTH, DAY, HOUR, MINUTE, SECOND)의 값을 추출해주는 함수이다
- e.g.
  - EXTRACT(YEAR FROM SYSDATE) -> 2021
  - EXTRACT(MONTH FROM SYSDATE) -> 8
  - EXTRACT(DAY FROM SYSDATE) -> 1
  - EXTRACT(HOUR FROM SYSDATE) -> 15

##### ADD_MONTHS(날짜, 개월수)

- 날짜에 개월수만큼 더한 날짜를 반환해주는 함수이다
- e.g.
  - ADD_MONTHS(SYSDATE, 1) -> 2021-09-01 15:00:00

#### (4) 변환 함수

- 명시적 형변환 : 변환 함수를 사용하여 데이터 유형 변환을 명시적으로 나타냄
- 암시적 형변환 : 데이터베이스가 내부적으로 알아서 데이터 유형을 변환함
  - 암시적 형변환이 가능해도 성능저하나 에러를 뱉는 경우도 있기 때문에 명시적 형변환을 사용하는 것이 좋다

##### TO_NUMBER(문자열)

- 문자열을 숫자로 변환해주는 함수이다
- e.g.
  - TO_NUMBER('123') -> 123
  - TO_NUMBER('123.45') -> 123.45
  - TO_NUMBER('123.45.67') -> 에러

##### TO_CHAR(숫자or날짜[,포맷])

- 숫자나 날짜형의 데이터를 포맷 형식의 문자형으로 변환해주는 함수이다
- e.g.
  - TO_CHAR(123.45) -> '123.45'
  - TO_CHAR(SYSDATE, 'YYYYMMDD HH24MISS') -> '20210801 150000'

##### TO_DATE(문자열, 포맷)

- 포맷 형식의 문자형의 데이터를 날짜형으로 변환해주는 함수이다
- e.g.
  - TO_DATE('20210801', 'YYYYMMDD') -> 2021-08-01

#### (5) NULL 관련 함수

##### NVL(컬럼, 대체값)

- 컬럼의 값이 NULL이면 대체값을 반환해주는 함수이다
- e.g.
  - NVL(NULL, '대체값') -> 대체값
  - NVL('원래값', '대체값') -> 원래값

##### NULLIF(인수1, 인수2)

- 인수1과 인수2가 같으면 NULL을 반환하고, 다르면 인수1을 반환하는 함수이다
- e.g.
  - NULLIF(REVIEW_SCORE, 0) : REVIEW_SCORE 데이터가 0일 경우 NULL을 반환하고 0이 아닐 경우 REVIEW_SCORE를 반환한다

##### COALESCE(인수1, 인수2, ...)

- NULL이 아닌 최초의 인수를 반환해주는 함수이다
- e.g.
  - COALESCE(NULL, NULL, '대체값') -> 대체값
  - COALESCE(NULL, '대체값1', '원래값') -> 대체값1

#### (4) CASE

- ~ 이면 ~이고, ~이면 ~이다

```sql
CASE WHEN 조건1 THEN 결과1
     WHEN 조건2 THEN 결과2
     ELSE 결과3
END
```

##### Level up test

| COL1 |  COL2  |
| :--: | :----: |
|  가  | 가나다 |
|  2   |  123   |
|  C   |  ABC   |

```sql
SELECT CASE WHEN COL1 = 'C' THEN SUBSTR(COL2,2,1)
            WHEN COL1 = '가' THEN 'C'
            WHEN COL1 = '1' THEN '10'
            ELSE 'B'
       END AS RESULT
FROM SAMPLE;
```

- 결과

| RESULT |
| :----: |
|   C    |
|   B    |
|   B    |

### 4. WHERE 절

- INSERT를 제외한 DML문을 수행할 때 원하는 데이터만 골라 수행할 수 있도록 해주는 구문이다
  - DML문이란? 데이터 조작어(Data Manipulation Language)로 데이터를 조작하기 위해 사용하는 언어

#### 예시

- SELECT 컬럼명1, 컬럼명2, ... FROM 테이블명 WHERE 조건절;

```sql
SELECT * FROM ENTERTAINER WHERE NAME='이지은';
```

- UPDATE 테이블명 SET 컬럼명=새로운데이터 WHERE 조건절;

```sql
UPDATE ENTERTAINER SET AGENCY_NAME = '빅히트뮤직' WHERE NAME = '김태형';
```

- DELETE FROM 테이블명 WHERE 조건절;

```sql
DELETE FROM ENTERTAINER WHERE JOB = '배우';
```

#### (1) 비교 연산자

| 연산자 |    의미     |      예시       |
| :----: | :---------: | :-------------: |
|   =    |    같음     | WHERE COL = 10  |
|   <    |    작음     | WHERE COL < 10  |
|   <=   | 작거나 같음 | WHERE COL <= 10 |
|   >    |     큼      | WHERE COL > 10  |
|   >=   | 크거나 같음 | WHERE COL >= 10 |

- 다음 쿼리는 CITY가 Paris인 행을 조회한다

```sql
SELECT FIRST_NAME, LAST_NAME, CITY FROM MEMBER WHERE CITY = 'Paris';
```

- 다음 쿼리는 MEMBER_NO가 10보다 작은 행을 조회한다

```sql
SELECT MEMBER_NO, FIRST_NAME, LAST_NAME
FROM MEMBER
WHERE MEMBER_NO < 10;
```

- 다음 쿼리는 FIRST_NAME과 Mark의 데이터 타입이 맞지 않아 에러가 발생한다

```sql
SELECT FIRST_NAME, LAST_NAME, EMAIL
FROM MEMBER
WHERE FIRST_NAME = Mark; -- 에러 : 문자열은 ''로 감싸야 한다 => WHERE FIRST_NAME = 'Mark';
```

#### (2) 부정 비교 연산자

|    연산자    |          의미          |        예시        |
| :----------: | :--------------------: | :----------------: |
|      !=      |       같지 않음        |  WHERE COL != 10   |
|      ^=      |       같지 않음        |  WHERE COL ^= 10   |
|      <>      |       같지 않음        |  WHERE COL <> 10   |
| not 컬럼명 = |       같지 않음        | WHERE NOT COL = 10 |
| not 컬럼명 > | 크지 않음(작거나 같음) | WHERE NOT COL > 10 |

- 다음 쿼리는 FAVORITES이 Y가 아닌 행을 조회한다

```sql
SELECT PLAY_ID, NAME, FAVORITES
FROM PLAY_LIST
WHERE FAVORITES <> 'Y';
```

#### (3) SQL 연산자

|       연산자       |            의미            |            예시             |
| :----------------: | :------------------------: | :-------------------------: |
|  BETWEEN A AND B   | A와 B 사이의 값(A, B 포함) | WHERE COL BETWEEN 10 AND 20 |
| LIKE '비교 문자열' |     비교 문자열을 포함     |   WHERE COL LIKE '방탄%'    |
|                    |                            |  WHERE COL LIKE '%소년단'   |
|                    |                            |  WHERE COL LIKE '%탄소년%'  |
|                    |                            |  WHERE COL LIKE '방\_소%'   |
|      IN(LIST)      |    LIST 중 하나와 일치     |  WHERE COL IN(10, 20, 30)   |
|      IS NULL       |      NULL인 행을 조회      |      WHERE COL IS NULL      |

- 다음 쿼리는 PLAY_ID가 1이상 5이하인 행을 조회한다

```sql
SELECT PLAY_ID, NAME, FAVORITES
FROM PLAY_LIST
WHERE PLAY_ID BETWEEN 1 AND 5;
```

- 위 쿼리는 다음과 같이 표현할 수도 있다

```sql
SELECT PLAY_ID, NAME, FAVORITES
FROM PLAY_LIST
WHERE PLAY_ID >= 1 AND PLAY_ID <= 5;
```

- 다음 쿼리는 NAME이 Classical로 시작되는 행을 조회한다

```sql
SELECT PLAY_ID, NAME, FAVORITES
FROM PLAY_LIST
WHERE NAME LIKE 'Classical%';
```

- 다음 쿼리는 NAME이 Music으로 끝나는 행을 조회한다

```sql
SELECT PLAY_ID, NAME, FAVORITES
FROM PLAY_LIST
WHERE NAME LIKE '%Music';
```

- 다음 쿼리는 NAME이 M으로 시작하고 s로 끝나는 행을 조회한다

```sql
SELECT PLAY_ID, NAME, FAVORITES
FROM PLAY_LIST
WHERE NAME LIKE 'M%s';
```

- 다음 쿼리는 NAME에 101이 포함된 행을 조회한다

```sql
SELECT PLAY_ID, NAME, FAVORITES
FROM PLAY_LIST
WHERE NAME LIKE '%101%';
```

- 다음 쿼리는 TITLE이 IT Staff이거나 IT Manager인 행을 조회한다

```sql
SELECT LAST_NAME, FIRST_NAME, TITLE
FROM EMPLOYEE
WHERE TITLE IN('IT Staff', 'IT Manager');
```

- 위 쿼리는 다음과 같이 표현할 수도 있다

```sql
SELECT LAST_NAME, FIRST_NAME, TITLE
FROM EMPLOYEE
WHERE (TITLE = 'IT Staff' OR TITLE = 'IT Manager');
```

- 다음 쿼리는 COMPANY가 NULL인 행을 조회한다

```sql
SELECT COMPANY, LAST_NAME, FIRST_NAME
FROM EMPLOYEE
WHERE COMPANY IS NULL;
```

#### (4) 부정 SQL 연산자

|     연산자      |                 의미                  |              예시               |
| :-------------: | :-----------------------------------: | :-----------------------------: |
| NOT BETWEEN A B | A와 B 사이의 값이 아닌 값(A,B 미포함) | WHERE COL NOT BETWEEN 10 AND 20 |
|  NOT IN (LIST)  |      LIST 중 일치하는 것이 없음       |   WHERE COL NOT IN (1, 3, 5)    |
|   IS NOT NULL   |             NULL값이 아님             |      WHERE COL IS NOT NULL      |

- 다음 쿼리는 PLAY_ID가 1이상, 5이하가 아닌 행을 조회한다

```sql
SELECT PLAY_ID, NAME, FAVORITES
FROM PLAY_LIST
WHERE PLAY_ID NOT BETWEEN 1 AND 5;
```

- 위 쿼리는 다음과 같이 표현할 수도 있다

```sql
SELECT PLAY_ID, NAME, FAVORITES
FROM PLAY_LIST
WHERE PLAY_ID < 1 OR PLAY_ID > 5;

SELECT PLAY_ID, NAME, FAVORITES
FROM PLAY_LIST
WHERE NOT(PLAY_ID BETWEEN 1 AND 5);

SELECT PLAY_ID, NAME, FAVORITES
FROM PLAY_LIST
WHERE NOT (PLAY_ID BETWEEN 1 AND 5);
```

- 다음 쿼리는 TITLE이 IT Staff와 IT Manager가 아닌 행을 조회한다

```sql
SELECT LAST_NAME, FIRST_NAME, TITLE
FROM EMPLOYEE
WHERE TITLE NOT IN('IT Staff', 'IT Manager');
```

- 위 쿼리는 다음과 같이 표현할 수도 있다

```sql
SELECT LAST_NAME, FIRST_NAME, TITLE
FROM EMPLOYEE
WHERE (TITLE <> 'IT Staff' AND TITLE <> 'IT Manager');

SELECT LAST_NAME, FIRST_NAME, TITLE
FROM EMPLOYEE
WHERE NOT(TITLE = 'IT Staff' OR TITLE = 'IT Manager');

SELECT LAST_NAME, FIRST_NAME, TITLE
FROM EMPLOYEE
WHERE NOT (TITLE IN ('IT Staff', 'IT Manager'));
```

- 다음 쿼리는 COMPANY가 NULL이 아닌 행을 조회한다

```sql
SELECT FIRST_NAME, LAST_NAME, COMPANY
FROM MEMBER
WHERE COMPANY IS NOT NULL;
```

#### (5) 논리 연산자

| 연산자 |              의미              |             예시              |
| :----: | :----------------------------: | :---------------------------: |
|  AND   |    모든 조건이 TRUE여야 함     | WHERE COL1 = 10 AND COL2 = 20 |
|   OR   | 하나 이상의 조건이 TRUE여야 함 | WHERE COL1 = 10 OR COL2 = 20  |
|  NOT   |   TRUE면 FALSE, FALSE면 TRUE   |      WHERE NOT COL1 > 10      |

- 논리 연산자는 처리 순서가 존재

  - () > NOT > AND > OR

- 다음 쿼리는 TITLE이 Sale Support Agent이고 CITY가 Calgary인 행을 조회한다

```sql
SELECT LAST_NAME, FIRST_NAME, TITLE, CITY
FROM EMPLOYEE
WHERE TITLE = 'Sale Support Agent' AND CITY = 'Calgary';
```

- 다음 쿼리는 TITLE이 Sale Support Agent이거나 CITY가 Calgary인 행을 조회한다

```sql
SELECT LAST_NAME, FIRST_NAME, TITLE, CITY
FROM EMPLOYEE
WHERE TITLE = 'Sale Support Agent' OR CITY = 'Calgary';
```

### 5. GROUP BY, HAVING 절

```sql
SELECT PRODUCT_CODE, COUNT(ORDER_CNT) AS ORDER_CNT
FROM ORDER_PRODUCT
WHERE ORDER_DATE BETWEEN '20231101' AND '20231130'
GROUP BY PRODUCT_CODE
HAVING COUNT(ORDER_CNT) >= 1000;
```

#### (1) GROUP BY

- 그룹별로 묶을 수 있도록 해주는 절
- GROUP BY 뒤에는 그루핑의 기준이 되는 컬럼이 온다
  - 컬럼은 하나 이상 올 수 있다

#### (2) 집계 함수

|         함수         | 의미                                                    |
| :------------------: | ------------------------------------------------------- |
|      COUNT(\*)       | 전체 ROW를 count하여 반환                               |
|     COUNT(컬럼)      | 컬럼값이 NULL이 아닌 ROW를 count하여 반환               |
| COUNT(DISTINCT 컬럼) | 컬럼값이 NULL이 아닌 ROW에서 중복을 제거한 Count를 반환 |
|      SUM(컬럼)       | 컬럼값이 NULL이 아닌 ROW의 합을 반환                    |
|      AVG(컬럼)       | 컬럼값이 NULL이 아닌 ROW의 평균을 반환                  |
|      MAX(컬럼)       | 컬럼값이 NULL이 아닌 ROW의 최대값을 반환                |
|      MIN(컬럼)       | 컬럼값이 NULL이 아닌 ROW의 최소값을 반환                |

#### (3) HAVING

- HAVING절은 GROUP BY 절을 사용할 때 WHERE 절처럼 사용하는 조건절
- 주로 데이터를 그루핑한 후 특정 그룹을 골라낼 때 사용한다

```sql
-- SELECT문의 논리적 수행 순서
SELECT -- 5
FROM -- 1
WHERE -- 2
GROUP BY -- 3
HAVING -- 4
ORDER BY -- 6
```

```sql
SELECT PRODUCT_CODE, COUNT(ORDER_CNT) AS ORDER_CNT
FROM ORDER_PRODUCT
WHERE ORDER_DATE BETWEEN '20231101' AND '20231130'
GROUP BY PRODUCT_CODE
HAVING COUNT(ORDER_CNT) >= 1000;
```

- 2023년 11월 한 달 동안의 판매 데이터를 상품 코드로 그룹핑해서
  COUNT를 구하면 상품별 판매량이 나온다
  - HAVING 절을 이용하여 한 달간 1000개 이상 팔린 상품만 출력할 수 있다
- 또한 HAVING절은 논리적으로 SELECT절 전에 수행되기 때문에 SELECT 절에 명시되지 않은 집계 함수로도 조건을 부여하는 것이 가능하다
- 주의할 점은 WHERE절을 사용해도 되는 조건까지 HAVING절로 써버리면 성능상 불리할 수 있다
  - 왜냐하면 WHERE절에서 필터링이 선행되어야 GROUP BY할 데이터량이 줄어들기 때문이다
- GROUP BY는 비교적 많은 비용이 드는 작업이므로 수행 전에 데이터량을 최소로 줄여놓는 것이 바람직하다
- GROUP BY로 묶으면서 생성한 그룹은 SELECT절에서 명시한다

### 6. ORDER BY 절

#### (1) ORDER BY

- ORDER BY 절은 SELECT문에서 논리적으로 맨 마지막에 수행된다

```sql
-- SELECT문의 논리적 수행 순서
SELECT -- 5
FROM -- 1
WHERE -- 2
GROUP BY -- 3
HAVING -- 4
ORDER BY -- 6
```

- ORDER BY 절을 사용하여 SELECT한 데이터를 정렬할 수 있다
- ORDER BY 절을 따로 병시하지 않으면 데이터는 임의의 순서대로 출력된다
- 옵션
  - ASC : 오름차순 정렬(옵션생략 시 기본값)
  - DESC : 내림차순 정렬

```sql
SELECT NAME, MEMBER_NO FROM MEMBERINFO ORDER BY NAME;
```

|  NAME  | MEMBER_NO |
| :----: | :-------: |
| 강카타 |     4     |
| 김가나 |     1     |
| 박다라 |     2     |
| 한사아 |     3     |

```sql
SELECT NAME, MEMBER_NO FROM MEMBERINFO ORDER BY NAME DESC;
```

|  NAME  | MEMBER_NO |
| :----: | :-------: |
| 한사아 |     3     |
| 박다라 |     2     |
| 김가나 |     1     |
| 강카타 |     4     |

### 7. JOIN

#### (1) JOIN이란?

- 일상에서 의미 : 각기 다른 두 개의 집단이 합해질 때 주로 사용하는 단어
- 데이터베이스 조인 : 각기 다른 테이블을 한 번에 보여줄 때 쓰는 쿼리
- 실무에서 80% 이상의 쿼리가 조인을 사용한다

#### (2) EQUI JOIN

- Equal(=) 조건으로 JOIN하는 것, 가장 흔히 볼 수 있는 JOIN방식
- e.g. 한 쇼핑몰에서 sqlchild라는 아이디를 가진 사람이 온라인으로 마우스를 구매하고 리뷰를 작성
  - 마우스는 상품 테이블의 데이터, 리뷰는 리뷰 테이블의 데이터

```sql
SELECT A.PRODUCT_CODE,
       A.PRODUCT_NAME,
       B.MEMBER_ID,
       B.CONTENT,
       B.REG_DATE
FROM PRODUCT A, REVIEW B
WHERE A.PRODUCT_CODE = B.PRODUCT_CODE
AND B.MEMBER_ID = 'sqlchild'
AND A.PRODUCT_CODE = 'P0001'; -- 상품코드가 P0001인 상품의 리뷰를 작성한 사람의 리뷰를 조회
```

#### (3) Non EQUI JOIN

- Equal(=) 조건이 아닌 조건으로 JOIN하는 것
  - BETWEEN, LIKE, >, <, >=, <= 등
- e.g. 이벤트 기간 동안 리뷰를 작성한 고객에게 사은품을 주는 행사
  - 리뷰 테이블과 이벤트 테이블이 JOIN되어야 한다

```sql
SELECT A.EVENT_NAME,
       B.MEMBER_ID,
       B.CONTENT,
       B.REG_DATE
FROM EVENT A, REVIEW B
WHERE B.REG_DATE BETWEEN A.START_DATE AND A.END_DATE;
```
