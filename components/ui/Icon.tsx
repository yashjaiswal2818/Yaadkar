'use client';

import {
  User,
  Users,
  Camera,
  Home,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Phone,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertCircle,
  AlertTriangle,
  Info,
  Heart,
  Brain,
  Calendar,
  Clock,
  Star,
  Award,
  Gamepad2,
  RefreshCw,
  Loader2,
  Search,
  Menu,
  Globe,
  Shield,
  ShieldAlert,
  MessageCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  HelpCircle,
  Bell,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Image,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Palette,
  ExternalLink,
  Target,
  TrendingUp,
  Building2,
  Pill,
  Lightbulb,
  Pencil,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';

export type IconName =
  | 'user' | 'users' | 'camera' | 'home' | 'settings' | 'logout'
  | 'plus' | 'edit' | 'trash' | 'phone' | 'volume' | 'volumeOff'
  | 'chevronLeft' | 'chevronRight' | 'x' | 'check' | 'alert' | 'alertTriangle' | 'info'
  | 'heart' | 'brain' | 'calendar' | 'clock' | 'star' | 'award'
  | 'gamepad' | 'refresh' | 'loader' | 'search' | 'menu' | 'globe'
  | 'shield' | 'shieldAlert' | 'message' | 'sparkles' | 'arrowRight' | 'arrowLeft'
  | 'eye' | 'eyeOff' | 'help' | 'bell' | 'mic' | 'micOff'
  | 'video' | 'videoOff' | 'image' | 'sun' | 'moon' | 'sunrise' | 'sunset' | 'palette'
  | 'externalLink' | 'target' | 'trendingUp' | 'building' | 'pill' | 'lightbulb' | 'pencil' | 'smartphone';

const iconMap: Record<IconName, LucideIcon> = {
  user: User,
  users: Users,
  camera: Camera,
  home: Home,
  settings: Settings,
  logout: LogOut,
  plus: Plus,
  edit: Edit,
  pencil: Pencil,
  trash: Trash2,
  phone: Phone,
  volume: Volume2,
  volumeOff: VolumeX,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  x: X,
  check: Check,
  alert: AlertCircle,
  alertTriangle: AlertTriangle,
  info: Info,
  heart: Heart,
  brain: Brain,
  calendar: Calendar,
  clock: Clock,
  star: Star,
  award: Award,
  gamepad: Gamepad2,
  refresh: RefreshCw,
  loader: Loader2,
  search: Search,
  menu: Menu,
  globe: Globe,
  shield: Shield,
  shieldAlert: ShieldAlert,
  message: MessageCircle,
  sparkles: Sparkles,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  eye: Eye,
  eyeOff: EyeOff,
  help: HelpCircle,
  bell: Bell,
  mic: Mic,
  micOff: MicOff,
  video: Video,
  videoOff: VideoOff,
  image: Image,
  sun: Sun,
  moon: Moon,
  sunrise: Sunrise,
  sunset: Sunset,
  palette: Palette,
  externalLink: ExternalLink,
  target: Target,
  trendingUp: TrendingUp,
  building: Building2,
  pill: Pill,
  lightbulb: Lightbulb,
  smartphone: Smartphone,
};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export default function Icon({ name, size = 20, className = '', strokeWidth = 2 }: IconProps) {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} strokeWidth={strokeWidth} />;
}



