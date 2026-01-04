import styles from './Landing1Page.module.css'
import BrandHero from '@/components/BrandHero/BrandHero'
import Headline from '@/components/Headline/Headline'
import Photo from '@/components/Photo/Photo'
import { GalleryImage } from '@/lib/image-hat'

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

      <div className={styles.photoSection}>
        <Photo image={hardCodedImage} />
      </div>
    </div>
  )
}

