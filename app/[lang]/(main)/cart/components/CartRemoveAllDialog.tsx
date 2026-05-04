import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import { useDictionary } from "@/components/providers/DictionaryProvider";

interface CartRemoveAllDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isRemoving: boolean;
}

export function CartRemoveAllDialog({
    open,
    onOpenChange,
    onConfirm,
    isRemoving,
}: CartRemoveAllDialogProps) {
    const { cart } = useDictionary();
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg space-y-2">
                <DialogTitle className="sr-only">{cart?.cart?.dialog?.title}</DialogTitle>
                <DialogDescription className="text-primary font-medium text-lg md:text-xl text-center mx-auto mt-2 ">
                    {cart?.cart?.dialog?.description}
                </DialogDescription>
                <DialogFooter className="mx-auto text-center space-x-4 ">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="text-md rounded-3xl w-full sm:w-[45%]"
                        disabled={isRemoving}
                        aria-label="close dialog cart"

                    >
                        {cart?.cart?.dialog?.cancel}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        className="text-md rounded-3xl w-full sm:w-[45%]"
                        disabled={isRemoving}
                        aria-label="Remove product from dialog cart"
                    >

                        {cart?.cart?.dialog?.delete}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
