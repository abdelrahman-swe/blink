import AppLink from '@/components/common/AppLink';
import { Button } from "../ui/button";
import { useDictionary } from "../providers/DictionaryProvider";


export default function TopHeader({ title, link, showLink = true }: { title: string; link?: string; showLink?: boolean; }) {
    const { home } = useDictionary();
    const t = home?.topHeaders;

    return (
        <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-xl lg:text-3xl font-medium ">{title}</h2>

            {link && showLink && (
                <Button asChild className="underline text-md font-medium m-0 p-0 hover:bg-transparent" variant="ghost">
                    <AppLink href={link}>{t?.viewAll}</AppLink>
                </Button>
            )}

        </div>
    );
}
