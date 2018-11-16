# 청출어람 : 2018 JEJU Blockchain Hackaton - Server

### 1. 프로젝트 소개

- 블록체인 기반의 온/오프라인 귀농교육 플랫폼

### 2. 전체 아키텍쳐

![architecture](./uploads/architecture.jpg)

### 3. 청출어람 프로젝트에서 서버백앤드가 갖는 의미와 역할

- DApp의 경우 서비스 이용에서 사용자들에게 가스비와 속도에 대한 불편함이 발생함
- 이를 해소하기 위한 방안으로 블록에 최소한의 데이터를 기록하여 가스비 소모를 최소화하고, 그 외의 데이터를 보관을 서버(DB)가 부담하도록 하여 프론트에서 보여주는 데이터 호출 속도를 개선시키기 위함
- 모바일(iOS) 과 Web이라는 두 가지 플랫폼이 klaytn 네트워크에 참여할 수 있도록 PROXY 서버와 같은 역할(사용자 등록, 어드민계정(back-office) 관리 등)

### 4. API 문서와 소개

- [클라이언트와 공유한 API 문서 중 일부 소개]

* 회원가입

  - 강사(농부) - WEB 와 수강생 - mobile의 계정으로 나누어 회원가입을 진행
  - mobile의 경우 키스토어 파일 내용을 받아 API서버에서 Network서버로 넘기면 Network서버의 API에서 .json파일로 dd/keystore에 키스토어 파일 생성하여 사용자 등록 후 정상 응답을 받은 API서버에서 나머지 사용자 정보 DB 저장

* 강의등록

  - 강사 계정으로 트랜잭션을 수행하여 블록에 강의 정보를 등록 후 lectureIDs의 index 값을 고유키로 받아 강의 정보와 커리큘럼을 DB에 저장, DB트랜잭션 관리

* 강의신청

  - 수강생이 강의 신청 트랜잭션을 수행하여 강의료를 지불 후 API를 호출하여 해당 강의의 수강인원 증가 및 수강생 수강,구매 이력 관리

* 강의평가

  - 수료기준을 만족한 수강생에 한하여 강의평가 자격이 주어지도록 권한부여 및 평가 완료 강의 상태 관리

* 강의료지급

  - 어드민 계정에 한하여 권한 확인 후 평점에 맞는 강의료와 수수료가 분배되는 트랜잭션 수행

### 5. 모바일, 웹 두 가지 플랫폼에 대한 대응

- 사용자 등록
  - 모바일 : 키스토어 파일 등록
  - 웹 : Private Key 등록 (구현 중)

### 6. Admin 계정의 역할, 흐름

- 강사가 강의등록 -> 수강생 강의신청 -> 강사 출석관리 -> 강의 종료 -> 수료기준 만족 시 강의평가 진행 ->
  ** 어드민 계정의 경우 평점에 따른 수익 분배 진행 **

### 7. 발생 이슈
