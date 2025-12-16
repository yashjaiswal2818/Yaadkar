import { Person, Language } from '@/types';

// Speech templates for each language
const templates: Record<Language, {
  intro: string;
  nickname: string;
  relationship: string;
  askAbout: string;
  remember: string;
}> = {
  'en-IN': {
    intro: 'This is {name}',
    nickname: 'You call them {nickname}',
    relationship: 'They are your {relationship}',
    askAbout: 'You can ask about: {topics}',
    remember: 'Remember: {memories}'
  },
  'hi-IN': {
    intro: 'यह {name} है',
    nickname: 'आप इन्हें {nickname} बुलाते हैं',
    relationship: 'यह आपके {relationship} हैं',
    askAbout: 'आप पूछ सकते हैं: {topics}',
    remember: 'याद रखें: {memories}'
  },
  'ta-IN': {
    intro: 'இது {name}',
    nickname: 'நீங்கள் அவர்களை {nickname} என்று அழைக்கிறீர்கள்',
    relationship: 'அவர்கள் உங்கள் {relationship}',
    askAbout: 'நீங்கள் கேட்கலாம்: {topics}',
    remember: 'நினைவில் கொள்ளுங்கள்: {memories}'
  },
  'te-IN': {
    intro: 'ఇది {name}',
    nickname: 'మీరు వారిని {nickname} అని పిలుస్తారు',
    relationship: 'వారు మీ {relationship}',
    askAbout: 'మీరు అడగవచ్చు: {topics}',
    remember: 'గుర్తుంచుకోండి: {memories}'
  },
  'mr-IN': {
    intro: 'हे {name} आहेत',
    nickname: 'तुम्ही त्यांना {nickname} म्हणता',
    relationship: 'ते तुमचे {relationship} आहेत',
    askAbout: 'तुम्ही विचारू शकता: {topics}',
    remember: 'लक्षात ठेवा: {memories}'
  },
  'bn-IN': {
    intro: 'এটি {name}',
    nickname: 'আপনি তাদের {nickname} বলেন',
    relationship: 'তারা আপনার {relationship}',
    askAbout: 'আপনি জিজ্ঞাসা করতে পারেন: {topics}',
    remember: 'মনে রাখবেন: {memories}'
  },
  'gu-IN': {
    intro: 'આ {name} છે',
    nickname: 'તમે તેમને {nickname} કહો છો',
    relationship: 'તેઓ તમારા {relationship} છે',
    askAbout: 'તમે પૂછી શકો છો: {topics}',
    remember: 'યાદ રાખો: {memories}'
  }
};

// Relationship translations
export const relationships: Record<Language, Record<string, string>> = {
  'en-IN': {
    'Father': 'father',
    'Mother': 'mother',
    'Son': 'son',
    'Daughter': 'daughter',
    'Grandfather': 'grandfather',
    'Grandmother': 'grandmother',
    'Grandson': 'grandson',
    'Granddaughter': 'granddaughter',
    'Spouse': 'spouse',
    'Husband': 'husband',
    'Wife': 'wife',
    'Brother': 'brother',
    'Sister': 'sister',
    'Uncle': 'uncle',
    'Aunt': 'aunt',
    'Cousin': 'cousin',
    'Nephew': 'nephew',
    'Niece': 'niece',
    'Son-in-law': 'son-in-law',
    'Daughter-in-law': 'daughter-in-law',
    'Brother-in-law': 'brother-in-law',
    'Sister-in-law': 'sister-in-law',
    'Father-in-law': 'father-in-law',
    'Mother-in-law': 'mother-in-law',
    'Friend': 'friend',
    'Best Friend': 'best friend',
    'Caregiver': 'caregiver',
    'Nurse': 'nurse',
    'Doctor': 'doctor',
    'Neighbor': 'neighbor',
    'Teacher': 'teacher',
    'Colleague': 'colleague',
    'Other': 'other'
  },
  'hi-IN': {
    'Father': 'पिता',
    'Mother': 'माँ',
    'Son': 'बेटे',
    'Daughter': 'बेटी',
    'Grandfather': 'दादा/नाना',
    'Grandmother': 'दादी/नानी',
    'Grandson': 'पोते',
    'Granddaughter': 'पोती',
    'Spouse': 'पति/पत्नी',
    'Husband': 'पति',
    'Wife': 'पत्नी',
    'Brother': 'भाई',
    'Sister': 'बहन',
    'Uncle': 'चाचा/मामा/फूफा',
    'Aunt': 'चाची/मामी/बुआ',
    'Cousin': 'चचेरा/ममेरा भाई/बहन',
    'Nephew': 'भतीजा',
    'Niece': 'भतीजी',
    'Son-in-law': 'दामाद',
    'Daughter-in-law': 'बहू',
    'Brother-in-law': 'जीजा/देवर',
    'Sister-in-law': 'जेठानी/ननद',
    'Father-in-law': 'ससुर',
    'Mother-in-law': 'सास',
    'Friend': 'दोस्त',
    'Best Friend': 'सबसे अच्छा दोस्त',
    'Caregiver': 'देखभालकर्ता',
    'Nurse': 'नर्स',
    'Doctor': 'डॉक्टर',
    'Neighbor': 'पड़ोसी',
    'Teacher': 'शिक्षक',
    'Colleague': 'सहकर्मी',
    'Other': 'अन्य'
  },
  'ta-IN': {
    'Father': 'தந்தை',
    'Mother': 'தாய்',
    'Son': 'மகன்',
    'Daughter': 'மகள்',
    'Grandfather': 'தாத்தா/பாட்டன்',
    'Grandmother': 'பாட்டி/பாட்டி',
    'Grandson': 'பேரன்',
    'Granddaughter': 'பேத்தி',
    'Spouse': 'துணைவர்',
    'Husband': 'கணவன்',
    'Wife': 'மனைவி',
    'Brother': 'சகோதரன்',
    'Sister': 'சகோதரி',
    'Uncle': 'மாமா/சித்தப்பா',
    'Aunt': 'மாமி/அத்தை',
    'Cousin': 'சகோதரன்/சகோதரி',
    'Nephew': 'மருமகன்',
    'Niece': 'மருமகள்',
    'Son-in-law': 'மருமகன்',
    'Daughter-in-law': 'மருமகள்',
    'Brother-in-law': 'மைத்துனன்',
    'Sister-in-law': 'மைத்துனி',
    'Father-in-law': 'மாமனார்',
    'Mother-in-law': 'மாமியார்',
    'Friend': 'நண்பர்',
    'Best Friend': 'சிறந்த நண்பர்',
    'Caregiver': 'பராமரிப்பாளர்',
    'Nurse': 'நர்ஸ்',
    'Doctor': 'மருத்துவர்',
    'Neighbor': 'அண்டை வீட்டார்',
    'Teacher': 'ஆசிரியர்',
    'Colleague': 'சக ஊழியர்',
    'Other': 'மற்றவை'
  },
  'te-IN': {
    'Father': 'తండ్రి',
    'Mother': 'తల్లి',
    'Son': 'కొడుకు',
    'Daughter': 'కూతురు',
    'Grandfather': 'తాత/నాయన',
    'Grandmother': 'అమ్మమ్మ/నానమ్మ',
    'Grandson': 'మనవడు',
    'Granddaughter': 'మనవరాలు',
    'Spouse': 'భాగస్వామి',
    'Husband': 'భర్త',
    'Wife': 'భార్య',
    'Brother': 'సోదరుడు',
    'Sister': 'సోదరి',
    'Uncle': 'మామ/చిన్నన్న',
    'Aunt': 'మామ/పిన్ని',
    'Cousin': 'సోదరుడు/సోదరి',
    'Nephew': 'మనవడు',
    'Niece': 'మనవరాలు',
    'Son-in-law': 'అల్లుడు',
    'Daughter-in-law': 'కోడలు',
    'Brother-in-law': 'బావ',
    'Sister-in-law': 'వదిన',
    'Father-in-law': 'మామ',
    'Mother-in-law': 'అత్త',
    'Friend': 'స్నేహితుడు',
    'Best Friend': 'ఉత్తమ స్నేహితుడు',
    'Caregiver': 'సంరక్షకుడు',
    'Nurse': 'నర్స్',
    'Doctor': 'వైద్యుడు',
    'Neighbor': 'పొరుగువారు',
    'Teacher': 'ఉపాధ్యాయుడు',
    'Colleague': 'సహోద్యోగి',
    'Other': 'ఇతరులు'
  },
  'mr-IN': {
    'Father': 'वडील',
    'Mother': 'आई',
    'Son': 'मुलगा',
    'Daughter': 'मुलगी',
    'Grandfather': 'आजोबा',
    'Grandmother': 'आजी',
    'Grandson': 'नातू',
    'Granddaughter': 'नात',
    'Spouse': 'जोडीदार',
    'Husband': 'नवरा',
    'Wife': 'बायको',
    'Brother': 'भाऊ',
    'Sister': 'बहीण',
    'Uncle': 'काका/मामा',
    'Aunt': 'काकी/मामी',
    'Cousin': 'चुलत भाऊ/बहीण',
    'Nephew': 'भाचा',
    'Niece': 'भाची',
    'Son-in-law': 'जावई',
    'Daughter-in-law': 'सून',
    'Brother-in-law': 'मेहुणा',
    'Sister-in-law': 'मेहुणी',
    'Father-in-law': 'सासरे',
    'Mother-in-law': 'सासू',
    'Friend': 'मित्र',
    'Best Friend': 'सर्वोत्तम मित्र',
    'Caregiver': 'काळजीवाहक',
    'Nurse': 'नर्स',
    'Doctor': 'डॉक्टर',
    'Neighbor': 'शेजारी',
    'Teacher': 'शिक्षक',
    'Colleague': 'सहकर्मी',
    'Other': 'इतर'
  },
  'bn-IN': {
    'Father': 'বাবা',
    'Mother': 'মা',
    'Son': 'ছেলে',
    'Daughter': 'মেয়ে',
    'Grandfather': 'দাদা/নানা',
    'Grandmother': 'দাদী/নানী',
    'Grandson': 'নাতি',
    'Granddaughter': 'নাতনি',
    'Spouse': 'স্বামী/স্ত্রী',
    'Husband': 'স্বামী',
    'Wife': 'স্ত্রী',
    'Brother': 'ভাই',
    'Sister': 'বোন',
    'Uncle': 'চাচা/মামা',
    'Aunt': 'চাচী/মামী',
    'Cousin': 'চাচাত/মামাত ভাই/বোন',
    'Nephew': 'ভাইপো',
    'Niece': 'ভাইঝি',
    'Son-in-law': 'জামাই',
    'Daughter-in-law': 'বউ',
    'Brother-in-law': 'শালা/শ্বশুর',
    'Sister-in-law': 'শালী/ননদ',
    'Father-in-law': 'শ্বশুর',
    'Mother-in-law': 'শাশুড়ী',
    'Friend': 'বন্ধু',
    'Best Friend': 'সবচেয়ে ভালো বন্ধু',
    'Caregiver': 'পরিচর্যাকারী',
    'Nurse': 'নার্স',
    'Doctor': 'ডাক্তার',
    'Neighbor': 'প্রতিবেশী',
    'Teacher': 'শিক্ষক',
    'Colleague': 'সহকর্মী',
    'Other': 'অন্যান্য'
  },
  'gu-IN': {
    'Father': 'પિતા',
    'Mother': 'માતા',
    'Son': 'દીકરો',
    'Daughter': 'દીકરી',
    'Grandfather': 'દાદા/નાના',
    'Grandmother': 'દાદી/નાની',
    'Grandson': 'પૌત્ર',
    'Granddaughter': 'પૌત્રી',
    'Spouse': 'જીવનસાથી',
    'Husband': 'પતિ',
    'Wife': 'પત્ની',
    'Brother': 'ભાઈ',
    'Sister': 'બહેન',
    'Uncle': 'કાકા/મામા',
    'Aunt': 'કાકી/મામી',
    'Cousin': 'કાકાનો/મામાનો ભાઈ/બહેન',
    'Nephew': 'ભત્રીજો',
    'Niece': 'ભત્રીજી',
    'Son-in-law': 'જમાઈ',
    'Daughter-in-law': 'વહુ',
    'Brother-in-law': 'સાળો',
    'Sister-in-law': 'સાળી',
    'Father-in-law': 'સસરા',
    'Mother-in-law': 'સાસુ',
    'Friend': 'મિત્ર',
    'Best Friend': 'સૌથી સારો મિત્ર',
    'Caregiver': 'સંભાળ રાખનાર',
    'Nurse': 'નર્સ',
    'Doctor': 'ડૉક્ટર',
    'Neighbor': 'પાડોશી',
    'Teacher': 'શિક્ષક',
    'Colleague': 'સહકર્મચારી',
    'Other': 'અન્ય'
  }
};

export function buildSpeechTextForLanguage(person: Person, language: Language): string {
  const template = templates[language] || templates['en-IN'];
  const relationshipMap = relationships[language] || relationships['en-IN'];

  let speech = template.intro.replace('{name}', person.name);

  if (person.nickname) {
    speech += '. ' + template.nickname.replace('{nickname}', person.nickname);
  }

  const translatedRelationship = relationshipMap[person.relationship] || person.relationship;
  speech += '. ' + template.relationship.replace('{relationship}', translatedRelationship);

  if (person.details) {
    speech += '. ' + person.details;
  }

  if (person.conversation_topics && person.conversation_topics.length > 0) {
    speech += '. ' + template.askAbout.replace('{topics}', person.conversation_topics.join(', '));
  }

  if (person.important_memories) {
    speech += '. ' + template.remember.replace('{memories}', person.important_memories);
  }

  return speech;
}

