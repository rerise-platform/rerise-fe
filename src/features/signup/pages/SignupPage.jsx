import React, { useState } from "react";
import { signUp } from "../api/signupAPI";
import SignupForm from "../components/SignupForm";

function SignupPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async ({ email, password, nickname }) => {
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const data = await signUp({ email, password, nickname });
      setSuccess("회원가입 성공!");
      console.log("회원가입 성공:", data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fefff5",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingBottom: "100px",
        boxSizing: "border-box",
      }}
    >
      <SignupForm onSubmit={handleSubmit} submitting={submitting} />
      {success && <p style={{ color: "#28d742", marginTop: 8 }}>{success}</p>}
      {error && <p style={{ color: "#e54848", marginTop: 8 }}>{error}</p>}
    </div>
  );
}

export default SignupPage;
