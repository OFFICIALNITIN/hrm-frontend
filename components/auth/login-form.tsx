"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { useAuth } from "@/contexts/auth-context"
import { Eye, EyeOff, Building2, User, Shield, Users } from "lucide-react"

interface LoginFormProps {
  onLoginSuccess?: () => void
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading, error, clearError, isAuthenticated } = useAuth()

  // Clear error when inputs change
  useEffect(() => {
    if (error) {
      clearError()
    }
  }, [email, password, clearError, error])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && onLoginSuccess) {
      onLoginSuccess()
    }
  }, [isAuthenticated, onLoginSuccess])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      return
    }

    const success = await login(email, password)

    if (success && onLoginSuccess) {
      onLoginSuccess()
    }
  }

  const fillDemoAccount = (email: string, password: string) => {
    setEmail(email)
    setPassword(password)
  }

  const demoAccounts = [
    {
      email: "admin@company.com",
      password: "password",
      role: "Admin",
      description: "Full system access & user management",
      icon: Shield,
      gradient: "from-red-500 to-pink-500",
    },
    {
      email: "sarah@company.com",
      password: "password",
      role: "HR Manager",
      description: "Employee & department management",
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      email: "alex@company.com",
      password: "password",
      role: "Employee",
      description: "Self-service portal access",
      icon: User,
      gradient: "from-green-500 to-emerald-500",
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-lg">
        <Card className="modern-card border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-slate-600">Sign in to your HR Portal account</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="modern-input h-12"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="modern-input h-12 pr-10"
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && <ErrorMessage message={error} />}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 btn-modern"
                disabled={loading || !email || !password}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Demo Accounts Section */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500 font-medium">Try Demo Accounts</span>
                </div>
              </div>

              <div className="grid gap-3">
                {demoAccounts.map((account, index) => {
                  const IconComponent = account.icon
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => fillDemoAccount(account.email, account.password)}
                      disabled={loading}
                      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 text-left transition-all duration-200 hover:border-gray-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${account.gradient} text-white shadow-sm`}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-900">{account.role}</p>
                            <span className="text-xs text-gray-500 font-mono">{account.email}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{account.description}</p>
                          <p className="text-xs text-gray-400 mt-1">Password: {account.password}</p>
                        </div>
                      </div>

                      {/* Hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </button>
                  )
                })}
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500">Click any demo account above to auto-fill the login form</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
