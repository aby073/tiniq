'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Language = 'uz' | 'ru'

type Dictionary = Record<string, string>

const dictionaries: Record<Language, Dictionary> = {
  uz: {
    studio: 'Studio', samples: 'Namunalar', features: 'Imkoniyatlar', pricing: 'Narxlar', start: 'Boshlash',
    heroBadge: 'FLUX AI bilan ishlaydi', heroTitle: 'Mahsulotingizni tushunadigan AI yordamchi', heroDescription: 'Mahsulot rasmini yuklang: SkySolve uning nomi, foydalari va xususiyatlarini topib, Uzum Market uchun tayyor opisaniya yozadi. Istasangiz, shu mahsulot uchun professional reklama fotosini ham yarating.', startCreating: 'Rasm yaratishni boshlash', viewSamples: 'Namunalarni ko‘rish', readySeconds: 'Soniyalarda tayyor', highQuality: 'Yuqori sifat',
    trustPhotos: 'tayyorlangan foto', trustContent: 'tezroq kontent', trustSellers: 'sotuvchi mamnuniyati',
    why: 'Nima uchun SkySolve?', whyDescription: 'Mahsulot kartangizni tezroq, chiroyliroq va sotuvga tayyorroq qiling.', smartScene: 'Aqlli sahna yaratish', smartSceneDesc: 'Mahsulotingizni saqlab qolgan holda uni istalgan fon va yorug‘likka joylashtiradi.', seconds: 'Soniyalarda tayyor', secondsDesc: 'Studiya band qilish shart emas — bir necha soniyada natijani oling.', variants: 'Cheksiz variantlar', variantsDesc: 'Turli fon, format va uslublarni sinab, eng mosini tanlang.', readyForUzum: 'Uzumga tayyor', readyForUzumDesc: 'Rasm, tavsif va atributlar — marketplace kartasiga mos bitta ish jarayonida.',
    showcaseBadge: 'SkySolve natijasi', showcaseTitle: 'Oddiy rasmdan reklama fotosigacha', showcaseDescription: 'Slayderni suring va SkySolve mahsulotni qanday o‘zgartirishini ko‘ring.', before: 'Oldin', after: 'Keyin', showcaseNote: 'Uzum katalogi, ijtimoiy tarmoq yoki reklama uchun tayyor.',
    simpleTransparent: 'Oddiy va shaffof', pricingTitle: 'Sotuvni boshlash uchun hammasi tayyor', pricingDescription: 'Avval sinab ko‘ring. Sizning mahsulotingiz uchun yaratilgan vositalar bitta joyda.', freeStart: 'Bepul boshlang', now: '/ hozir', freeDesc: 'Mahsulotlaringiz uchun dastlabki tavsif va kreativlarni tezda tayyorlang.', openStudio: 'Studio‘ni ochish', sellerPackage: 'Sotuvchi paketi', growWith: 'bilan o‘sish', recommended: 'Tavsiya', prepareProduct: 'Mahsulotni tayyorlash',
    gallery: 'Galereya', galleryDesc: 'Yaratilgan barcha fotolaringiz shu yerda saqlanadi.', noPhotos: 'Hali foto yo‘q. Studioda birinchi fotoni yarating.', signInToGallery: 'Galereyani ko‘rish uchun tizimga kiring.', generatedProductPhoto: 'Yaratilgan mahsulot fotosi', download: 'Yuklab olish', delete: 'O‘chirish',
    product: 'Mahsulot', help: 'Yordam', about: 'SkySolve haqida', howWorks: 'Qanday ishlaydi?', contact: 'Bog‘lanish', footerDesc: 'Uzum sotuvchilari uchun mahsulot rasmini, opisaniyasini va kreativini bir joyda tayyorlang.', footerTagline: 'Mahsulotingiz haqida ko‘proq gapiring. Biz esa uni chiroyli ko‘rsatamiz.', copyright: 'Barcha huquqlar himoyalangan.', aiAssistant: 'AI yordamchi · Uzum uchun yaratilgan',
    analyze: 'Mahsulotni tahlil qilish', readyDescription: 'Tayyor opisaniya', uploadTitle: 'Mahsulot rasmini yuklang', uploadDescription: 'AI mahsulotingizni tanib, Uzum uchun tayyor tavsif yaratadi.', chooseImage: 'Rasm tanlash', dragDrop: 'yoki shu yerga tashlang', analyzing: 'Mahsulot tahlil qilinmoqda…', generating: 'Rasm yaratilmoqda…', emptyResult: 'Natija shu yerda ko‘rinadi', emptyResultDesc: 'Rasm yuklang va mahsulotingiz uchun AI tavsif yoki kreativ oling.',
  },
  ru: {
    studio: 'Студия', samples: 'Примеры', features: 'Возможности', pricing: 'Тарифы', start: 'Начать',
    heroBadge: 'Работает на FLUX AI', heroTitle: 'AI-помощник, который понимает ваш продукт', heroDescription: 'Загрузите фото товара: SkySolve определит название, преимущества и характеристики, а затем подготовит описание для Uzum Market. Также можно создать профессиональное рекламное фото.', startCreating: 'Начать создание фото', viewSamples: 'Смотреть примеры', readySeconds: 'Готово за секунды', highQuality: 'Высокое качество',
    trustPhotos: 'готовых фото', trustContent: 'контент быстрее', trustSellers: 'довольных продавцов',
    why: 'Почему SkySolve?', whyDescription: 'Сделайте карточку товара быстрее, красивее и готовой к продажам.', smartScene: 'Умная сцена', smartSceneDesc: 'Сохраняет ваш продукт и помещает его в любой фон и свет.', seconds: 'Готово за секунды', secondsDesc: 'Без бронирования студии — результат через несколько секунд.', variants: 'Безграничные варианты', variantsDesc: 'Пробуйте разные фоны, форматы и стили, чтобы выбрать лучший.', readyForUzum: 'Готово для Uzum', readyForUzumDesc: 'Фото, описание и атрибуты — в одном процессе для карточки маркетплейса.',
    showcaseBadge: 'Результат SkySolve', showcaseTitle: 'От обычного фото до рекламного кадра', showcaseDescription: 'Передвиньте слайдер и увидите, как SkySolve меняет продукт.', before: 'До', after: 'После', showcaseNote: 'Готово для каталога Uzum, соцсетей и рекламы.',
    simpleTransparent: 'Просто и прозрачно', pricingTitle: 'Всё готово для старта продаж', pricingDescription: 'Попробуйте сначала. Все инструменты для вашего товара — в одном месте.', freeStart: 'Начните бесплатно', now: '/ сейчас', freeDesc: 'Быстро создавайте первые описания и креативы для своих товаров.', openStudio: 'Открыть студию', sellerPackage: 'Пакет продавца', growWith: 'расти вместе', recommended: 'Рекомендуем', prepareProduct: 'Подготовить товар',
    gallery: 'Галерея', galleryDesc: 'Все созданные фотографии хранятся здесь.', noPhotos: 'Фотографий пока нет. Создайте первую в студии.', signInToGallery: 'Войдите, чтобы открыть галерею.', generatedProductPhoto: 'Созданное фото товара', download: 'Скачать', delete: 'Удалить',
    product: 'Продукт', help: 'Помощь', about: 'О SkySolve', howWorks: 'Как это работает?', contact: 'Связаться', footerDesc: 'Создавайте фото, описания и креативы для продавцов Uzum в одном месте.', footerTagline: 'Расскажите больше о продукте. Мы поможем показать его красиво.', copyright: 'Все права защищены.', aiAssistant: 'AI-помощник · Создано для Uzum',
    analyze: 'Анализировать товар', readyDescription: 'Готовое описание', uploadTitle: 'Загрузите фото товара', uploadDescription: 'AI распознает продукт и создаст готовое описание для Uzum.', chooseImage: 'Выбрать фото', dragDrop: 'или перетащите сюда', analyzing: 'Анализируем товар…', generating: 'Создаём фото…', emptyResult: 'Результат появится здесь', emptyResultDesc: 'Загрузите фото и получите AI-описание или креатив для товара.',
  },
}

const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void; t: (key: string) => string }>({ language: 'uz', setLanguage: () => {}, t: (key) => key })

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('uz')
  useEffect(() => {
    const saved = window.localStorage.getItem('skysolve-language') as Language | null
    if (saved === 'uz' || saved === 'ru') setLanguageState(saved)
  }, [])
  useEffect(() => {
    window.localStorage.setItem('skysolve-language', language)
    document.documentElement.lang = language
  }, [language])
  const value = useMemo(() => ({ language, setLanguage: (next: Language) => setLanguageState(next), t: (key: string) => dictionaries[language][key] ?? dictionaries.uz[key] ?? key }), [language])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() { return useContext(LanguageContext) }
export type { Language }
