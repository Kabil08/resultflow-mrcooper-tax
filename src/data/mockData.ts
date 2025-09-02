export const mockRecommendations = {
  hair: {
    title: "Complete Hair Loss Treatment",
    description: "Comprehensive hair loss solutions backed by science",
    discount: 20,
    savings: 35.99,
    products: [
      {
        id: "hair-1",
        name: "Finasteride (1mg) Pills",
        description:
          "Prescription medication to block DHT and prevent hair loss",
        price: 25.99,
        image:
          "https://res.cloudinary.com/dbtapyfau/image/upload/v1756766546/hims-product-hair-finasteride-packshot-2022_rbe7yb.jpg",
      },
      {
        id: "hair-2",
        name: "Minoxidil 5% Solution",
        description: "Topical treatment to promote hair growth",
        price: 15.99,
        image:
          "https://res.cloudinary.com/dbtapyfau/image/upload/v1756766389/Hims-Minoxidil-5-Topical-Solution-Hair-Loss-Regrowth-Treatment-for-Men-2-fl-oz_07c73201-47ff-47a0-8b92-f169534d8064.b869a297c51947b1dd33006eb5a868b7_ubm1yg.jpg",
      },
      {
        id: "hair-3",
        name: "Biotin Gummies",
        description: "Hair growth vitamins with essential nutrients",
        price: 19.99,
        image:
          "https://res.cloudinary.com/dbtapyfau/image/upload/v1756766505/71YBbR_SjmL_xqvs4v.jpg",
      },
      {
        id: "hair-4",
        name: "Thickening Shampoo",
        description: "Strengthening formula for fuller-looking hair",
        price: 22.99,
        image:
          "https://res.cloudinary.com/dbtapyfau/image/upload/v1756766573/515xEtBu2dL._SL1080__wsih1y.jpg",
      },
    ],
  },
  weightLoss: {
    title: "Weight Management Solutions",
    description:
      "FDA-approved medications and comprehensive support for your weight loss journey",
    discount: 15,
    savings: 45.99,
    products: [
      {
        id: "weight-1",
        name: "Semaglutide (GLP-1)",
        description: "Prescription medication for significant weight loss",
        price: 99.99,
        image: "https://assets.forhims.com/lp/weight/semaglutide.jpg",
      },
      {
        id: "weight-2",
        name: "Appetite Management",
        description: "FDA-approved appetite suppressant medication",
        price: 79.99,
        image: "https://assets.forhims.com/lp/weight/appetite.jpg",
      },
      {
        id: "weight-3",
        name: "Weight Loss Program",
        description: "Personalized plan with nutrition guidance",
        price: 49.99,
        image: "https://assets.forhims.com/lp/weight/program.jpg",
      },
      {
        id: "weight-4",
        name: "Metabolism Booster",
        description: "Supplement to support healthy metabolism",
        price: 39.99,
        image: "https://assets.forhims.com/lp/weight/metabolism.jpg",
      },
    ],
  },
  skin: {
    title: "Advanced Skincare Collection",
    description: "Professional-grade treatments for clear, youthful skin",
    discount: 20,
    savings: 30.99,
    products: [
      {
        id: "skin-1",
        name: "Tretinoin Cream 0.025%",
        description: "Prescription retinoid for acne and anti-aging",
        price: 29.99,
        image:
          "https://res.cloudinary.com/dbtapyfau/image/upload/v1756766864/61k16ARHHHL._UF1000_1000_QL80__icozzn.jpg",
      },
      {
        id: "skin-2",
        name: "Anti-Aging Serum",
        description: "Advanced formula with peptides and antioxidants",
        price: 45.99,
        image:
          "https://res.cloudinary.com/dbtapyfau/image/upload/v1756766917/411eb8d67a0886c0745a2cd0dca37dbd_d8vzk6.jpg",
      },
      {
        id: "skin-3",
        name: "Gentle Cleanser",
        description: "pH-balanced face wash for all skin types",
        price: 19.99,
        image:
          "https://res.cloudinary.com/dbtapyfau/image/upload/v1756766932/611y-3TRWmL._UF894_1000_QL80__hmqg1s.jpg",
      },
      {
        id: "skin-4",
        name: "Dark Spot Treatment",
        description: "Targeted solution for hyperpigmentation",
        price: 34.99,
        image:
          "https://res.cloudinary.com/dbtapyfau/image/upload/v1756766947/81xmf0WfZTL._UF1000_1000_QL80__akyv0l.jpg",
      },
    ],
  },
  mental: {
    title: "Mental Health Support",
    description: "Professional care and medication for anxiety and depression",
    discount: 10,
    savings: 25.99,
    products: [
      {
        id: "mental-1",
        name: "Escitalopram 10mg",
        description: "Prescription medication for anxiety and depression",
        price: 45.99,
        image: "https://assets.forhims.com/lp/mental/escitalopram.jpg",
      },
      {
        id: "mental-2",
        name: "Online Therapy",
        description: "Virtual sessions with licensed therapists",
        price: 85.0,
        image: "https://assets.forhims.com/lp/mental/therapy.jpg",
      },
      {
        id: "mental-3",
        name: "Stress Management Kit",
        description: "Comprehensive toolkit for anxiety relief",
        price: 39.99,
        image: "https://assets.forhims.com/lp/mental/stress-kit.jpg",
      },
      {
        id: "mental-4",
        name: "Sleep Support",
        description: "Natural supplement for better sleep",
        price: 29.99,
        image: "https://assets.forhims.com/lp/mental/sleep.jpg",
      },
    ],
  },
};

export const mockUserData = {
  paymentMethod: {
    cardType: "Bank of America",
    lastFourDigits: "4532",
    cardImage: "https://assets.forhims.com/cards/boa.png",
    discount: 6,
  },
  address: {
    street: "123 Main St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
  },
  addresses: [
    {
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
    },
  ],
};
