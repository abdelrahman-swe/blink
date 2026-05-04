// Client Component Example - components/LanguageSwitcher.tsx

import { useLocale } from "@/hooks/useLocale";
import { Locale } from "@/lib/dictionaries";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import Image from "next/image";

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export default function LanguageSwitcher({
  currentLocale,
}: LanguageSwitcherProps) {
  const { switchLocale } = useLocale(currentLocale);

  return (
    <Select value={currentLocale.toLowerCase()} onValueChange={(val) => switchLocale(val as Locale)}>
      <SelectTrigger className="w-[80px] border-none bg-transparent shadow-none focus:ring-0! focus:ring-offset-0! cursor-pointer">
        <Image priority src="/global.svg" alt="language icon" width={20} height={20} />
        <span className="text-md font-medium capitalize ">
          {currentLocale === "ar" ? "Ar" : "En"}
        </span>
      </SelectTrigger>
      <SelectContent className="w-[130px]">
        <SelectGroup>
          <SelectItem className="text-md" value="ar">العربية</SelectItem>
          <SelectItem className="text-md" value="en">English</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
