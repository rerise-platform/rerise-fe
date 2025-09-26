import React, { useState, useRef } from "react";
import { signupAPI } from "../api/signupAPI";
import "./SignupForm.css";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordRef = useRef(null);

  const [nickname, setNickname] = useState("");

  const [birth, setBirth] = useState("");
  const [birthError, setBirthError] = useState("");

  const [allChecked, setAllChecked] = useState(false);
  const [terms, setTerms] = useState({
    terms1: false,
    terms2: false,
    marketing: false,
  });

  const isFormValid =
    email &&
    password &&
    confirmPassword &&
    nickname &&
    birth &&
    !emailError &&
    !passwordError &&
    password === confirmPassword &&
    !birthError &&
    terms.terms1 &&
    terms.terms2;

  const handleAllCheck = () => {
    const newChecked = !allChecked;
    setAllChecked(newChecked);
    setTerms({ terms1: newChecked, terms2: newChecked, marketing: newChecked });
  };

  const handleTermChange = (name) => {
    const updated = { ...terms, [name]: !terms[name] };
    setTerms(updated);
    setAllChecked(Object.values(updated).every(Boolean));
  };

  const handleShowPwChecked = () => {
    const password = passwordRef.current;
    if (!password) return;
    setShowPwChecked(!isShowPwChecked);
    password.type = isShowPwChecked ? "password" : "text";
  };

  const handleSubmitClick = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    console.log('🎯 [SIGNUP FORM] 회원가입 버튼 클릭됨');
    
    if (!isFormValid) {
      console.log('❌ [SIGNUP FORM] 폼 유효성 검사 실패');
      console.log('📋 [SIGNUP FORM] 현재 폼 상태:', {
        email: email || '비어있음',
        password: password ? '입력됨' : '비어있음',
        confirmPassword: confirmPassword ? '입력됨' : '비어있음',
        nickname: nickname || '비어있음',
        birth: birth || '비어있음',
        emailError,
        passwordError,
        birthError,
        passwordMatch: password === confirmPassword,
        terms
      });
      return;
    }

    try {
      console.log('✅ [SIGNUP FORM] 폼 유효성 검사 통과');
      
      // 생년월일 형식 변환 (YYYYMMDD → YYYY-MM-DD)
      const formattedBirth = birth.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
      
      const requestData = {
        email,
        password,
        passwordCheck: confirmPassword,
        nickname,
        birth: formattedBirth,
      };

      console.log("🚀 [SIGNUP FORM] 회원가입 API 호출 시작");
      console.log("📝 [SIGNUP FORM] 요청 데이터:", {
        ...requestData,
        password: '***',
        passwordCheck: '***'
      });

      // 회원가입 API 호출
      const res = await signupAPI(requestData);

      console.log("🎉 [SIGNUP FORM] API 호출 완료!");
      console.log("📄 [SIGNUP FORM] 응답 데이터:", res);
      console.log("🔍 [SIGNUP FORM] 응답 타입:", typeof res);
      console.log("📏 [SIGNUP FORM] 응답 길이:", res?.length);

      if (res === "회원가입 성공") {
        console.log("✅ [SIGNUP FORM] 회원가입 성공 - 로그인 페이지로 이동");
        alert("회원가입 성공!\n로그인 페이지로 이동합니다.");
        window.location.href = "/login";
      } else {
        console.log("⚠️ [SIGNUP FORM] 예상과 다른 응답:", res);
        alert(`회원가입 실패!\n${res || "다시 시도해주세요."}`);
      }
    } catch (error) {
      console.error("💥 [SIGNUP FORM] 회원가입 에러 발생!");
      console.error("🔍 [SIGNUP FORM] 에러 상세 정보:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        response: error.response,
        request: error.request,
        config: error.config
      });
      
      // 오류 타입에 따른 메시지 분기
      let errorMessage = "회원가입 실패!\n다시 시도해주세요.";
      
      if (error.code === 'ERR_CONNECTION_REFUSED' || error.message === 'Network Error') {
        console.error("🌐 [SIGNUP FORM] 네트워크 연결 오류");
        errorMessage = "서버에 연결할 수 없습니다.\n백엔드 서버가 실행 중인지 확인해주세요.";
      } else if (error.response?.status === 400) {
        console.error("📝 [SIGNUP FORM] 잘못된 요청 (400)");
        errorMessage = `회원가입 실패!\n${error.response.data || "입력 정보를 확인해주세요."}`;
      } else if (error.response?.status === 409) {
        console.error("🔄 [SIGNUP FORM] 중복 데이터 (409)");
        errorMessage = "이미 존재하는 이메일입니다.\n다른 이메일을 사용해주세요.";
      } else if (error.response?.data) {
        console.error("📄 [SIGNUP FORM] 서버 에러 응답:", error.response.data);
        errorMessage = `회원가입 실패!\n${error.response.data}`;
      }
      
      alert(errorMessage);
    }
  };

  const handleBirthChange = (value) => {
    setBirth(value);
    const isValid = /^\d{8}$/.test(value);
    setBirthError(isValid ? "" : "형식이 맞지 않습니다. 8자리 입력(YYYYMMDD)");
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setEmailError(isValidEmail || value === "" ? "" : "형식이 맞지 않습니다.");
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    const isValidPassword =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=])[A-Za-z\d!@#$%^&*()_\-+=]{8,16}$/.test(
        value
      );
    setPasswordError(
      isValidPassword || value === ""
        ? ""
        : "비밀번호는 8~16자의 영문, 숫자, 특수 문자를 이용하세요."
    );
  };

  return (
    <form className="sg-form" onSubmit={handleSubmitClick}>
      <h2 className="sg-title">회원가입</h2>

      <label className="sg-label">아이디(이메일)</label>
      <input
        className="sg-input"
        type="email"
        placeholder="이메일 주소"
        value={email}
        onChange={(e) => handleEmailChange(e.target.value)}
      />
      {emailError && <p style={{ color: "#e54848" }}>{emailError}</p>}

      <label className="sg-label">비밀번호</label>
      <div style={{ position: "relative" }}>
        <input
          ref={passwordRef}
          className="sg-input"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          style={{ width: "100%" }}
        />
        <label
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
          }}
        ></label>
      </div>
      {passwordError && <p style={{ color: "#e54848" }}>{passwordError}</p>}

      <label className="sg-label">비밀번호 확인</label>
      <input
        className="sg-input"
        type="password"
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {confirmPassword.length > 0 && (
        <p
          style={{
            color: password === confirmPassword ? "#28d742" : "#e54848",
          }}
        >
          {password === confirmPassword
            ? "비밀번호가 동일합니다."
            : "비밀번호가 동일하지 않습니다."}
        </p>
      )}

      <label className="sg-label">닉네임</label>
      <input
        className="sg-input"
        type="text"
        placeholder="닉네임을 입력해주세요"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />

      <label className="sg-label">생년월일</label>
      <input
        className="sg-input"
        type="text"
        placeholder="8자리 입력 (YYYYMMDD)"
        value={birth}
        onChange={(e) => handleBirthChange(e.target.value)}
      />
      {birthError && <p style={{ color: "#e54848" }}>{birthError}</p>}

      <div className="sg-checkbox-area">
        <label
          className="sg-checkbox-item sg-checkbox-all"
          style={{ fontWeight: "bold" }}
        >
          <input
            className="sg-checkbox"
            type="checkbox"
            checked={allChecked}
            onChange={handleAllCheck}
            style={{ width: "21.5px", height: "21.5px" }}
          />
          모두 동의합니다.
        </label>
        <label className="sg-checkbox-item">
          <input
            className="sg-checkbox"
            type="checkbox"
            checked={terms.terms1}
            onChange={() => handleTermChange("terms1")}
          />
          이용약관 동의 (필수)
        </label>
        <label className="sg-checkbox-item">
          <input
            className="sg-checkbox"
            type="checkbox"
            checked={terms.terms2}
            onChange={() => handleTermChange("terms2")}
          />
          개인정보 처리방침 동의 (필수)
        </label>
        <label className="sg-checkbox-item">
          <input
            className="sg-checkbox"
            type="checkbox"
            checked={terms.marketing}
            onChange={() => handleTermChange("marketing")}
          />
          마케팅 정보 수신 동의 (선택)
        </label>
      </div>

      <button
        className="sg-submit"
        type="submit"
        disabled={!isFormValid}
        style={{
          opacity: isFormValid ? 1 : 0.9,
          cursor: isFormValid ? "pointer" : "not-allowed",
        }}
      >
        Rerise 시작하기
      </button>
    </form>
  );
}
