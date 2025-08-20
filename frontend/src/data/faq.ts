import {
  Heart,
  Lock,
  Shield,
  Phone,
  Clock,
  Users,
  Award,
  HelpCircle,
  MessageCircle,
  TestTube,
  Pill,
} from "lucide-react";

export const faqCategories = [
  {
    id: "privacy",
    name: "Privacy & Confidentiality",
    icon: Lock,
  },
  {
    id: "services",
    name: "Services & Treatment",
    icon: Heart,
  },
  {
    id: "appointments",
    name: "Appointments & Booking",
    icon: Clock,
  },
  {
    id: "testing",
    name: "Testing & Results",
    icon: TestTube,
  },
  {
    id: "payment",
    name: "Payment & Insurance",
    icon: Award,
  },
  {
    id: "general",
    name: "General Questions",
    icon: HelpCircle,
  },
];

export const faqData = [
  // Privacy & Confidentiality
  {
    category: "privacy",
    question: "Is my visit to the clinic completely confidential?",
    answer:
      "Yes, absolutely. All consultations, treatments, and medical records are kept strictly confidential. We follow strict privacy protocols and will never share your information without your explicit consent. Our staff are bound by medical confidentiality agreements.",
    additionalInfo:
      "We use secure systems for all medical records and communications.",
  },
  {
    category: "privacy",
    question: "Will my insurance company know about my visit?",
    answer:
      "If you use insurance, your insurance company will receive basic information about the services provided, but specific details of your consultation remain confidential. You can also choose to pay privately to ensure no insurance records are created.",
    additionalInfo:
      "We offer flexible payment options to protect your privacy.",
  },
  {
    category: "privacy",
    question: "Can I use a different name for my appointment?",
    answer:
      "For medical and legal reasons, we require your real name for treatment. However, we understand privacy concerns and can discuss discrete scheduling options. All staff are trained in confidential handling of sensitive information.",
    additionalInfo:
      "We can arrange private entrances and discrete appointment times if needed.",
  },
  {
    category: "privacy",
    question: "Who has access to my medical records?",
    answer:
      "Only your treating physician and essential medical staff involved in your care have access to your records. All staff sign confidentiality agreements and are trained in privacy protection. Records are stored securely and access is logged.",
    additionalInfo:
      "You have the right to request who has accessed your records at any time.",
  },

  // Services & Treatment
  {
    category: "services",
    question: "What sexual health services do you provide?",
    answer:
      "We offer comprehensive sexual health services including HIV testing and prevention (PrEP/PEP), STI screening and treatment, contraception services, HPV vaccination, sexual health consultations, and relationship counseling. All services are provided in a judgment-free environment.",
    additionalInfo:
      "Our specialists are board-certified in sexual health and infectious diseases.",
  },
  {
    category: "services",
    question: "Do you provide emergency contraception?",
    answer:
      "Yes, we provide emergency contraception (morning-after pill) with same-day consultations. We also offer comprehensive counseling about future contraceptive options and reproductive health planning.",
    additionalInfo:
      "Emergency contraception is most effective when taken within 72 hours.",
  },
  {
    category: "services",
    question: "What is PrEP and am I a good candidate?",
    answer:
      "PrEP (Pre-Exposure Prophylaxis) is a daily medication that prevents HIV infection. You may be a good candidate if you're at higher risk of HIV exposure. Our specialists will assess your individual risk factors and medical history to determine if PrEP is right for you.",
    additionalInfo:
      "PrEP is over 99% effective when taken consistently as prescribed.",
  },
  {
    category: "services",
    question: "Do you treat all types of STIs?",
    answer:
      "Yes, we diagnose and treat all common sexually transmitted infections including chlamydia, gonorrhea, syphilis, herpes, HPV, and others. We provide both testing and comprehensive treatment plans, including partner notification support if needed.",
    additionalInfo: "Most STIs are easily treatable with proper medical care.",
  },

  // Appointments & Booking
  {
    category: "appointments",
    question: "How do I book an appointment?",
    answer:
      "You can book appointments online through our secure booking system, call our confidential helpline at +66 2 123 4567, or visit our clinic in person. We offer same-day appointments for urgent concerns and emergency situations.",
    additionalInfo: "Online booking is available 24/7 for your convenience.",
  },
  {
    category: "appointments",
    question: "Do you offer same-day appointments?",
    answer:
      "Yes, we reserve slots for same-day appointments, especially for urgent sexual health concerns like potential exposure incidents or emergency contraception. Call us as early as possible for same-day availability.",
    additionalInfo:
      "Emergency consultations are available 24/7 for critical situations.",
  },
  {
    category: "appointments",
    question: "What should I expect during my first visit?",
    answer:
      "Your first visit will include a confidential consultation with one of our specialists, a review of your medical history, discussion of your concerns, and development of a personalized care plan. We'll explain all procedures and ensure you're comfortable throughout.",
    additionalInfo:
      "First visits typically take 45-60 minutes to ensure comprehensive care.",
  },
  {
    category: "appointments",
    question: "Can I bring a partner or friend to my appointment?",
    answer:
      "Yes, you're welcome to bring a support person to your appointment if it makes you more comfortable. However, certain parts of the consultation may need to be conducted privately to ensure complete confidentiality and accurate medical assessment.",
    additionalInfo:
      "We also offer couple's consultations for relationship and sexual health concerns.",
  },

  // Testing & Results
  {
    category: "testing",
    question: "How long does it take to get test results?",
    answer:
      "Most STI test results are available within 24-48 hours. HIV rapid tests provide results in 20 minutes, while confirmatory tests take 1-2 days. We'll contact you as soon as results are available and schedule follow-up if needed.",
    additionalInfo:
      "We offer secure online result access through our patient portal.",
  },
  {
    category: "testing",
    question: "What happens if my test results are positive?",
    answer:
      "If you test positive for any condition, we'll schedule an immediate follow-up consultation to discuss treatment options, provide emotional support, and develop a comprehensive care plan. We also offer partner notification services and ongoing monitoring.",
    additionalInfo:
      "Most sexual health conditions are highly treatable with proper medical care.",
  },
  {
    category: "testing",
    question: "How often should I get tested for STIs?",
    answer:
      "Testing frequency depends on your individual risk factors, sexual activity, and number of partners. Generally, sexually active individuals should be tested annually, but those at higher risk may need more frequent testing. We'll provide personalized recommendations.",
    additionalInfo:
      "Regular testing is an important part of maintaining sexual health.",
  },
  {
    category: "testing",
    question: "Is HIV testing really free?",
    answer:
      "Yes, we provide free HIV testing as part of our community health commitment. This includes pre-test counseling, the test itself, post-test counseling, and referral for treatment if needed. No insurance or payment is required.",
    additionalInfo:
      "Free testing is available to everyone regardless of insurance status.",
  },

  // Payment & Insurance
  {
    category: "payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept cash, credit cards, bank transfers, and most major insurance plans. We also offer payment plans for more expensive treatments and can discuss financial assistance options if needed.",
    additionalInfo: "Payment plans can be arranged for treatments over ₿2,000.",
  },
  {
    category: "payment",
    question: "Do you accept insurance?",
    answer:
      "Yes, we accept most major insurance plans. However, you can also choose to pay privately if you prefer not to use insurance for privacy reasons. Our staff can help verify your coverage and explain your options.",
    additionalInfo:
      "Private payment ensures no insurance records of your visit.",
  },
  {
    category: "payment",
    question: "Are there any hidden costs?",
    answer:
      "No, we believe in transparent pricing. All costs are discussed upfront before any treatment begins. Our website lists starting prices for all services, and we'll provide detailed cost estimates during your consultation.",
    additionalInfo:
      "We never charge for services without your prior knowledge and consent.",
  },
  {
    category: "payment",
    question: "Do you offer financial assistance?",
    answer:
      "Yes, we have financial assistance programs for patients who need help covering treatment costs. We also work with several sexual health organizations that provide funding for specific services. Please speak with our staff about available options.",
    additionalInfo:
      "No one should avoid necessary sexual health care due to financial concerns.",
  },

  // General Questions
  {
    category: "general",
    question: "What age groups do you serve?",
    answer:
      "We provide sexual health services to adults 18 and older. For patients under 18, we require parental consent for most services, though some confidential services may be available depending on local laws and circumstances.",
    additionalInfo:
      "We have specialists experienced in adolescent sexual health when needed.",
  },
  {
    category: "general",
    question: "Do you provide services for LGBTQ+ individuals?",
    answer:
      "Absolutely. We are committed to providing inclusive, culturally competent care for all individuals regardless of sexual orientation or gender identity. Our staff receive specialized training in LGBTQ+ health needs and concerns.",
    additionalInfo:
      "We maintain a safe, welcoming environment for all patients.",
  },
  {
    category: "general",
    question: "What are your clinic hours?",
    answer:
      "We're open Monday through Friday 9AM-7PM, and Saturday 9AM-5PM. We're closed on Sundays except for emergencies. Extended hours and weekend appointments may be available for urgent situations.",
    additionalInfo:
      "Emergency consultations are available 24/7 by calling our helpline.",
  },
  {
    category: "general",
    question: "Where is your clinic located?",
    answer:
      "Our clinic is conveniently located at 123 Wellness Street in Bangkok, with discrete parking and private entrances available. We're easily accessible by public transportation and offer detailed directions upon booking.",
    additionalInfo:
      "We can provide specific directions and parking information when you book.",
  },
  {
    category: "general",
    question: "Are your doctors qualified specialists?",
    answer:
      "Yes, all our physicians are board-certified specialists in sexual health, infectious diseases, or related fields. They have extensive experience in sexual health care and receive ongoing training in the latest treatments and best practices.",
    additionalInfo:
      "Our team includes specialists in HIV medicine, reproductive health, and sexual therapy.",
  },
];
