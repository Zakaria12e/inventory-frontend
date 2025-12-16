"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

type Language = "en" | "fr" | "es"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation()
  const savedLang = (localStorage.getItem("lang") as Language) || "en"
  const [language, setLanguageState] = useState<Language>(savedLang)

  useEffect(() => {
    i18n.changeLanguage(language)
    localStorage.setItem("lang", language)
  }, [language, i18n])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    // optional: send to backend immediately
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
    const token = localStorage.getItem("token")
    fetch(`${API_BASE}/system-settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ language: lang }),
    }).catch(() => console.warn("Failed to update language on server"))
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguage must be used within LanguageProvider")
  return context
}
