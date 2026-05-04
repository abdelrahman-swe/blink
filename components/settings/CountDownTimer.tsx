import { DealInfo } from "@/utils/types/home";
import Countdown from "react-countdown";
import { useDictionary } from "../providers/DictionaryProvider";

export function CountDownTimer({ timer }: { timer: DealInfo }) {
    const { product: productDict } = useDictionary();
    const t = productDict?.dealsTimer;

    if (!timer) return null;

    // Calculate the target timestamp by adding the remaining time components to the current time.
    const targetDate = Date.now() +
        (timer.days || 0) * 24 * 60 * 60 * 1000 +
        (timer.hours || 0) * 60 * 60 * 1000 +
        (timer.minutes || 0) * 60 * 1000 +
        (timer.seconds || 0) * 1000;

    return (
        <Countdown
            date={targetDate}
            renderer={({ days, hours, minutes, seconds, completed }) => {
                if (completed) {
                    return <div className="text-center font-semibold text-primary">{t?.ended || "Ended"}</div>;
                }

                const items = [
                    { label: t?.days || "Days", value: days },
                    { label: t?.hours || "Hours", value: hours },
                    { label: t?.minutes || "Mins", value: minutes },
                    { label: t?.seconds || "Sec", value: seconds },
                ];

                return (
                    <div className="flex items-center justify-center gap-3">
                        {items.map((item, i) => (
                            <div className="flex items-center gap-5 md:gap-3" key={i}>
                                {i !== 0 && <span className="text-sm">:</span>}
                                <div className="text-center">
                                    <div className="text-sm font-semibold">
                                        {String(item.value).padStart(2, "0")}
                                    </div>
                                    <div className="text-[#4D4D4D] mt-2 text-sm ">
                                        {item.label}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            }}
        />
    );
}