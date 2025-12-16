import { Language } from '@/types';

// Dashboard UI translations
export const dashboardTranslations: Record<Language, {
  helping: string;
  yearsOld: string;
  familyMembers: string;
  addFamilyMember: string;
  whoIsThis: string;
  noFamilyMembersYet: string;
  addFamilyMemberDescription: string;
  addFirstFamilyMember: string;
  familyMembersTitle: string;
  failedToLoad: string;
  failedToCreate: string;
  failedToDelete: string;
  confirmDelete: string;
  welcome: string;
  welcomeDescription: string;
  patientName: string;
  patientNamePlaceholder: string;
  age: string;
  agePlaceholder: string;
  notes: string;
  notesPlaceholder: string;
  continue: string;
  settingUp: string;
  edit: string;
  delete: string;
  call: string;
}> = {
  'en-IN': {
    helping: 'Helping',
    yearsOld: 'years old',
    familyMembers: 'Family Members',
    addFamilyMember: 'Add Family Member',
    whoIsThis: 'Who Is This?',
    noFamilyMembersYet: 'No family members added yet',
    addFamilyMemberDescription: 'Add family members so {name} can recognize them',
    addFirstFamilyMember: 'Add First Family Member',
    familyMembersTitle: 'Family Members',
    failedToLoad: 'Failed to load data. Please try again.',
    failedToCreate: 'Failed to create patient. Please try again.',
    failedToDelete: 'Failed to delete. Please try again.',
    confirmDelete: 'Are you sure you want to remove this person?',
    welcome: 'Welcome to YaadKar!',
    welcomeDescription: "First, tell us about the person you're helping",
    patientName: "Patient's Name *",
    patientNamePlaceholder: 'e.g., Grandma Kamla',
    age: 'Age (optional)',
    agePlaceholder: 'e.g., 75',
    notes: 'Notes (optional)',
    notesPlaceholder: 'e.g., Loves gardening, morning person, prefers Hindi',
    continue: 'Continue',
    settingUp: 'Setting up...',
    edit: 'Edit',
    delete: 'Delete',
    call: 'Call'
  },
  'hi-IN': {
    helping: 'सहायता कर रहे हैं',
    yearsOld: 'वर्ष के',
    familyMembers: 'परिवार के सदस्य',
    addFamilyMember: 'परिवार का सदस्य जोड़ें',
    whoIsThis: 'यह कौन है?',
    noFamilyMembersYet: 'अभी तक कोई परिवार का सदस्य नहीं जोड़ा गया',
    addFamilyMemberDescription: 'परिवार के सदस्य जोड़ें ताकि {name} उन्हें पहचान सकें',
    addFirstFamilyMember: 'पहला परिवार का सदस्य जोड़ें',
    familyMembersTitle: 'परिवार के सदस्य',
    failedToLoad: 'डेटा लोड करने में विफल। कृपया पुनः प्रयास करें।',
    failedToCreate: 'रोगी बनाने में विफल। कृपया पुनः प्रयास करें।',
    failedToDelete: 'हटाने में विफल। कृपया पुनः प्रयास करें।',
    confirmDelete: 'क्या आप वाकई इस व्यक्ति को हटाना चाहते हैं?',
    welcome: 'YaadKar में आपका स्वागत है!',
    welcomeDescription: 'पहले, हमें उस व्यक्ति के बारे में बताएं जिसकी आप मदद कर रहे हैं',
    patientName: 'रोगी का नाम *',
    patientNamePlaceholder: 'जैसे, दादी कमला',
    age: 'उम्र (वैकल्पिक)',
    agePlaceholder: 'जैसे, 75',
    notes: 'नोट्स (वैकल्पिक)',
    notesPlaceholder: 'जैसे, बागवानी पसंद है, सुबह के व्यक्ति, हिंदी पसंद करते हैं',
    continue: 'जारी रखें',
    settingUp: 'सेटअप हो रहा है...',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    call: 'कॉल करें'
  },
  'ta-IN': {
    helping: 'உதவி செய்கிறோம்',
    yearsOld: 'வயது',
    familyMembers: 'குடும்ப உறுப்பினர்கள்',
    addFamilyMember: 'குடும்ப உறுப்பினரைச் சேர்',
    whoIsThis: 'இது யார்?',
    noFamilyMembersYet: 'இன்னும் குடும்ப உறுப்பினர்கள் சேர்க்கப்படவில்லை',
    addFamilyMemberDescription: 'குடும்ப உறுப்பினர்களைச் சேர்க்கவும், {name} அவர்களை அடையாளம் காண முடியும்',
    addFirstFamilyMember: 'முதல் குடும்ப உறுப்பினரைச் சேர்',
    familyMembersTitle: 'குடும்ப உறுப்பினர்கள்',
    failedToLoad: 'தரவை ஏற்ற முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்।',
    failedToCreate: 'நோயாளியை உருவாக்க முடியவில்லை। தயவுசெய்து மீண்டும் முயற்சிக்கவும்।',
    failedToDelete: 'நீக்க முடியவில்லை। தயவுசெய்து மீண்டும் முயற்சிக்கவும்।',
    confirmDelete: 'இந்த நபரை நீக்க விரும்புகிறீர்களா?',
    welcome: 'YaadKar-க்கு வரவேற்கிறோம்!',
    welcomeDescription: 'முதலில், நீங்கள் உதவும் நபரைப் பற்றி எங்களுக்குச் சொல்லுங்கள்',
    patientName: 'நோயாளியின் பெயர் *',
    patientNamePlaceholder: 'எ.கா., பாட்டி கமலா',
    age: 'வயது (விருப்பமானது)',
    agePlaceholder: 'எ.கா., 75',
    notes: 'குறிப்புகள் (விருப்பமானது)',
    notesPlaceholder: 'எ.கா., தோட்டக்கலை விரும்புகிறார், காலை நபர், தமிழ் விரும்புகிறார்',
    continue: 'தொடரவும்',
    settingUp: 'அமைக்கப்படுகிறது...',
    edit: 'திருத்து',
    delete: 'நீக்கு',
    call: 'அழை'
  },
  'te-IN': {
    helping: 'సహాయం చేస్తున్నాము',
    yearsOld: 'సంవత్సరాలు',
    familyMembers: 'కుటుంబ సభ్యులు',
    addFamilyMember: 'కుటుంబ సభ్యుడిని జోడించండి',
    whoIsThis: 'ఇది ఎవరు?',
    noFamilyMembersYet: 'ఇంకా కుటుంబ సభ్యులు జోడించబడలేదు',
    addFamilyMemberDescription: 'కుటుంబ సభ్యులను జోడించండి, {name} వారిని గుర్తించగలరు',
    addFirstFamilyMember: 'మొదటి కుటుంబ సభ్యుడిని జోడించండి',
    familyMembersTitle: 'కుటుంబ సభ్యులు',
    failedToLoad: 'డేటా లోడ్ చేయడంలో విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి।',
    failedToCreate: 'రోగిని సృష్టించడంలో విఫలమైంది। దయచేసి మళ్లీ ప్రయత్నించండి।',
    failedToDelete: 'తొలగించడంలో విఫలమైంది। దయచేసి మళ్లీ ప్రయత్నించండి।',
    confirmDelete: 'మీరు ఖచ్చితంగా ఈ వ్యక్తిని తొలగించాలనుకుంటున్నారా?',
    welcome: 'YaadKar-కు స్వాగతం!',
    welcomeDescription: 'మొదట, మీరు సహాయం చేస్తున్న వ్యక్తి గురించి మాకు చెప్పండి',
    patientName: 'రోగి పేరు *',
    patientNamePlaceholder: 'ఉదా., అమ్మమ్మ కమల',
    age: 'వయస్సు (ఐచ్ఛికం)',
    agePlaceholder: 'ఉదా., 75',
    notes: 'నోట్స్ (ఐచ్ఛికం)',
    notesPlaceholder: 'ఉదా., తోటపని ఇష్టం, ఉదయం వ్యక్తి, తెలుగు ఇష్టం',
    continue: 'కొనసాగించు',
    settingUp: 'సెటప్ చేయబడుతోంది...',
    edit: 'సవరించు',
    delete: 'తొలగించు',
    call: 'కాల్ చేయండి'
  },
  'mr-IN': {
    helping: 'मदत करत आहोत',
    yearsOld: 'वर्षांचे',
    familyMembers: 'कुटुंबातील सदस्य',
    addFamilyMember: 'कुटुंबातील सदस्य जोडा',
    whoIsThis: 'हा कोण आहे?',
    noFamilyMembersYet: 'अद्याप कुटुंबातील सदस्य जोडलेले नाहीत',
    addFamilyMemberDescription: 'कुटुंबातील सदस्य जोडा जेणेकरून {name} त्यांना ओळखू शकेल',
    addFirstFamilyMember: 'पहिला कुटुंबातील सदस्य जोडा',
    familyMembersTitle: 'कुटुंबातील सदस्य',
    failedToLoad: 'डेटा लोड करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा।',
    failedToCreate: 'रुग्ण तयार करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा।',
    failedToDelete: 'हटवण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा।',
    confirmDelete: 'तुम्हाला खात्री आहे की तुम्ही ही व्यक्ती हटवू इच्छिता?',
    welcome: 'YaadKar मध्ये आपले स्वागत आहे!',
    welcomeDescription: 'प्रथम, तुम्ही मदत करत असलेल्या व्यक्तीबद्दल आम्हाला सांगा',
    patientName: 'रुग्णाचे नाव *',
    patientNamePlaceholder: 'उदा., आजी कमला',
    age: 'वय (पर्यायी)',
    agePlaceholder: 'उदा., 75',
    notes: 'नोट्स (पर्यायी)',
    notesPlaceholder: 'उदा., बागकाम आवडते, सकाळचा व्यक्ती, मराठी आवडते',
    continue: 'सुरू ठेवा',
    settingUp: 'सेटअप होत आहे...',
    edit: 'संपादित करा',
    delete: 'हटवा',
    call: 'कॉल करा'
  },
  'bn-IN': {
    helping: 'সাহায্য করছি',
    yearsOld: 'বছর বয়সী',
    familyMembers: 'পরিবারের সদস্য',
    addFamilyMember: 'পরিবারের সদস্য যোগ করুন',
    whoIsThis: 'এটা কে?',
    noFamilyMembersYet: 'এখনও কোনো পরিবারের সদস্য যোগ করা হয়নি',
    addFamilyMemberDescription: 'পরিবারের সদস্য যোগ করুন যাতে {name} তাদের চিনতে পারে',
    addFirstFamilyMember: 'প্রথম পরিবারের সদস্য যোগ করুন',
    familyMembersTitle: 'পরিবারের সদস্য',
    failedToLoad: 'ডেটা লোড করতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।',
    failedToCreate: 'রোগী তৈরি করতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।',
    failedToDelete: 'মুছে ফেলতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।',
    confirmDelete: 'আপনি কি নিশ্চিত যে আপনি এই ব্যক্তিকে সরাতে চান?',
    welcome: 'YaadKar-এ স্বাগতম!',
    welcomeDescription: 'প্রথমে, আপনি যে ব্যক্তিকে সাহায্য করছেন তার সম্পর্কে আমাদের বলুন',
    patientName: 'রোগীর নাম *',
    patientNamePlaceholder: 'যেমন, দাদি কমলা',
    age: 'বয়স (ঐচ্ছিক)',
    agePlaceholder: 'যেমন, 75',
    notes: 'নোট (ঐচ্ছিক)',
    notesPlaceholder: 'যেমন, বাগান করা পছন্দ, সকালের ব্যক্তি, বাংলা পছন্দ',
    continue: 'চালিয়ে যান',
    settingUp: 'সেটআপ হচ্ছে...',
    edit: 'সম্পাদনা করুন',
    delete: 'মুছে ফেলুন',
    call: 'কল করুন'
  },
  'gu-IN': {
    helping: 'મદદ કરી રહ્યા છીએ',
    yearsOld: 'વર્ષની',
    familyMembers: 'કુટુંબના સભ્યો',
    addFamilyMember: 'કુટુંબના સભ્યને ઉમેરો',
    whoIsThis: 'આ કોણ છે?',
    noFamilyMembersYet: 'હજુ સુધી કોઈ કુટુંબના સભ્યો ઉમેરાયા નથી',
    addFamilyMemberDescription: 'કુટુંબના સભ્યો ઉમેરો જેથી {name} તેમને ઓળખી શકે',
    addFirstFamilyMember: 'પહેલો કુટુંબનો સભ્ય ઉમેરો',
    familyMembersTitle: 'કુટુંબના સભ્યો',
    failedToLoad: 'ડેટા લોડ કરવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો।',
    failedToCreate: 'રોગી બનાવવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો।',
    failedToDelete: 'કાઢી નાખવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો।',
    confirmDelete: 'શું તમે ખરેખર આ વ્યક્તિને દૂર કરવા માંગો છો?',
    welcome: 'YaadKar માં આપનું સ્વાગત છે!',
    welcomeDescription: 'પહેલા, તમે જે વ્યક્તિની મદદ કરી રહ્યા છો તેના વિશે અમને કહો',
    patientName: 'રોગીનું નામ *',
    patientNamePlaceholder: 'ઉદા., દાદી કમલા',
    age: 'ઉંમર (વૈકલ્પિક)',
    agePlaceholder: 'ઉદા., 75',
    notes: 'નોંધો (વૈકલ્પિક)',
    notesPlaceholder: 'ઉદા., બાગકામ ગમે છે, સવારની વ્યક્તિ, ગુજરાતી ગમે છે',
    continue: 'ચાલુ રાખો',
    settingUp: 'સેટઅપ થઈ રહ્યું છે...',
    edit: 'સંપાદિત કરો',
    delete: 'કાઢી નાખો',
    call: 'કૉલ કરો'
  }
};

export function getDashboardTranslation(language: Language, key: keyof typeof dashboardTranslations['en-IN']): string {
  return dashboardTranslations[language]?.[key] || dashboardTranslations['en-IN'][key];
}




