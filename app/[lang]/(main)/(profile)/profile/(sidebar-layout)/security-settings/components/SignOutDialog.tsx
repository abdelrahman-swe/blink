import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/queries/useUserQueries";

const SignOutDialog = ({
    signOutDialog,
    setSignOutDialog,
    userDict
}: {
    signOutDialog: boolean;
    setSignOutDialog: (value: boolean) => void;
    userDict: any;
}) => {
    const t = userDict?.profile?.securitySettings;
    const { mutate: logout, isPending: logoutPending } = useLogout();

    return (
        <Dialog open={signOutDialog} onOpenChange={setSignOutDialog}>
            <DialogContent className="sm:max-w-lg space-y-3 p-8">
                <DialogTitle className="font-medium text-xl text-center mt-5">
                    {t?.confirmSignOut}
                </DialogTitle>
                <DialogFooter className="mx-auto text-center space-x-2">
                    <Button
                        variant="outline"
                        className="text-md rounded-3xl w-full sm:w-[45%]"
                        onClick={() => setSignOutDialog(false)}
                    >
                        {t?.cancel}
                    </Button>
                    <Button
                        variant="destructive"
                        className="text-md rounded-3xl w-full sm:w-[45%]"
                        onClick={() => logout()}
                        disabled={logoutPending}
                    >
                        {logoutPending ? t?.signingOut : t?.signOut}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SignOutDialog