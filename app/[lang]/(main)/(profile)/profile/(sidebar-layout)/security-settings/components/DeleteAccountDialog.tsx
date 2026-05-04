import z from "zod";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { deleteAccountSchema } from "@/utils/schema/userSchema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,

} from "@/components/ui/form";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewOffSlashIcon, ViewIcon } from "@hugeicons/core-free-icons";
import { useDeleteAccount } from "@/hooks/queries/useUserQueries";
import { useUserStore } from "@/store/useUserStore";
import { Locale } from "@/lib/dictionaries";

const DeleteAccountDialog = ({
    deleteAccountDialog,
    setDeleteAccountDialog,
    authDict,
    userDict,
    lang,
}: {
    deleteAccountDialog: boolean;
    setDeleteAccountDialog: (value: boolean) => void;
    authDict: any;
    userDict: any;
    lang: Locale;
}) => {
    const t = userDict?.profile?.securitySettings;
    type DeleteAccountSchema = z.infer<ReturnType<typeof deleteAccountSchema>>;
    const [isPending, setIsPending] = useState(false);
    const [showDeletePassword, setShowDeletePassword] = useState(false);
    const deleteAccSchema = useMemo(() => deleteAccountSchema(), []);
    const deleteAccountMutation = useDeleteAccount();
    const { logout } = useUserStore();

    const form = useForm<DeleteAccountSchema>({
        resolver: zodResolver(deleteAccSchema),
        defaultValues: {
            password: "",
        },
    });

    const onDeleteSubmit = (data: DeleteAccountSchema) => {
        setIsPending(true);
        deleteAccountMutation.mutate(data, {
            onSuccess: (response: any) => {
                toast.success(response?.message || t?.accountDeletedSuccess);
                setTimeout(() => {
                    setIsPending(false);
                    setDeleteAccountDialog(false);
                    logout();
                }, 1000);
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.message;

                toast.error(errorMessage || t?.failedChangePassword);

                // Map backend errors to form fields
                if (errorMessage) {
                    const lowerMsg = errorMessage.toLowerCase();
                    if (lowerMsg.includes("password") || lowerMsg.includes("is incorrect")) {
                        form.setError("password", { type: "server", message: errorMessage });
                    } else {
                        form.setError("root", { type: "server", message: errorMessage });
                    }
                }
                setIsPending(false);
            }
        });
    };

    return (
        <Form {...form}>
            <Dialog open={deleteAccountDialog} onOpenChange={setDeleteAccountDialog}>
                <DialogContent className="sm:max-w-lg gap-3">
                    <DialogTitle className="font-medium text-xl text-center mt-10">
                        {t?.confirmDeleteAccount}
                    </DialogTitle>
                    <DialogDescription className="text-primary text-md text-center max-w-sm mx-auto">
                        {t?.deleteAccountDesc}
                    </DialogDescription>

                    <form
                        onSubmit={form.handleSubmit(onDeleteSubmit)}
                        className="space-y-4"
                    >

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="mt-4 md:px-5">
                                    <FormControl>
                                        <FloatingInput
                                            type={showDeletePassword ? "text" : "password"}
                                            label={t?.password}
                                            placeholder={t?.enterPassword}
                                            {...field}
                                            aria-invalid={!!form.formState.errors.password}
                                            endContent={
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    type="button"
                                                    onClick={() => setShowDeletePassword((prev) => !prev)}
                                                    className="text-muted-foreground focus:outline-none"
                                                >
                                                    {showDeletePassword ? (
                                                        <HugeiconsIcon
                                                            icon={ViewIcon}
                                                            size={20}
                                                            color="currentColor"
                                                            strokeWidth={1.5}
                                                        />
                                                    ) : (
                                                        <HugeiconsIcon
                                                            icon={ViewOffSlashIcon}
                                                            size={20}
                                                            color="currentColor"
                                                            strokeWidth={1.5}
                                                        />
                                                    )}
                                                </Button>
                                            }
                                        />
                                    </FormControl>
                                    <p className="text-sm text-destructive">
                                        {userDict?.profile?.account?.validation[form.formState.errors.password?.message as any] || form.formState.errors.password?.message}
                                    </p>
                                </FormItem>
                            )}
                        />
                        {form.formState.errors.root?.message && (
                            <p className="text-sm text-destructive text-center font-medium px-5">
                                {form.formState.errors.root.message}
                            </p>
                        )}


                        <DialogFooter className="mx-auto text-center space-x-2 mt-6">
                            <Button
                                variant="outline"
                                className="text-md rounded-3xl w-full sm:w-[45%]"
                                onClick={() => setDeleteAccountDialog(false)}
                                type="button"
                            >
                                {t?.cancel}
                            </Button>
                            <Button
                                variant="destructive"
                                className="text-md rounded-3xl w-full sm:w-[45%]"
                                type="submit"
                                disabled={isPending}
                            >
                                {isPending ? t?.deleting : t?.deleteAccount}
                            </Button>
                        </DialogFooter>

                    </form>
                </DialogContent>
            </Dialog>
        </Form>
    );
};

export default DeleteAccountDialog;
