"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Star, Building2, CreditCard, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPlan?: 'monthly' | 'annual' | 'enterprise'
}

export function SubscriptionModal({ isOpen, onClose, selectedPlan = 'monthly' }: SubscriptionModalProps) {
  const [activePlan, setActivePlan] = useState(selectedPlan)

  const plans = {
    monthly: {
      name: "Monthly Plan",
      price: "₹50",
      originalPrice: "₹299",
      period: "first month",
      description: "Perfect for trying out our premium features",
      features: [
        "7-day free trial",
        "All disease prediction models",
        "Detailed health recommendations",
        "Medicine suggestions",
        "Priority support",
        "Export health reports"
      ],
      badge: "Most Flexible",
      color: "blue",
      buttonText: "Start Free Trial"
    },
    annual: {
      name: "Annual Plan",
      price: "₹199",
      originalPrice: "₹299",
      period: "per month",
      description: "Best value with first month completely free",
      features: [
        "First month absolutely free",
        "All monthly plan features",
        "Advanced analytics dashboard",
        "Health trend tracking",
        "Family member profiles (up to 5)",
        "24/7 premium support",
        "Early access to new features"
      ],
      badge: "Best Value",
      color: "emerald",
      buttonText: "Choose Annual Plan"
    },
    enterprise: {
      name: "Enterprise Plan",
      price: "Custom",
      originalPrice: "",
      period: "pricing",
      description: "Tailored solutions for hospitals and healthcare facilities",
      features: [
        "Unlimited healthcare professional accounts",
        "Custom integration with hospital systems",
        "White-label solution available",
        "Advanced reporting and analytics",
        "Dedicated account manager",
        "On-premise deployment options",
        "Training and onboarding support",
        "Custom feature development"
      ],
      badge: "Most Comprehensive",
      color: "amber",
      buttonText: "Contact Sales Team"
    }
  }

  const handlePlanSelection = (planType: 'monthly' | 'annual' | 'enterprise') => {
    setActivePlan(planType)
  }

  const handleSubscribe = () => {
    // Handle subscription logic here
    if (activePlan === 'enterprise') {
      // Open contact form or redirect to contact page
      console.log('Opening contact form for enterprise plan')
    } else {
      // Handle payment flow
      console.log(`Subscribing to ${activePlan} plan`)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <h2 className="text-2xl font-bold text-white">Choose Your Plan</h2>
                  <p className="text-white/60 mt-1">Unlock the full potential of health predictions</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-2xl transition-colors"
                >
                  <X className="w-6 h-6 text-white/60" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Plan Toggle */}
                <div className="flex flex-wrap gap-2 mb-8 p-1 bg-white/5 rounded-2xl">
                  {Object.entries(plans).map(([key, plan]) => (
                    <button
                      key={key}
                      onClick={() => handlePlanSelection(key as any)}
                      className={`flex-1 min-w-32 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                        activePlan === key
                          ? 'bg-white/10 text-white border border-white/20'
                          : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                      }`}
                    >
                      <div className="text-center">
                        <div>{plan.name}</div>
                        <div className="text-xs opacity-60">{plan.badge}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Selected Plan Details */}
                <motion.div
                  key={activePlan}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-8"
                >
                  {/* Plan Info */}
                  <div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                      activePlan === 'monthly' ? 'bg-blue-500/20 text-blue-300' :
                      activePlan === 'annual' ? 'bg-emerald-500/20 text-emerald-300' :
                      'bg-amber-500/20 text-amber-300'
                    }`}>
                      <Star className="w-3 h-3 mr-1" />
                      {plans[activePlan].badge}
                    </div>
                    
                    <h3 className="text-3xl font-bold text-white mb-2">{plans[activePlan].name}</h3>
                    <p className="text-white/60 mb-6">{plans[activePlan].description}</p>
                    
                    <div className="flex items-baseline mb-6">
                      <span className="text-4xl font-bold text-white">{plans[activePlan].price}</span>
                      <span className="text-white/60 ml-2">/{plans[activePlan].period}</span>
                      {plans[activePlan].originalPrice && (
                        <span className="text-white/40 text-lg ml-3 line-through">
                          {plans[activePlan].originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-white">What's included:</h4>
                      {plans[activePlan].features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="text-white/80">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Section */}
                  <div className="flex flex-col justify-center">
                    {activePlan === 'enterprise' ? (
                      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/20 rounded-3xl p-8">
                        <div className="text-center mb-6">
                          <Building2 className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                          <h4 className="text-2xl font-bold text-white mb-2">Enterprise Solutions</h4>
                          <p className="text-white/60">Let's discuss your hospital's specific needs</p>
                        </div>
                        
                        <div className="space-y-4">
                          <Button 
                            onClick={handleSubscribe}
                            className="w-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-amber-300 font-medium py-4 text-lg"
                          >
                            <Phone className="w-5 h-5 mr-2" />
                            Schedule a Demo Call
                          </Button>
                          
                          <Button 
                            variant="outline"
                            className="w-full border-amber-400/30 text-amber-300 hover:bg-amber-500/10 py-4"
                          >
                            <Mail className="w-5 h-5 mr-2" />
                            Send us an Email
                          </Button>
                        </div>
                        
                        <div className="text-center mt-6">
                          <p className="text-white/40 text-sm">
                            Response within 24 hours • Custom pricing available
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className={`bg-gradient-to-r ${
                        activePlan === 'monthly' 
                          ? 'from-blue-500/10 to-purple-500/10 border-blue-400/20' 
                          : 'from-emerald-500/10 to-teal-500/10 border-emerald-400/20'
                      } border rounded-3xl p-8`}>
                        <div className="text-center mb-6">
                          <CreditCard className={`w-16 h-16 mx-auto mb-4 ${
                            activePlan === 'monthly' ? 'text-blue-400' : 'text-emerald-400'
                          }`} />
                          <h4 className="text-2xl font-bold text-white mb-2">Ready to get started?</h4>
                          <p className="text-white/60">Join thousands of users improving their health</p>
                        </div>
                        
                        <Button 
                          onClick={handleSubscribe}
                          className={`w-full font-medium py-4 text-lg ${
                            activePlan === 'monthly'
                              ? 'bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-300'
                              : 'bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-300'
                          }`}
                        >
                          {plans[activePlan].buttonText}
                        </Button>
                        
                        <div className="text-center mt-6">
                          <p className="text-white/40 text-sm">
                            {activePlan === 'monthly' 
                              ? 'No commitment • Cancel anytime • 7-day free trial'
                              : 'Save 33% annually • Cancel anytime • First month free'
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}