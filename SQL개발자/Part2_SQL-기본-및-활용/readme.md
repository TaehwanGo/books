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
