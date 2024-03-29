# 소프트웨어 아키텍처 101(Fundamentals of Software Architecture)

- 엔지니어링 접근 방식으로 배우는 소프트웨어 아키텍처 기초

## 저자

- 마크 리처즈(Mark Richards)
- 닐 포드(Neal Ford)

## 목차(Contents)

- 서문

#### Chapter 1. 서론

- 1.1 소프트웨어 아키텍처란?
- 1.2 아키텍트에 대한 기대치
- 1.3 아키텍처의 교차점 그리고...
- 1.4 소프트웨어 아키텍처 법칙

### Part 1. 기초

#### Chapter 2. 아키텍처 사고

- 2.1 아키텍처 대 설계
- 2.2 기술 폭
- 2.3 트레이드오프 분석
- 2.4 비즈니스 동인의 이해
- 2.5 아키텍처와 코딩 실무 간 균형 맞추기

#### Chapter 3. 모듈성

- 3.1 정의
- 3.2 모듈성 측정
- 3.3 모듈에서 컴포넌트로

#### Chapter 4. 아키텍처 특성 정의

- 4.1 아키텍처 특성 (일부) 목록
- 4.2 트레이드오프 및 나쁜 것 중에서 제일 나은 아키텍처

#### Chapter 5. 아키텍처 특성 식별

- 5.1 도메인 관심사에서 아키텍처 특성 도출
- 5.2 요구사항에서 아키텍처 특성 도출
- 5.3 사례 연구: 실리콘 샌드위치

#### Chapter 6. 아키텍처 특성의 측정 및 거버넌스

- 6.1 아키텍처 특성 측정
- 6.2 거버넌스와 피트니스 함수

#### Chapter 7. 아키텍처 특성 범위

- 7.1 커플링과 커네이선스
- 7.2 아키텍처 퀀텀과 세분도

#### Chapter 8. 컴포넌트 기반 사고

- 8.1 컴포넌트 범위
- 8.2 아키텍트 역할
- 8.3 개발자 역할
- 8.4 컴포넌트 식별 흐름
- 8.5 컴포넌트 세분도
- 8.6 컴포넌트 설계
- 8.7 컴포넌트 발굴 사례 연구: GGG
- 8.8 아키텍처 퀀텀 딜레마: 모놀리식이냐, 분산 아키텍처냐

### Part 2. 아키텍처 스타일

#### Chapter 9. 기초

- 9.1 기초 패턴
- 9.2 모놀리식 대 분산 아키텍처

#### Chapter 10. 레이어드 아키텍처 스타일

- 10.1 토폴로지
- 10.2 레이어 격리
- 10.3 레이어 추가
- 10.4 기타 고려 사항
- 10.5 왜 이 아키텍처 스타일을 사용하는가
- 10.6 아키텍처 특성 등급

#### Chapter 11. 파이프 라인 아키텍처 스타일

- 11.1 토폴로지(topology) : 컴퓨터 네트워크의 요소들(링크, 노드 등)을 물리적으로 연결해 놓은 것, 또는 그 연결 방식
- 11.2 예제
- 11.3 아키텍처 특성 등급

#### Chapter 12. 마이크로커널 아키텍처 스타일

- 12.1 토폴로지
- 12.2 레지스트리
- 12.3 계약
- 12.4 실제 용례
- 12.5 아키텍처 특성 등급

#### Chapter 13. 서비스 기반 아키텍처 스타일

- 13.1 토폴로지
- 13.2 포톨로지 변형
- 13.3 서비스 설계 및 세분도
- 13.4 데이터베이스 분할
- 13.5 아키텍처 예시
- 13.6 아키텍처 특성 등급
- 13.7 언제 이 아키텍처 스타일을 사용하는가

#### Chapter 14. 이벤트 기반 아키텍처 스타일

- 14.1 토폴로지
- 14.2 브로커 토폴로지
- 14.3 중재자 토폴로지
- 14.4 비동기 통신
- 14.5 에러 처리
- 14.6 데이터 소실 방지
- 14.7 브로드 캐스팅
- 14.8 요청-응답
- 14.9 요청 기반이냐, 이벤트 기반이냐
- 14.10 하이브리드 이벤트 기반 아키텍처
- 14.11 아키텍처 특성 등급

#### Chapter 15. 공간 기반 아키텍처 스타일

- 15.1 토폴로지
- 15.2 데이터 충돌
- 15.3 클라우드 대 온프레미스 구현
- 15.4 복제 캐시 대 분산 캐시
- 15.5 니어 캐시
- 15.6 구현 예시
- 15.7 아키텍처 특성 등급

#### Chapter 16. 오케스트레이션 기반 서비스 지향 아키텍처 스타일

- 16.1 역사와 철학
- 16.2 토폴로지
- 16.3 택소노미
- 16.4 재사용... 그리고 커플링
- 16.5 아키텍처 특성 등급

#### Chapter 17. 마이크로서비스 아키텍처 스타일

- 17.1 역사
- 17.2 토폴로지
- 17.3 분산
- 17.4 경계 콘텍스트
- 17.5 API 레이어
- 17.6 운영 재사용
- 17.7 프런트엔드
- 17.8 통신
- 17.9 아키텍처 특성 등급
- 17.10 더 읽을 거리

#### Chapter 18. 최적의 아키텍처 스타일 선정

- 18.1 아키텍처 '유행'은 계속 변한다
- 18.2 결정 기준
- 18.3 모놀리스 사례 연구: 실리콘 샌드위치
- 18.4 분산 아키텍처 사례 연구: GGG

### Part 3. 테크닉과 소프트 스킬

#### Chapter 19. 아키텍처 결정

- 19.1 아키텍처 결정 안티패턴
- 19.2 아키텍처적으로 중요한
- 19.3 아키텍처 결정 레코드

#### Chapter 20. 아키텍처 리스크 분석

- 20.1 리스크 매트릭스
- 20.2 리스크 평가
- 20.3 리스크 스토밍
- 20.4 애자일 스토리 리스크 분석
- 20.5 리스크 스토밍 예시

#### Chapter 21. 아키텍처 도식화 및 프레젠테이션

- 21.1 도식화
- 21.2 프레젠테이션

#### Chapter 22. 개발팀을 효율적으로

- 22.1 팀 경계
- 22.2 아키텍트 성향
- 22.3 얼마나 제어해야 하나?
- 22.4 팀의 이상 징후
- 22.5 체크리스트 활용
- 22.6 지침 제시
- 22.7 마치며

#### Chapter 23. 협상과 리더십 스킬

- 23.1 협상과 조정
- 23.2 소프트웨어 아키텍트는 리더다
- 23.3 개발팀과의 융합
- 23.4 마치며

#### Chapter 24. 커리어패스 개발

- 24.1 20분 규칙
- 24.2 개인 레이더 개발
- 24.3 소셜 미디어 활용
- 24.4 종언
