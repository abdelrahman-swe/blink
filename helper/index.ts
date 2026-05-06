import {
  Facebook01Icon,
  InstagramIcon,
  NewTwitterIcon,
  PinterestIcon,
  TiktokIcon,
  YoutubeIcon,
} from "@hugeicons/core-free-icons";
import { Briefcase01Icon, Building03Icon, Home12Icon, Location03Icon } from "@hugeicons/core-free-icons";


export const socialIcons = [
  { icon: Facebook01Icon, alt: "Facebook" },
  { icon: NewTwitterIcon, alt: "Twitter" },
  { icon: InstagramIcon, alt: "Instagram" },
  { icon: YoutubeIcon, alt: "Youtube" },
  { icon: TiktokIcon, alt: "Tiktok" },
  { icon: PinterestIcon, alt: "Pinterest" },
];

export const footerSocialIcons = [
  { icon: "/social/facebook.svg", alt: "Facebook" },
  { icon: "/social/x.svg", alt: "Twitter" },
  { icon: "/social/instagram.svg", alt: "Instagram" },
  { icon: "/social/youtube.svg", alt: "Youtube" },
  { icon: "/social/tiktok.svg", alt: "Tiktok" },
  { icon: "/social/pinterest.svg", alt: "Pinterest" },
];

export const footerImages = [
  { src: "/google-app.svg", alt: "Google Play" },
  { src: "/app-store.svg", alt: "App Store" },
  { src: "/app-gallery.svg", alt: "App Gallery" },
];

export const profileIcons =[
  { src: "./home.svg", alt:"Home" }
]


export const ADDRESS_ICONS: Record<string, any> = {
  Home: Home12Icon,
  Work: Briefcase01Icon,
  Office: Building03Icon,
  Other: Location03Icon,
};


export const ORDER_STATUS_CONFIG: Record<
  string,
  { label: string; border: string; badge: string }
> = {
  pending: {
    label: "Pending",
    border: "border-t-[#E5E7EB] md:border-l-[#E5E7EB] rtl:border-l-0 rtl:md:border-r-[#E5E7EB]",
    badge: "bg-[#F9FAFB] text-[#4B5563]",
  },
  pending_payment: {
    label: "Pending payment",
    border: "border-t-[#FFB833] md:border-l-[#FFB833] rtl:border-l-0 rtl:md:border-r-[#FFB833] ",
    badge: "bg-[#FFF6E5] text-[#FFB833]",
  },
  completed: {
    label: "Completed",
    border: "border-t-[#3A923B] md:border-l-[#3A923B] rtl:border-l-0 rtl:md:border-r-[#3A923B]",
    badge: "bg-[#EDF8ED] text-[#3A923B]",
  },
  processing: {
    label: "Processing",
    border: "border-t-[#317F9B] md:border-l-[#317F9B] rtl:border-l-0 rtl:md:border-r-[#317F9B] ",
    badge: "bg-[#ECF5F9] text-[#317F9B]",
  },
  out_for_delivery: {
    label: "Out for delivery",
    border: "border-t-[#317F9B] md:border-l-[#317F9B] rtl:border-l-0 rtl:md:border-r-[#317F9B]",
    badge: "bg-[#ECF5F9] text-[#317F9B]",
  },
    cancelled: {
    label: "Cancelled",
    border: "border-t-red-500 md:border-l-red-500 rtl:border-l-0 rtl:md:border-r-red-500",
    badge: "bg-[#FFE5E5] text-[#E80000]",
  },
};

export const RETURN_STATUS_CONFIG: Record<
  string,
  { label: string; border: string; badge: string }
> = {
  pending: {
    label: "Pending",
    border: "border-t-[#FFB833] md:border-l-[#FFB833] rtl:border-l-0 rtl:md:border-r-[#FFB833]",
    badge: "bg-[#FFF6E5] text-[#FFB833]",
  },
  approved: {
    label: "Approved",
    border: "border-t-[#3A923B] md:border-l-[#3A923B] rtl:border-l-0 rtl:md:border-r-[#3A923B]",
    badge: "bg-[#EDF8ED] text-[#3A923B]",
  },
  completed: {
    label: "Refund Completed",
    border: "border-t-[#317F9B] md:border-l-[#317F9B] rtl:border-l-0 rtl:md:border-r-[#317F9B]",
    badge: "bg-[#ECF5F9] text-[#317F9B]",
  },
  items_received: {
    label: "Items Received",
    border: "border-t-[#317F9B] md:border-l-[#317F9B] rtl:border-l-0 rtl:md:border-r-[#317F9B]",
    badge: "bg-[#ECF5F9] text-[#317F9B]",
  },
  cancelled: {
    label: "Cancelled",
    border: "border-t-red-500 md:border-l-red-500 rtl:border-l-0 rtl:md:border-r-red-500",
    badge: "bg-[#FFE5E5] text-[#E80000]",
  },
  rejected: {
    label: "Rejected",
    border: "border-t-red-500 md:border-l-red-500 rtl:border-l-0 rtl:md:border-r-red-500",
    badge: "bg-[#FFE5E5] text-[#E80000]",
  },
};
