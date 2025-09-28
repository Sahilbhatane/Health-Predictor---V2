"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { User, LogOut, Settings, Activity, ChevronDown, ChevronRight, Bell, CreditCard, HelpCircle, Shield, Phone, Mail } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { SubscriptionModal } from "@/components/subscription-modal"

export function UserMenu() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | 'enterprise'>('monthly')
  const [expandedTab, setExpandedTab] = useState<string | null>(null)

  if (status === "loading") {
    return (
      <div className="w-8 h-8 bg-slate-700/50 rounded-full animate-pulse" />
    )
  }

  if (!session?.user) {
    return null
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
    setIsOpen(false)
  }

  const openSubscriptionModal = (plan: 'monthly' | 'annual' | 'enterprise') => {
    setSelectedPlan(plan)
    setIsSubscriptionModalOpen(true)
    setIsOpen(false)
  }

  const toggleTab = (tabName: string) => {
    setExpandedTab(expandedTab === tabName ? null : tabName)
  }

  const userInitials = session.user.name
    ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : session.user.email?.[0].toUpperCase() || 'U'

  return (
    <>
      <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-2xl transition-all duration-300 bg-black/10 backdrop-blur-xl border border-white/10 hover:bg-black/20"
      >
        <Avatar className="w-7 h-7 sm:w-8 sm:h-8 ring-2 ring-white/20">
          <AvatarImage 
            src={session.user.image || undefined} 
            alt={session.user.name || session.user.email || "User"} 
          />
          <AvatarFallback className="bg-gradient-to-r from-slate-600 to-slate-700 text-white text-xs sm:text-sm font-medium">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-white">
            {session.user.name?.split(' ')[0] || 'User'}
          </div>
          <div className="text-xs text-white/60">
            Premium Member
          </div>
        </div>
        <ChevronDown 
          className={`w-3 h-3 sm:w-4 sm:h-4 text-white/60 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-14 sm:top-16 w-72 sm:w-80 max-h-[85vh] z-50"
            >
              <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-full mx-2 sm:mx-0">
                {/* User Info Header */}
                <div className="p-4 sm:p-6 border-b border-white/10 flex-shrink-0">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <Avatar className="w-10 h-10 sm:w-12 sm:h-12 ring-2 ring-white/20">
                      <AvatarImage src={session.user.image || undefined} />
                      <AvatarFallback className="bg-gradient-to-r from-slate-600 to-slate-700 text-white font-medium">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-base sm:text-lg font-semibold text-white truncate">
                        {session.user.name || "User"}
                      </p>
                      <p className="text-xs sm:text-sm text-white/60 truncate">
                        {session.user.email}
                      </p>
                      <div className="mt-2 inline-flex items-center px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-medium">
                        <Shield className="w-3 h-3 mr-1" />
                        Premium Access
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Tabs */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-2 sm:p-3 space-y-1">
                    {/* Account Tab */}
                    <div className="border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden">
                      <motion.button
                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleTab('account')}
                        className="w-full flex items-center justify-between p-3 sm:p-4 text-white/90 transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <User className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
                          <span className="font-medium text-sm sm:text-base">Account</span>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedTab === 'account' ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
                        </motion.div>
                      </motion.button>
                      
                      <AnimatePresence>
                        {expandedTab === 'account' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2 border-t border-white/10">
                              <TabMenuItem icon={User} label="Profile Settings" description="Manage your account" />
                              <TabMenuItem icon={Activity} label="Prediction History" description="View past health assessments" />
                              <TabMenuItem icon={Bell} label="Notifications" description="Alerts & reminders" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Subscription Tab */}
                    <div className="border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden">
                      <motion.button
                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleTab('subscription')}
                        className="w-full flex items-center justify-between p-3 sm:p-4 text-white/90 transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
                          <span className="font-medium text-sm sm:text-base">Subscription</span>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedTab === 'subscription' ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
                        </motion.div>
                      </motion.button>
                      
                      <AnimatePresence>
                        {expandedTab === 'subscription' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2 sm:space-y-3 border-t border-white/10">
                              {/* Quick Plan Overview */}
                              <div className="text-xs text-white/60 mb-2 sm:mb-3">Choose your plan:</div>
                              
                              {/* Monthly Plan */}
                              <button 
                                onClick={() => openSubscriptionModal('monthly')}
                                className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/20 rounded-xl p-2.5 sm:p-3 text-left hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200"
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="text-xs sm:text-sm font-semibold text-white">Monthly Plan</div>
                                    <div className="text-xs text-white/60">7-day free trial</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xs sm:text-sm font-bold text-blue-300">₹50</div>
                                    <div className="text-xs text-white/60">first month</div>
                                  </div>
                                </div>
                              </button>

                              {/* Annual Plan */}
                              <button 
                                onClick={() => openSubscriptionModal('annual')}
                                className="w-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/20 rounded-xl p-2.5 sm:p-3 text-left hover:from-emerald-500/30 hover:to-teal-500/30 transition-all duration-200"
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="text-xs sm:text-sm font-semibold text-white">Annual Plan</div>
                                    <div className="text-xs text-white/60">First month free</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xs sm:text-sm font-bold text-emerald-300">₹199</div>
                                    <div className="text-xs text-white/60">per month</div>
                                  </div>
                                </div>
                              </button>

                              {/* Enterprise Plan */}
                              <button 
                                onClick={() => openSubscriptionModal('enterprise')}
                                className="w-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/20 rounded-xl p-2.5 sm:p-3 text-left hover:from-amber-500/30 hover:to-orange-500/30 transition-all duration-200"
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="text-xs sm:text-sm font-semibold text-white">Enterprise</div>
                                    <div className="text-xs text-white/60">For hospitals & clinics</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xs sm:text-sm font-bold text-amber-300">Custom</div>
                                    <div className="text-xs text-white/60">pricing</div>
                                  </div>
                                </div>
                              </button>
                              
                              <div className="mt-2 sm:mt-3 pt-2 border-t border-white/10">
                                <TabMenuItem icon={Settings} label="Billing Settings" description="Payment methods & invoices" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Support Tab */}
                    <div className="border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden">
                      <motion.button
                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleTab('support')}
                        className="w-full flex items-center justify-between p-3 sm:p-4 text-white/90 transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
                          <span className="font-medium text-sm sm:text-base">Support</span>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedTab === 'support' ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
                        </motion.div>
                      </motion.button>
                      
                      <AnimatePresence>
                        {expandedTab === 'support' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2 border-t border-white/10">
                              <TabMenuItem icon={HelpCircle} label="Help Center" description="FAQs and guides" />
                              <TabMenuItem icon={Mail} label="Contact Support" description="Get help from our team" />
                              <TabMenuItem icon={Phone} label="Call Support" description="Speak with an expert" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Sign Out Section - Fixed at bottom */}
                <div className="flex-shrink-0 border-t border-white/10">
                  <div className="p-2 sm:p-3">
                    <motion.button
                      whileHover={{ x: 4, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-3 py-2 sm:py-3 text-xs sm:text-sm text-red-400 hover:text-red-300 rounded-xl sm:rounded-2xl transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                      <div className="text-left">
                        <div className="font-medium">Sign Out</div>
                        <div className="text-xs text-red-400/60">End current session</div>
                      </div>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        selectedPlan={selectedPlan}
      />
    </>
  )
}

// Tab Menu Item Component
function TabMenuItem({ 
  icon: Icon, 
  label, 
  description, 
  onClick 
}: { 
  icon: any
  label: string
  description: string
  onClick?: () => void
}) {
  return (
    <motion.button
      whileHover={{ x: 4, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 text-xs sm:text-sm text-white/70 hover:text-white/90 rounded-lg sm:rounded-xl transition-all duration-200"
    >
      <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-white/50 flex-shrink-0" />
      <div className="text-left flex-1 min-w-0">
        <div className="font-medium truncate">{label}</div>
        <div className="text-xs text-white/40 truncate">{description}</div>
      </div>
    </motion.button>
  )
}