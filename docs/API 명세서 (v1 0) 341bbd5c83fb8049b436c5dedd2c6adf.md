# API 명세서 (v1.0)

# 🗂️ 더치트립 (DutchTrip) API 명세서

본 문서는 더치트립(DutchTrip) 서비스의 프론트엔드-백엔드 간 원활한 데이터 통신을 위한 RESTful API 명세서입니다.

각 도메인별 핵심 비즈니스 로직과 데이터 흐름을 상세하게 정의하며, 클라이언트 개발 시 발생할 수 있는 예외 상황에 대한 가이드를 포함합니다.

## 📌 공통 사항 (Common Guidelines)

API 통신 시 기본적으로 지켜야 할 규약입니다.

- **Base URL:** `https://api.dutchtrip.duckdns.org/api` (대충 이걸로 확정)
- **인증 방식 (Authorization):** * 회원가입/로그인(`POST /auth/kakao`)을 제외한 **모든 API 요청**의 Header에는 발급받은 JWT를 포함해야 합니다.
    - Header Key: `Authorization`
    - Header Value: `Bearer {Access_Token}`
- **날짜 및 시간 포맷:** 글로벌 환경 및 시차 계산을 대비하여 모든 날짜/시간 데이터는 ISO 8601 표준 포맷(예: `YYYY-MM-DD` 또는 `YYYY-MM-DDThh:mm:ss`)을 사용합니다.
- **표준 응답 포맷 (공통 에러 처리):**
    - 정상 요청 처리 시 `200 OK` 또는 `201 Created`를 반환합니다.
    - 에러 발생 시 프론트엔드에서 사용자에게 즉각적인 피드백을 줄 수 있도록 통일된 에러 JSON 형식을 반환합니다.
    
    ```
    // 표준 에러 응답 예시 (HTTP 400 Bad Request)
    {
      "status": 400,
      "error_code": "INVALID_INPUT_VALUE",
      "message": "메뉴별 분담 금액의 합이 총 결제 금액(total_amount)과 일치하지 않습니다.",
      "timestamp": "2026-04-14T20:00:00"
    }
    ```
    

## 1. 👤 유저 및 인증 (Auth & User)

사용자 식별, 카카오 소셜 로그인 처리, 그리고 정산의 핵심인 개인 계좌 정보를 관리하는 API 그룹입니다.

### 1.1. 카카오 로그인 및 회원가입

- **Method:** `POST`
- **URL:** `/auth/kakao`
- **Description:** 클라이언트(앱)에서 카카오 SDK를 통해 획득한 Access Token을 서버로 전달합니다. 서버는 카카오 API를 호출해 유저 정보를 검증하고, 우리 서비스 전용 JWT를 발급합니다. DB에 없는 유저라면 자동으로 회원가입 처리됩니다.
- **Request Body:**
    
    ```
    {
      "kakao_access_token": "kakao_token_string..."
    }
    ```
    
- **Response (200 OK):**
    
    ```
    {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
      "user_id": 1,
      "nickname": "최서현",
      "is_new_user": false // true일 경우, 프론트엔드는 유저를 '계좌 정보 입력(온보딩) 화면'으로 유도해야 합니다.
    }
    ```
    

### 1.2. 내 프로필 및 계좌 정보 조회

- **Method:** `GET`
- **URL:** `/users/me`
- **Description:** 마이페이지 등에서 현재 로그인한 사용자의 정보를 조회합니다.
- **Response (200 OK):**
    
    ```
    {
      "user_id": 1,
      "email": "seohyun@kakao.com",
      "nickname": "최서현",
      "bank_name": "카카오뱅크",
      "account_number": "3333-12-1234567"
    }
    ```
    
- **Method:** `PUT`
- **URL:** `/users/me/bank-info`
    
    ### 1.3. 계좌 정보 등록 및 수정
    
- **Description:** 더치페이 결과 돈을 송금받을 계좌 정보를 업데이트합니다. 계좌 정보가 없으면 추후 정산 결과 화면에서 경고가 표시될 수 있습니다.
- **Request Body:**
    - `bank_name`은 "신한은행", "국민은행" 등 사전 정의된 문자열만 허용합니다.
    
    ```
    {
      "bank_name": "신한은행",
      "account_number": "110-123-456789"
    }
    ```
    
- **Response (200 OK):**
    
    ```
    {
      "status": 200,
      "message": "계좌 정보가 성공적으로 업데이트되었습니다."
    }
    ```
    

## 2. ✈️ 여행 방 (Trip)

여행 프로젝트를 관리하고, 동행자를 초대/관리하는 API 그룹입니다.

### 2.1. 새로운 여행 방 생성

- **Method:** `POST`
- **URL:** `/trips`
- **Description:** 방장이 새로운 더치트립 프로젝트를 생성합니다. 생성 즉시 유니크한 초대 코드가 발급됩니다.
- **Request Body:**
    - `end_date`는 반드시 `start_date`와 같거나 이후여야 합니다.
    
    ```
    {
      "title": "가평 여행",
      "nation": "대한민국",
      "start_date": "2026-05-01",
      "end_date": "2026-05-03"
    }
    ```
    
- **Response (201 Created):**
    
    ```
    {
      "trip_id": 10,
      "title": "가평 여행",
      "invite_code": "ABC123XYZ" // 프론트엔드는 이 코드를 활용해 '카카오톡 초대하기' 링크를 구성합니다.
    }
    ```
    

### 2.2. 내 여행 방 목록 조회 (홈 화면)

- **Method:** `GET`
- **URL:** `/trips`
- **Description:** 로그인한 유저가 속해있는 모든 여행 방의 목록을 조회합니다. 시작 날짜가 최신인 순(또는 다가오는 순)으로 정렬되어 반환됩니다.
- **Response (200 OK):**
    
    ```
    [
      {
        "trip_id": 10,
        "title": "가평 여행",
        "nation": "대한민국",
        "start_date": "2026-05-01",
        "end_date": "2026-05-03",
        "member_count": 4, // 참여 인원 수
        "my_role": "방장" // "방장" 또는 "일반"
      }
    ]
    ```
    

### 2.3. 특정 여행 방 참여자 목록 조회

- **Method:** `GET`
- **URL:** `/trips/{tripId}/members`
- **Description:** 프론트엔드의 **'영수증 메뉴 선택 UI'**에 뿌려줄 팀원 목록을 불러오기 위해 필수적인 API입니다.
- **Response (200 OK):**
    
    ```
    [
      { "user_id": 1, "nickname": "최서현", "role": "방장" },
      { "user_id": 2, "nickname": "김선태", "role": "일반" }
    ]
    ```
    

### 2.4. 초대 코드로 여행 참여하기

- **Method:** `POST`
- **URL:** `/trips/join`
- **Description:** 다른 유저가 전달받은 초대 코드를 입력하여 여행 방에 합류합니다.
- **Request Body:**
    
    ```
    {
      "invite_code": "ABC123XYZ"
    }
    ```
    
- **Exception Handling:**
    - 이미 참여 중인 유저일 경우 `409 Conflict` (이미 참여 중인 방입니다.)
    - 존재하지 않거나 만료된 코드일 경우 `404 Not Found` (유효하지 않은 초대 코드입니다.)

## 3. 🕒 타임라인 - 일정 (Schedule)

비용 정산에 포함되지 않는 순수 여행 일정(동선)을 기록하고 조회합니다.

### 3.1. 일정 추가

- **Method:** `POST`
- **URL:** `/trips/{tripId}/schedules`
- **Description:** 특정 여행의 타임라인에 새로운 일정을 추가합니다. UI에서 'Day 1', 'Day 2'를 구분하기 쉽도록 `schedule_date`를 명확히 받습니다.
- **Request Body:**
    
    ```
    {
      "schedule_date": "2026-05-01",
      "schedule_time": "2026-05-01T12:00:00",
      "title": "가평역 도착 및 점심",
      "content": "가평역 앞에서 다 같이 모여서 닭갈비 먹기"
    }
    ```
    

### 3.2. 일정 목록 조회

- **Method:** `GET`
- **URL:** `/trips/{tripId}/schedules`
- **Description:** 여행의 전체 일정 목록을 조회합니다. 시간에 따라 오름차순(과거->미래)으로 자동 정렬됩니다.
- **Query Parameters (선택):**
    - `?date=2026-05-01`: 특정 날짜의 일정만 필터링해서 가져오고 싶을 때 사용합니다.
- **Response (200 OK):**
    
    ```
    [
      {
        "schedule_id": 1,
        "schedule_date": "2026-05-01",
        "schedule_time": "2026-05-01T12:00:00",
        "title": "가평역 도착 및 점심",
        "content": "가평역 앞에서 다 같이 모여서 닭갈비 먹기"
      }
    ]
    ```
    

## 4. 💰 타임라인 - 영수증 및 지출 (Expense)

결제 내역과 더치페이 매핑을 처리하는 가장 중요한 구간입니다.

### 4.1. 영수증 OCR 분석 요청

- **Method:** `POST`
- **URL:** `/trips/{tripId}/expenses/ocr`
- **Content-Type:** `multipart/form-data`
- **Description:** 사용자가 촬영한 영수증 이미지를 서버로 전송합니다. 서버는 외부 OCR API를 거쳐 가맹점 이름과 메뉴 리스트를 추출해 반환합니다. (이 단계에서는 DB에 지출 내역이 최종 저장되지 않으며, 프론트엔드 입력 폼을 채워주는 용도입니다.)
- **Request Body:** * `image`: Multipart File 객체
- **Response (200 OK):**
    
    ```
    {
      "parsed_title": "쏨분씨푸드",
      "parsed_total_amount": 55000,
      "parsed_items": [
        { "item_name": "푸팟퐁커리", "price": 30000 },
        { "item_name": "창 맥주", "price": 10000 },
        { "item_name": "모닝글로리", "price": 15000 }
      ]
    }
    ```
    

### 4.2. 지출 내역 최종 등록 (글로쓰기 / OCR 기반 수동 수정 후 저장)

- **Method:** `POST`
- **URL:** `/trips/{tripId}/expenses`
- **Description:** 사용자가 결제 정보와 각 메뉴를 누가 먹었는지(분담자)를 최종 확정하여 서버에 저장합니다. 백엔드 알고리즘은 여기서 넘어온 `participant_user_ids` 배열을 바탕으로 유저별 최종 부담 금액(`amount_owed`)을 내부적으로 즉시 연산하여 저장합니다.
- **Request Body:**
    - `payer_user_id`: 이 영수증 전체 금액을 본인의 카드로 선결제한 사람.
    - `items`: 영수증 내역 리스트. 만약 N빵(모두가 1/N)을 원한다면 프론트엔드는 모든 방 참여자의 ID를 `participant_user_ids`에 꽉 채워서 보내주면 됩니다.
    
    ```
    {
      "title": "쏨분씨푸드",
      "total_amount": 55000,
      "expense_type": "추가금액",
      "payment_time": "2026-04-14T19:30:00", // 영수증에 찍힌 실제 결제 시간 (타임라인 노출 기준)
      "currency": "THB",
      "exchange_rate": 38.5,
      "receipt_image_url": "[https://s3.ap-northeast-2.amazonaws.com/.../receipt.jpg](https://s3.ap-northeast-2.amazonaws.com/.../receipt.jpg)",
      "payer_user_id": 1,
      "items": [
        {
          "item_name": "푸팟퐁커리",
          "price": 30000,
          "participant_user_ids": [1, 2, 3] // 10,000원씩 분담
        },
        {
          "item_name": "창 맥주",
          "price": 10000,
          "participant_user_ids": [1, 3] // 5,000원씩 분담 (2번 유저는 제외)
        },
        {
          "item_name": "모닝글로리",
          "price": 15000,
          "participant_user_ids": [1, 2, 3] // 5,000원씩 분담
        }
      ]
    }
    ```
    

### 4.3. 지출 내역 목록 조회 (타임라인 영수증 뷰)

- **Method:** `GET`
- **URL:** `/trips/{tripId}/expenses`
- **Description:** 해당 여행 방에서 발생한 모든 지출 내역을 조회합니다. 타임라인 뷰에 영수증 형태의 UI를 렌더링하기 위해 필요한 요약 정보를 제공합니다. `payment_time` 기준으로 정렬됩니다.
- **Response (200 OK):**
    
    ```
    [
      {
        "expense_id": 105,
        "title": "쏨분씨푸드",
        "total_amount": 55000,
        "payer": {
          "user_id": 1,
          "nickname": "최서현"
        },
        "payment_time": "2026-04-14T19:30:00",
        "expense_type": "추가금액",
        "item_count": 3
      }
    ]
    ```
    

## 5. 🧮 송금 및 정산 (Settlement)

여행의 금전적 채무 관계를 가장 깔끔한 형태로 정리해주는 핵심 알고리즘 결과 호출 API입니다.

### 5.1. 최종 송금 결과 (최소 송금 알고리즘 결과) 조회

- **Method:** `GET`
- **URL:** `/trips/{tripId}/settlements`
- **Description:** 여행 방의 모든 지출 내역(선결제 금액 vs 최종 부담 금액)을 비교하여, 송금 횟수를 최소화한 최적의 이체 경로를 반환합니다. (예: A가 B에게 1만 원, B가 C에게 1만 원 줄 것이 있다면, A가 C에게 바로 1만 원을 주도록 계산)
- **알아두기:** 송금 완료 여부를 판단하는 필드(`is_completed`)는 기획상 제외되었으므로, 프론트엔드는 이 API가 반환하는 내용을 송금 가이드 용도로만 화면에 그려주면 됩니다.
- **Response (200 OK):**
    - `related_expenses`: 이 정산금이 왜 도출되었는지 사용자가 이해할 수 있도록 참고용 지출처 힌트를 배열로 제공합니다.
    
    ```
    [
      {
        "sender": {
          "user_id": 2,
          "nickname": "김선태" // 돈을 보내야 하는 사람
        },
        "receiver": {
          "user_id": 1,
          "nickname": "최서현", // 돈을 받는 사람
          "bank_name": "카카오뱅크",
          "account_number": "3333-12-1234567" // 프론트에서 계좌 복사 버튼에 매핑
        },
        "amount_to_send": 25000, // 최종적으로 보내야 할 금액
        "related_expenses": ["쏨분씨푸드", "공항 택시", "숙소 예약금"]
      },
      {
        "sender": {
          "user_id": 3,
          "nickname": "이지은"
        },
        "receiver": {
          "user_id": 1,
          "nickname": "최서현",
          "bank_name": "카카오뱅크",
          "account_number": "3333-12-1234567"
        },
        "amount_to_send": 12000,
        "related_expenses": ["쏨분씨푸드", "마사지샵"]
      }
    ]
    ```