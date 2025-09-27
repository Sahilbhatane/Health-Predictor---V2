"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Shield, LogIn, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface AuthGuardProps {
  children: React.ReactNode
  requiredForTabs?: string[]
}

export function AuthGuard({ children, requiredForTabs = [] }: AuthGuardProps) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session?.user && requiredForTabs.length > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto px-4"
      >
        <div className="bg-black/20 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 text-center space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="w-16 h-16 bg-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white">
                Premium Feature
              </h3>
              <p className="text-white/60 text-lg">
                Sign in to access advanced AI health predictions and personalized recommendations
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center justify-center">
                <ArrowRight className="w-5 h-5 mr-2" />
                Premium Features Available:
              </h4>
              <ul className="space-y-4 text-sm text-white/80">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-emerald-300">Detailed Health Recommendations</span>
                    <p className="text-white/50 mt-1">Get personalized advice based on your prediction results</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-blue-300">Medicine Suggestions</span>
                    <p className="text-white/50 mt-1">Access curated pharmaceutical recommendations for your condition</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-purple-300">Prediction History</span>
                    <p className="text-white/50 mt-1">Track your health assessments over time</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-orange-300">Advanced Analytics</span>
                    <p className="text-white/50 mt-1">Deeper insights and trend analysis</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signin" className="flex-1">
                <Button
                  size="lg"
                  className="w-full bg-white text-slate-900 hover:bg-white/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 h-12 rounded-xl"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In to Continue
                </Button>
              </Link>
              
              <Button
                size="lg"
                variant="outline"
                className="border-white/10 bg-white/5 text-white/80 hover:text-white hover:border-white/20 hover:bg-white/10 backdrop-blur-sm h-12 rounded-xl"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Back to Home
              </Button>
            </div>

            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-xs text-white/40">
                Your data is secure and HIPAA compliant. Sign in with Google for instant access.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return <>{children}</>
}