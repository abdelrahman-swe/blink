import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { changePasswordSchema } from "@/utils/schema/userSchema";
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
import AppLink from '@/components/common/AppLink';
import z from "zod";
import { ChangePasswordPayload } from "@/utils/types/user";
import { Separator } from "@/components/ui/separator";
import { useChangePassword } from "@/hooks/queries/useUserQueries";
import { Locale } from "@/utils/types/locale";

const ChangePasswordDialog = ({
  changePasswordDialog,
  setChangePasswordDialog,
  authDict,
  userDict,
  lang,
}: {
  changePasswordDialog: boolean;
  setChangePasswordDialog: (value: boolean) => void;
  authDict: any;
  userDict: any;
  lang: Locale;
}) => {
  const t = userDict?.profile?.securitySettings;
  const changePasswordMutation = useChangePassword();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginPending, setLoginPending] = useState(false);
  const changePassSchema = useMemo(() => changePasswordSchema(), []);
  type ChangePasswordSchema = z.infer<ReturnType<typeof changePasswordSchema>>;

  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePassSchema),
    mode: "onChange",
    defaultValues: {
      current_Password: "",
      new_Password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = (data: ChangePasswordSchema) => {
    setLoginPending(true);
    const payload: ChangePasswordPayload = {
      current_password: data.current_Password,
      new_password: data.new_Password,
      new_password_confirmation: data.password_confirmation,
    };

    changePasswordMutation.mutate(payload, {
      onSuccess: (response) => {
        toast.success(response.message || t?.passwordChangedSuccess);
        setChangePasswordDialog(false);
        setLoginPending(false);
        form.reset();
      },
      onError: (error: any) => {
        const responseData = error?.response?.data;
        const errorMessage: string = responseData?.message ?? "";
        const validationErrors = responseData?.errors ?? {};

        // Backend already returns the message in the correct locale — show it directly
        if (validationErrors.current_password) {
          form.setError("current_Password", { type: "server", message: validationErrors.current_password[0] });
        } else if (errorMessage) {
          form.setError("current_Password", { type: "server", message: errorMessage });
        }

        if (validationErrors.new_password) {
          form.setError("new_Password", { type: "server", message: validationErrors.new_password[0] });
        }
        if (validationErrors.new_password_confirmation) {
          form.setError("password_confirmation", { type: "server", message: validationErrors.new_password_confirmation[0] });
        }

        setLoginPending(false);
      }
    });
  };

  return (
    <Dialog open={changePasswordDialog} onOpenChange={setChangePasswordDialog}>
      <DialogContent className="sm:max-w-md ">
        <DialogTitle className="font-medium text-xl">
          {t?.changePassword}
        </DialogTitle>
        <Separator />

        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">

            <FormField
              control={form.control}
              name="current_Password"
              render={({ field }) => (
                <FormItem className="mb-8">
                  <FormControl>
                    <FloatingInput
                      {...field}
                      label={t?.currentPassword}
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder={t?.enterCurrentPassword}
                      aria-invalid={!!form.formState.errors.current_Password}
                      endContent={
                        <Button
                          size="icon"
                          variant="ghost"
                          type="button"
                          onClick={() => setShowCurrentPassword((prev) => !prev)}
                          className="text-muted-foreground focus:outline-none"
                        >
                          {showCurrentPassword ? (
                            <HugeiconsIcon
                              icon={ViewIcon}
                              size={20}
                              color="#000000"
                              strokeWidth={1.5}
                            />
                          ) : (
                            <HugeiconsIcon
                              icon={ViewOffSlashIcon}
                              size={20}
                              color="#000000"
                              strokeWidth={1.5}
                            />
                          )}
                        </Button>
                      }
                    />
                  </FormControl>
                  {/* <p className="text-sm text-destructive">
                    {form.formState.errors.current_Password?.message}
                  </p> */}
                   <p className="text-sm text-destructive">
                    {userDict?.profile?.account?.validation[form.formState.errors.current_Password?.message as any] || form.formState.errors.current_Password?.message}
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="new_Password"
              render={({ field }) => (
                <FormItem className="mb-8">
                  <FormControl>
                    <FloatingInput
                      {...field}
                      label={t?.newPassword}
                      type={showNewPassword ? "text" : "password"}
                      placeholder={t?.enterNewPassword}
                      aria-invalid={!!form.formState.errors.new_Password}
                      endContent={
                        <Button
                          size="icon"
                          variant="ghost"
                          type="button"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          className="text-muted-foreground focus:outline-none"
                        >
                          {showNewPassword ? (
                            <HugeiconsIcon
                              icon={ViewIcon}
                              size={20}
                              color="#000000"
                              strokeWidth={1.5}
                            />
                          ) : (
                            <HugeiconsIcon
                              icon={ViewOffSlashIcon}
                              size={20}
                              color="#000000"
                              strokeWidth={1.5}
                            />
                          )}
                        </Button>
                      }
                    />
                  </FormControl>
                  <p className="text-sm text-destructive">
                    {userDict?.profile?.account?.validation[form.formState.errors.new_Password?.message as any] || form.formState.errors.new_Password?.message}
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormControl>
                    <FloatingInput
                      {...field}
                      label={t?.repeatNewPassword}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t?.repeatNewPasswordPlaceholder}
                      aria-invalid={
                        !!form.formState.errors.password_confirmation
                      }
                      endContent={
                        <Button
                          size="icon"
                          variant="ghost"
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          className="text-muted-foreground focus:outline-none"
                        >
                          {showConfirmPassword ? (
                            <HugeiconsIcon
                              icon={ViewIcon}
                              size={20}
                              color="#000000"
                              strokeWidth={1.5}
                            />
                          ) : (
                            <HugeiconsIcon
                              icon={ViewOffSlashIcon}
                              size={20}
                              color="#000000"
                              strokeWidth={1.5}
                            />
                          )}
                        </Button>
                      }
                    />
                  </FormControl>
                  <p className="text-sm text-destructive">
                    {userDict?.profile?.account?.validation[form.formState.errors.password_confirmation?.message as any] || form.formState.errors.password_confirmation?.message}
                  </p>
                </FormItem>
              )}
            />

            <AppLink
              href={`/${lang}/forget-password`}
              className="text-primary font-medium text-md flex justify-end items-end"
            >
              {t?.forgotPassword}
            </AppLink>

            <DialogFooter className="mt-5 w-full">
              <Button
                type="submit"
                className="w-full rounded-3xl"
                disabled={loginPending}
              >
                {loginPending ? t?.updating : t?.updatePassword}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
