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

  const handleSubmitClick = async () => {
    if (!isFormValid) return;

    try {
      // 생년월일 형식 변환 (YYYYMMDD → YYYY-MM-DD)
      const formattedBirth = birth.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");

      // 회원가입 API 호출
      const res = await signupAPI({
        email,
        password,
        passwordCheck: confirmPassword,
        nickname,
        birth: formattedBirth,
      });

      if (res === "회원가입 성공") {
        alert("회원가입 성공!\n로그인 페이지로 이동합니다.");
        window.location.href = "/login";
      } else {
        alert("회원가입 실패!\n다시 시도해주세요.");
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입 실패!\n다시 시도해주세요.");
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
    <div className="sg-form">
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
        onClick={handleSubmitClick}
        disabled={!isFormValid}
        style={{
          opacity: isFormValid ? 1 : 0.9,
          cursor: isFormValid ? "pointer" : "not-allowed",
        }}
      >
        Rerise 시작하기
      </button>
    </div>
  );
}
