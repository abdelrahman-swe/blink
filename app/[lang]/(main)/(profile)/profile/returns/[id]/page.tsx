"use client";import { useAppRouter } from '@/hooks/useAppRouter';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getReturnSchema } from "@/utils/schema/productSchema";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useParams} from "next/navigation";
import { Label } from "@/components/ui/label"
import { Field } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { useUserReturnOrder, useCreateReturn } from "@/hooks/queries/useUserQueries";
import { ReturnImageUpload } from "./components/ReturnImageUpload";
import { ReturnProductItem } from "./components/ReturnProductItem";
import { ReturnReasons } from "./components/ReturnReasons";
import { ReturnSuccessDialog } from "./components/ReturnSuccessDialog";
import { ReturnOrderSkeleton } from "@/components/skeleton/ReturnOrderSkeleton";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import { useLoadingStore } from "@/store/useLoadingStore";

const ReturnOrderForm = () => {
  const { lang, id } = useParams();
  const router = useAppRouter();
  const { startLoading, stopLoading } = useLoadingStore();
  const { returns } = useDictionary();
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const { data: returnsOrder, isLoading, error } = useUserReturnOrder(id as string);
  const { mutate: createReturnMutate, isPending, error: submitError } = useCreateReturn();

  const products = returnsOrder?.items || [];

  const schema = useMemo(() => getReturnSchema(), []);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      items: [],
      reason: "",
      description: "",
      images: [],
    },
  });

  const selectedItems = form.watch("items");

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      form.setValue("items", products.map(p => ({ order_item_id: p.id, quantity: 1 })), { shouldValidate: true });
    } else {
      form.setValue("items", [], { shouldValidate: true });
    }
  };

  const handleSelectProduct = (productItemId: number, checked: boolean) => {
    if (checked) {
      form.setValue("items", [...selectedItems, { order_item_id: productItemId, quantity: 1 }], { shouldValidate: true });
    } else {
      form.setValue("items", selectedItems.filter(item => item.order_item_id !== productItemId), { shouldValidate: true });
    }
  };

  const updateQuantity = (productItemId: number, val: number) => {
    const newItems = selectedItems.map(item =>
      item.order_item_id === productItemId ? { ...item, quantity: val } : item
    );
    form.setValue("items", newItems, { shouldValidate: true });
  };

  const isAllSelected = selectedItems.length === products.length && products.length > 0;

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (!returnsOrder) return;

    const payload = {
      order_id: returnsOrder.id,
      reason: data.reason,
      description: data.description || "",
      items: data.items,
      media: data.images.map((img: any) => img.file)
    };

    startLoading();
    createReturnMutate(payload, {
      onSuccess: () => {
        stopLoading();
        setOpenSuccessDialog(true);
        form.reset();
      },
      onError: (err) => {
        stopLoading();
      }
    });
  };

  if (isLoading || (!returnsOrder && !error)) {
    return <ReturnOrderSkeleton />;
  }

  if (error || !returnsOrder) return <div className="h-100 flex items-center justify-center font-medium">{returns?.errors?.somethingWentWrong}</div>;

  return (
    <main className="bg-white min-h-screen">
      <div className="xl:container mx-auto px-5 py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/${lang}/home`}>{returns?.breadcrumb?.home}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/${lang}/profile`}>{returns?.breadcrumb?.profile}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/${lang}/profile/orders`}>{returns?.breadcrumb?.orders}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{returns?.breadcrumb?.returnOrder}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="bg-background rounded-md border border-gray-200 shadow-xs mt-5 p-5">
              <h1 className="flex justify-start flex-wrap items-center gap-2 text-lg font-medium">{returns?.form?.selectTitle}
                <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-primary">
                  {products.length === 1 ? returns?.form?.productCount?.replace("{count}", "1") : returns?.form?.productsCount?.replace("{count}", products.length.toString())}
                </span>
              </h1>

              <div className="flex items-center bg-gray-50 gap-2 mt-4 py-3 px-5 -mx-5">
                <Field orientation="horizontal">
                  <Checkbox
                    id="select-all"
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    className="bg-neutral-200!"
                  />
                  <Label className="font-normal text-sm cursor-pointer" htmlFor="select-all">{returns?.form?.selectAll}</Label>
                </Field>
              </div>

              <div className="max-h-[400px] overflow-y-auto my-2 custom-scrollbar -me-3!">
                {products.map((product, index) => (
                  <ReturnProductItem
                    key={product.id}
                    product={product}
                    isSelected={selectedItems.some(item => item.order_item_id === product.id)}
                    itemQuantity={selectedItems.find(item => item.order_item_id === product.id)?.quantity || 1}
                    currency={returnsOrder.currency}
                    onSelect={(checked) => handleSelectProduct(product.id, checked)}
                    onQuantityChange={(val) => updateQuantity(product.id, val)}
                    isLast={index === products.length - 1}
                  />
                ))}
              </div>
              {form.formState.errors.items && (
                <p className="text-destructive text-[0.8rem] font-medium mt-2">
                  {returns?.validation?.[form.formState.errors.items.message as keyof typeof returns.validation] || form.formState.errors.items.message}
                </p>
              )}
            </div>

            <ReturnReasons form={form} />

            <ReturnImageUpload form={form} />

            {submitError && (
              <div className="mt-5 text-destructive text-md text-center flex flex-col gap-1">
                {(submitError as any).response?.data?.message && (submitError as any).response?.data?.message !== 'Validation failed' && (
                  <p>{(submitError as any).response?.data?.message}</p>
                )}
                {(submitError as any).response?.data?.message === 'Validation failed' && !(submitError as any).response?.data?.data?.media && (
                  <p>{(submitError as any).response?.data?.message}</p>
                )}
                {(submitError as any).response?.data?.data?.media && (
                  <p>{(submitError as any).response?.data?.data?.media}</p>
                )}
              </div>
            )}

            <div className=" flex justify-end items-end">
              <Button disabled={isPending} type="submit" size="lg" className="w-full md:w-50 text-md px-12 rounded-4xl mt-5">

                {isPending ? (
                  <>
                    <span className="flex items-center gap-1">{returns?.form?.submitting}<Loader2 className="ms-2 h-4 w-4 animate-spin" /></span>
                  </>
                ) : (
                  returns?.form?.submit
                )}

              </Button>
            </div>

            <ReturnSuccessDialog
              open={openSuccessDialog}
              onOpenChange={(open) => {
                setOpenSuccessDialog(open);
                if (!open) {
                  router.push(`/${lang}/profile/returns`);
                }
              }}
            />
          </form>
        </Form>
      </div>
    </main>
  )

}

export default ReturnOrderForm
