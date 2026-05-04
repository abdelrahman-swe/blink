import { Skeleton } from '@/components/ui/skeleton'

const ProfileOrderSkeleton = ({ isLoading }: { isLoading: boolean }) => {

    return (
        <div>
            {isLoading &&
                Array.from({ length: 1 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-background border-l-4 rtl:border-l-0 rtl:border-r-4 border-gray-200 rounded-2xl p-6 shadow-2xs space-y-5 mb-8"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-6 rounded-full" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                            {/* <Skeleton className="h-6 w-24 rounded-full" /> */}
                        </div>

                        {/* Address */}
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-9 w-[60%] rounded-lg" />
                            {/* <Skeleton className="h-4 w-40" /> */}
                        </div>

                        {/* Items */}
                        <div className="space-y-3">
                            {[1, 2].map((item) => (
                                <div
                                    key={item}
                                    className="flex gap-3 border border-gray-200 rounded-xl p-2"
                                >
                                    <Skeleton className="w-[110px] h-[100px] rounded-lg" />

                                    <div className="flex-1 space-y-3 py-2">
                                        <Skeleton className="h-4 w-[70%]" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-center pt-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-9 w-28 rounded-xl" />
                        </div>
                    </div>
                ))}</div>
    )
}

export default ProfileOrderSkeleton