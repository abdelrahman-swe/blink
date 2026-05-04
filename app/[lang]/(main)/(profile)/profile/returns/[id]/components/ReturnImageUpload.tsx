"use client";

import React from "react";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Add01Icon,
    CancelCircleIcon,
    CloudUploadIcon,
    PlayIcon
} from "@hugeicons/core-free-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/components/providers/DictionaryProvider";

interface ReturnImageUploadProps {
    form: UseFormReturn<any>;
}

export const ReturnImageUpload: React.FC<ReturnImageUploadProps> = ({ form }) => {
    const { returns } = useDictionary();
    const selectedImages = form.watch("images") as { file: File; preview: string }[];

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        for (const file of files) {
            const currentImages = form.getValues("images") || [];
            if (currentImages.length >= 8) break;

            const preview = URL.createObjectURL(file);
            const newItem = { file, preview };

            form.setValue("images", [...currentImages, newItem]);
            const isValid = await form.trigger("images");

            if (!isValid) {
                form.setValue("images", currentImages);
                URL.revokeObjectURL(preview);
            }
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...selectedImages];
        if (newImages[index]?.preview) {
            URL.revokeObjectURL(newImages[index].preview);
        }
        newImages.splice(index, 1);
        form.setValue("images", newImages, { shouldValidate: true });
    };

    return (
        <div>
            <h1 className="text-lg font-medium my-7">{returns?.upload?.title}</h1>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-8">
                <div className="flex flex-col items-center justify-center">
                    {selectedImages.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                            {selectedImages.map((img, index) => (
                                <div key={index} className="relative group">
                                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                                        {img.file.type.startsWith("image/") ? (
                                            <Image
                                                src={img.preview}
                                                alt={`preview ${index}`}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-1">
                                                <HugeiconsIcon
                                                    icon={PlayIcon}
                                                    size={32}
                                                    color="#4D4D4D"
                                                    strokeWidth={1.5}
                                                />
                                                <span className="bg-black/60 text-[#ffffff] text-[10px] px-2 py-0.5 rounded font-bold uppercase">{returns?.upload?.video}</span>
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-0 right-2 z-10"
                                    >
                                        <HugeiconsIcon
                                            icon={CancelCircleIcon}
                                            size={25}
                                            color="black"
                                            fill="#eeeeee"
                                            strokeWidth={1}
                                        />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    <HugeiconsIcon
                        icon={CloudUploadIcon}
                        size={30}
                        color="currentColor"
                        strokeWidth={1.5}
                    />
                    <p className="text-gray-500 mt-2 max-w-md text-center text-sm mb-4">
                        {returns?.upload?.browseText}
                        <br />
                        {returns?.upload?.maxSizeText}
                    </p>

                    <Label
                        htmlFor="img"
                        className={`flex items-center justify-center w-10 h-9 rounded-md bg-primary text-white transition-colors 
                         ${selectedImages.length >= 8 ?
                                "opacity-50 cursor-not-allowed" :
                                "cursor-pointer hover:bg-primary/90"}`}
                    >
                        <HugeiconsIcon
                            icon={Add01Icon}
                            size={22}
                            color="currentColor"
                            strokeWidth={1.5}
                        />
                        <Input
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            className="hidden"
                            id="img"
                            disabled={selectedImages.length >= 8}
                            onChange={handleImageChange}
                        />
                    </Label>
                    {form.formState.errors.images && (
                        <p className="text-destructive text-[0.8rem] font-medium mt-3">
                            {returns?.validation?.[form.formState.errors.images.message as keyof typeof returns.validation] || form.formState.errors.images.message as string}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
