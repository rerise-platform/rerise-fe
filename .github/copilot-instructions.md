## 빠른 시작 (AI 에이전트를 위한 핵심 요약)

- 이 저장소는 React + Redux Toolkit 기반의 프런트엔드입니다.
- 주요 위치:
  - 상태/스토어: `src/store/store.js`, (legacy) `src/store/rootReducer.js`
  - 기능 모듈: `src/features/<feature>/` (각 기능은 `api/`, `components/`, `pages/`, `*Slice.js` 패턴)
  - 중앙 HTTP 클라이언트: `src/lib/apiClient.js` (Axios 인스턴스, 토큰 인터셉터 포함)
  - 앱 엔트리: `src/index.js`, 라우팅/경계는 `src/App.js`
  - 공통 컴포넌트/유틸: `src/shared/`

## 무엇을 기대해야 하는가 (아키텍처와 데이터 흐름)

- 각각의 "feature" 폴더는 독립적인 slice(예: `mainSlice.js`)와 API 호출 파일(예: `features/main/api/mainAPI.js`)을 가집니다. 일반 흐름:
  1. 컴포넌트(`pages/` 또는 `components/`)에서 비동기 액션(dispatch) 호출
  2. slice의 `createAsyncThunk`가 `features/*/api/*`의 함수를 호출
  3. `apiClient.js`(Axios)가 토큰 처리/로깅/에러 처리를 담당
  4. 응답은 slice에 반영되어 컴포넌트가 `useSelector`로 읽음

예: `src/features/main/mainSlice.js`의 `getMainPageData` -> `features/main/api/mainAPI.js` -> `src/lib/apiClient.js`

## 프로젝트 규약 / 패턴 (구체적)

- 파일/폴더: 새 feature는 `src/features/<name>/{api,components,pages}` + `<name>Slice.js`를 만든 뒤 `src/store/store.js`에 reducer를 등록합니다.
- Slice 패턴: `createSlice`, `createAsyncThunk`, `extraReducers`로 비동기 상태(`status: 'idle'|'loading'|...`)를 관리합니다.
- API 클라이언트: `src/lib/apiClient.js`에서 `Authorization: Bearer <accessToken>`을 `localStorage.getItem('accessToken')`로 자동 첨부합니다. `/login`, `/signup`, `/health` 경로는 토큰 미첨부 처리됩니다.
- 환경/설정: 기본 API URL은 `REACT_APP_API_BASE_URL`로 오버라이드 가능. `package.json`의 `proxy`가 `http://localhost:8080`으로 설정되어 있습니다.
- 스타일: styled-components가 널리 사용되며, 일부 페이지별 `.css` 파일도 함께 존재합니다 (co-located styles).
- 디버깅: 개발 모드에서 `apiClient`와 많은 컴포넌트가 console 로그/alert로 디버그 정보를 노출합니다. (예: `MainPage.jsx`의 상세 로깅)

## 개발자 워크플로우 (중요 명령)

- 의존성 설치: `npm install`
- 개발 서버: `npm start` (CRA 기반, `react-scripts start`)
- 빌드: `npm run build` (생성물: `build/`)
- 테스트: `npm test`

참고: `package.json` 스크립트는 표준 CRA 스크립트입니다. 로컬 API를 테스트할 때는 `REACT_APP_API_BASE_URL` 또는 `proxy` 설정을 확인하세요.

## 코드 변경 시 주의점 / 체크리스트 (AI에게 유용한 규칙)

- 새 slice를 만들면 반드시 `src/store/store.js`에 reducer를 등록하세요 (예: `main: mainReducer`).
- API 호출 함수는 `features/*/api/*.js`에 두고, axios 인스턴스는 `src/lib/apiClient.js`를 재사용하세요.
- 인증 토큰은 `localStorage`의 `accessToken`을 사용합니다. 로그아웃/토큰 만료 처리 시 관련 로직을 함께 업데이트하세요.
- 라우팅 보호는 `src/App.js`의 `PrivateRoute`, `AuthRoute`, `TestRoute` 패턴을 따릅니다. `DEVELOPMENT_MODE` 플래그가 하드코딩 되어 있으니 변경 시 주의하세요.
- 디버그 출력(콘솔/alert)은 개발용으로 남아있으므로 PR 전에는 의도된 로그만 남겼는지 확인하세요.

## 통합 포인트 / 외부 의존성

- 백엔드: API는 기본 `https://rerise.store` 또는 `REACT_APP_API_BASE_URL`에서 동작합니다. 로컬 개발은 `proxy`(`http://localhost:8080`)를 활용합니다.
- 인증: JWT 토큰을 `accessToken`으로 관리 (localStorage)

## 예시 요청/응답 처리 방식 (참고 코드)

- 요청 인터셉터: `src/lib/apiClient.js` 에서 토큰 자동 첨부, dev일 때 요청/응답 콘솔 로깅
- slice 예시: `src/features/main/mainSlice.js`의 `getMainPageData` 패턴을 따르세요 (try/catch + `rejectWithValue` 사용)

---

필요하면 이 파일에 더 많은 예제(코드 스니펫), PR 템플릿, 또는 배포/CI 관련 세부 명령을 추가할게요. 이 초안에서 빠진 부분(예: 특정 CI 환경 변수, 테스트 커버리지 기준, 로컬 시드 데이터 방법)이 있으면 알려주세요.
