"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, MessageCircle, ArrowRight, Loader2, Eye, EyeOff, Phone, ArrowLeft, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface FormData {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!isLogin && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!isLogin && formData.username.trim() && !/^[a-zA-Z0-9_.]+$/.test(formData.username)) {
      newErrors.username = "Only letters, numbers, _ and . allowed";
    }
    
    if (loginMethod === "email") {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
    } else {
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      }
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    dispatch(loginStart());

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body = isLogin 
        ? { 
            ...(loginMethod === "email" ? { email: formData.email } : { phone: formData.phone }),
            password: formData.password,
            rememberMe
          } 
        : { name: formData.name, email: formData.email, password: formData.password, username: formData.username };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      const user = data.payload?.user || data.user;
      const token = data.payload?.accessToken || data.token;
      
      if (rememberMe) {
        localStorage.setItem("authToken", token);
      }
      
      dispatch(loginSuccess({ user, token }));
      toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        dispatch(loginFailure(err.message));
      } else {
        dispatch(loginFailure("Authentication failed"));
      }
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#0f0f0f] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-[#ffffff] dark:bg-[#0f0f0f] rounded-3xl shadow-2xl overflow-hidden border border-[#e6e8ec] dark:border-[#2b3142]"
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <motion.div 
              layoutId="logo"
              className="w-20 h-20 bg-gradient-to-br from-[#28a8e8] to-[#0ba4e8] rounded-[22px] flex items-center justify-center shadow-lg"
            >
              <MessageCircle className="w-10 h-10 text-white" />
            </motion.div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-[#000000] dark:text-[#ffffff] mb-1">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-[#8e8e93] text-center text-sm mb-6">
            {isLogin 
              ? `Login with your ${loginMethod === "email" ? "email" : "phone number"}` 
              : "Enter your details to get started"
            }
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <InputField
                    icon={User}
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(v) => updateField("name", v)}
                    error={errors.name}
                  />
                  <InputField
                    icon={User}
                    type="text"
                    placeholder="Username (optional)"
                    value={formData.username}
                    onChange={(v) => updateField("username", v)}
                    error={errors.username}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {isLogin && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex bg-[#f5f5f5] dark:bg-[#18222d] p-1 rounded-2xl"
              >
                <TabButton
                  active={loginMethod === "email"}
                  onClick={() => setLoginMethod("email")}
                  icon={Mail}
                  label="Email"
                />
                <TabButton
                  active={loginMethod === "phone"}
                  onClick={() => setLoginMethod("phone")}
                  icon={Phone}
                  label="Phone"
                />
              </motion.div>
            )}

            {loginMethod === "email" ? (
              <InputField
                icon={Mail}
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(v) => updateField("email", v)}
                error={errors.email}
              />
            ) : (
              <InputField
                icon={Phone}
                type="tel"
                placeholder="Phone number"
                value={formData.phone}
                onChange={(v) => updateField("phone", v)}
                error={errors.phone}
              />
            )}

            <InputField
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(v) => updateField("password", v)}
              error={errors.password}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#8e8e93] hover:text-[#28a8e8] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
            />

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div 
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      rememberMe 
                        ? "bg-[#28a8e8] border-[#28a8e8]" 
                        : "border-[#8e8e93] dark:border-[#5e5e63]"
                    }`}
                  >
                    {rememberMe && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-[#8e8e93]">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-[#28a8e8] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#28a8e8] hover:bg-[#1a99e0] text-white font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-[#28a8e8]/20"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Login" : "Create Account"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            <p className="text-center text-sm text-[#8e8e93] mt-6">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="text-[#28a8e8] font-bold hover:underline"
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function InputField({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  error,
  rightElement
}: {
  icon: any;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  rightElement?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8e8e93]" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full pl-12 pr-12 py-3.5 bg-[#f5f5f5] dark:bg-[#18222d] border-2 rounded-2xl transition-all outline-none text-[#000000] dark:text-[#ffffff] placeholder:text-[#8e8e93] font-medium ${
          error 
            ? "border-red-500 focus:border-red-500" 
            : "border-transparent focus:border-[#28a8e8]"
        }`}
      />
      {rightElement && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
      {error && (
        <p className="absolute -bottom-5 left-0 text-[10px] text-red-500">{error}</p>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all text-sm font-medium ${
        active 
          ? "bg-[#ffffff] dark:bg-[#242f3d] text-[#000000] dark:text-[#ffffff] shadow-sm" 
          : "text-[#8e8e93]"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}