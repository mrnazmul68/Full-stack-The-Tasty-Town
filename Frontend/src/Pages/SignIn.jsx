import React, { useState } from "react";

const viewContent = {
  register: {
    badge: "Sign Up",
    title: "Create your account",
    description: "Use your email and password to create a Tasty Town account.",
    submitLabel: "Create Account",
  },
  login: {
    badge: "Log In",
    title: "Welcome back",
    description: "Use your existing account details to continue to Tasty Town.",
    submitLabel: "Log In",
  },
  forgot: {
    badge: "Forgot Password",
    title: "Reset your password",
    description:
      "Enter your email and we will create a reset code for your account.",
    submitLabel: "Send Reset Code",
  },
  reset: {
    badge: "Reset Password",
    title: "Choose a new password",
    description:
      "Paste the reset code and set a new password for your account.",
    submitLabel: "Reset Password",
  },
};

const SignIn = ({
  onBack,
  onForgotPassword,
  onLogin,
  onRegister,
  onResetPassword,
}) => {
  const [mode, setMode] = useState("register");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    rememberMe: true,
    resetToken: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const content = viewContent[mode];
  const visibleModes =
    mode === "reset" ? ["login", "forgot", "reset"] : ["register", "login", "forgot"];

  const setView = (nextMode) => {
    setMode(nextMode);
    setFeedback(null);
  };

  const handleChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);

    if (mode === "reset" && formData.newPassword !== formData.confirmPassword) {
      setFeedback({
        type: "error",
        message: "The new password and confirmation password do not match.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "register") {
        await onRegister(formData);
      } else if (mode === "login") {
        await onLogin(formData);
      } else if (mode === "forgot") {
        const response = await onForgotPassword({ email: formData.email });
        const resetToken = response?.resetToken || "";

        setFormData((current) => ({
          ...current,
          resetToken,
          newPassword: "",
          confirmPassword: "",
        }));
        setFeedback({
          type: "success",
          message: resetToken
            ? `${response.message} The reset code has been filled in for you below.`
            : response.message,
        });

        if (resetToken) {
          setMode("reset");
        }
      } else if (mode === "reset") {
        await onResetPassword({
          token: formData.resetToken,
          newPassword: formData.newPassword,
          rememberMe: formData.rememberMe,
        });
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_16px_40px_rgba(220,32,22,0.18)] sm:p-8">
        <div className="mb-6 space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
            {content.badge}
          </p>
          <h2 className="text-3xl font-bold">{content.title}</h2>
          <p className="text-sm leading-7 text-slate-300">
            {content.description}
          </p>
        </div>



        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <input
              type="text"
              value={formData.fullName}
              onChange={(event) => handleChange("fullName", event.target.value)}
              placeholder="Full name"
              required
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-orange-500"
            />
          )}

          {mode !== "reset" && (
            <input
              type="email"
              value={formData.email}
              onChange={(event) => handleChange("email", event.target.value)}
              placeholder="Email address"
              required
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-orange-500"
            />
          )}

          {(mode === "register" || mode === "login") && (
            <input
              type="password"
              value={formData.password}
              onChange={(event) => handleChange("password", event.target.value)}
              placeholder="Password"
              required
              minLength={6}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-orange-500"
            />
          )}

          {mode === "reset" && (
            <>
              <input
                type="text"
                value={formData.resetToken}
                onChange={(event) => handleChange("resetToken", event.target.value)}
                placeholder="Reset code"
                required
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-orange-500"
              />
              <input
                type="password"
                value={formData.newPassword}
                onChange={(event) => handleChange("newPassword", event.target.value)}
                placeholder="New password"
                required
                minLength={6}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-orange-500"
              />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(event) =>
                  handleChange("confirmPassword", event.target.value)
                }
                placeholder="Confirm new password"
                required
                minLength={6}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-orange-500"
              />
            </>
          )}

          {(mode === "register" || mode === "login" || mode === "reset") && (
            <div className="flex items-center justify-between gap-3 text-sm text-slate-300">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(event) =>
                    handleChange("rememberMe", event.target.checked)
                  }
                  className="accent-orange-500"
                />
                Remember me
              </label>
              {mode === "login" && (
                <button
                  type="button"
                  onClick={() => setView("forgot")}
                  className="text-orange-400 transition-colors duration-200 hover:text-orange-300"
                >
                  Forgot password?
                </button>
              )}
            </div>
          )}

          {feedback && (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                feedback.type === "error"
                  ? "border-red-500/40 bg-red-500/10 text-red-300"
                  : "border-green-500/40 bg-green-500/10 text-green-200"
              }`}
            >
              {feedback.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Please wait..." : content.submitLabel}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-300">
          {mode === "register" && (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setView("login")}
                className="font-semibold text-orange-400 transition-colors duration-200 hover:text-orange-300"
              >
                Log in here
              </button>
            </>
          )}
          {mode === "login" && (
            <>
              Need a new account?{" "}
              <button
                type="button"
                onClick={() => setView("register")}
                className="font-semibold text-orange-400 transition-colors duration-200 hover:text-orange-300"
              >
                Sign up here
              </button>
            </>
          )}
          {(mode === "forgot" || mode === "reset") && (
            <>
              Remembered your password?{" "}
              <button
                type="button"
                onClick={() => setView("login")}
                className="font-semibold text-orange-400 transition-colors duration-200 hover:text-orange-300"
              >
                Go back to login
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={onBack}
          className="mt-4 w-full rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors duration-200 hover:border-orange-500 hover:text-orange-400"
        >
          Back to Home
        </button>
      </div>
    </section>
  );
};

export default SignIn;
