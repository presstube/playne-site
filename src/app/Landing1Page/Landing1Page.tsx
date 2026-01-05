'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './Landing1Page.module.css'
import BrandHero from '@/components/BrandHero/BrandHero'
import Headline from '@/components/Headline/Headline'
import Photo from '@/components/Photo/Photo'
import TitleBodyQuote from '@/components/TitleBodyQuote/TitleBodyQuote'
import { GalleryImage, pickRandomImage } from '@/lib/image-hat'
import { client } from '@/sanity/lib/client'
import { allGalleryImagesQuery } from '@/sanity/lib/galleries-queries'

// Hard-coded image data
const hardCodedImage: GalleryImage = {
  altText: "Shantell Martin × PLAYNE collaboration (Image 4)",
  assetId: "image-6dea8898205814996463a0f3fa203d9eec5e4cb2-1000x667-jpg",
  caption: "Shantell Martin × PLAYNE collaboration (Image 4)",
  dimensions: {
    aspectRatio: 1.4992503748125936,
    height: 667,
    width: 1000
  },
  gallerySlug: "shantell-martin-playne",
  galleryTitle: "Shantell Martin × PLAYNE",
  imageAsset: {
    _ref: "image-6dea8898205814996463a0f3fa203d9eec5e4cb2-1000x667-jpg",
    _type: "reference"
  },
  lqip: "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAANABQDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAcEBQb/xAAhEAACAgICAgMBAAAAAAAAAAACAwEEABEFQQYTBxIhM//EABUBAQEAAAAAAAAAAAAAAAAAAAEC/8QAGxEAAgEFAAAAAAAAAAAAAAAAAAECERITMXH/2gAMAwEAAhEDEQA/ANr5TzqagoGswDQ9orFk9b7icvOPsqqIQh9kTMogBJhxtk4kD5Kz5pUq1rxwhevbpMRH7EZO+PORYji+RO2MXIQwvQLZ/kUdxOFUulqLehtu8ioIexE2Bg1F9CjfeGIe0c2LLXN3JsKSKd94ZN6HGf/Z",
  metadata: {
    dimensions: {
      aspectRatio: 1.4992503748125936,
      height: 667,
      width: 1000
    },
    lqip: "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAANABQDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAcEBQb/xAAhEAACAgICAgMBAAAAAAAAAAACAwEEABEFQQYTBxIhM//EABUBAQEAAAAAAAAAAAAAAAAAAAEC/8QAGxEAAgEFAAAAAAAAAAAAAAAAAAECERITMXH/2gAMAwEAAhEDEQA/ANr5TzqagoGswDQ9orFk9b7icvOPsqqIQh9kTMogBJhxtk4kD5Kz5pUq1rxwhevbpMRH7EZO+PORYji+RO2MXIQwvQLZ/kUdxOFUulqLehtu8ioIexE2Bg1F9CjfeGIe0c2LLXN3JsKSKd94ZN6HGf/Z"
  },
  photographer: "Shantell Martin",
  url: "https://cdn.sanity.io/images/dg1810se/production/6dea8898205814996463a0f3fa203d9eec5e4cb2-1000x667.jpg"
}

export default function Landing1Page() {
  const [pillarImage, setPillarImage] = useState<GalleryImage | null>(null)

  // Fetch the specific pillar image
  useEffect(() => {
    async function fetchPillarImage() {
      try {
        const allImages = await client.fetch(allGalleryImagesQuery)
        const specificImage = allImages.find(
          (img: GalleryImage) => img.assetId === 'image-f804373c1d301de9db9df3a72493c1556003120b-4240x2384-jpg'
        )
        if (specificImage) {
          setPillarImage(specificImage)
        }
      } catch (error) {
        console.error('Error fetching pillar image:', error)
      }
    }
    fetchPillarImage()
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.heroSection}>
        <BrandHero />
      </div>
      
      <div className={styles.headlineSection}>
        <Headline
          text="Teaching the things we wish we learned in school"
          caseType="title-case"
          align="center"
          fg="var(--brand-black)"
          bg="transparent"
        />
      </div>

      <div className={styles.splitSection}>
        <div className={styles.leftColumn}>
          <TitleBodyQuote
            subtitle="What if school taught you about YOU?"
            body="Founded by renowned artist Shantell Martin, PLAYNE brings creativity into classrooms and community spaces to teach real-life skills. We help young people understand their bodies, emotions, money, and voice—the things that matter most but often get skipped in traditional education. Our lessons are hands-on, multisensory, and built around one simple idea: students should explore who they are before being told who to be."
            quote="We give young people the space to discover themselves, not just pass tests."
            fg="var(--brand-offwhite)"
            bg="var(--brand-black)"
          />
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.photoWrapper}>
            <Photo image={hardCodedImage} />
          </div>
        </div>
      </div>

      {/* Second Section: Four Pillars */}
      <div className={styles.pillarsSection}>
        <Headline
          text="Four Pathways to Discovering You"
          caseType="title-case"
          align="center"
          fg="var(--brand-black)"
          bg="transparent"
        />
      </div>

      <div className={styles.pillarsSplitSection}>
        <div className={styles.pillarsLeftColumn}>
          {pillarImage ? (
            <div className={styles.photoWrapper}>
              <Photo image={pillarImage} />
            </div>
          ) : (
            <p>Loading image...</p>
          )}
        </div>

        <div className={styles.pillarsRightColumn}>
          {/* Original version:
          <TitleBodyQuote
            subtitle="The Four Pillars of PLAYNE"
            body="Anatomy & Body Awareness. Wellness & Self-Care. Nutrition & Healthy Living. Financial Literacy. These aren't separate subjects—they're four interconnected pathways to understanding yourself and building the life you want. When students learn how their body works, they also learn how to care for it. When they understand what fuels them, they can make smarter choices. PLAYNE connects the dots between body, mind, and everyday life."
            quote="Confidence grows when you understand yourself—inside and out."
            fg="var(--brand-black)"
            bg="var(--brand-yellow)"
          />
          */}
          <TitleBodyQuote
            subtitle="The Four Pillars of PLAYNE"
            body="Think of them as the primary colors in your life's composition. Anatomy & Body Awareness. Wellness & Self-Care. Nutrition & Healthy Living. Financial Literacy. When you learn these fundamentals young, you gain the perspective to see your whole life as a work of art—understanding balance, contrast, harmony, and flow. Just like an artist mixes colors to create something new, these pillars blend together to help you create the life you want."
            quote="What if every child learned to paint their own future with confidence?"
            fg="var(--brand-black)"
            bg="var(--brand-yellow)"
          />
        </div>
      </div>
    </div>
  )
}

