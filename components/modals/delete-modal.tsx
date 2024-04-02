"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal";

import React, { useState } from "react";
import { Button } from "../ui/button";

import { Loader } from "lucide-react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {};

const DeleteModal = (props: Props) => {
  const { open, type, setClose, data } = useModal();
  const isOpen = open && type === "delete-modal";
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const handleDelete = async () => {
    try {
      setIsLoading(true);

      if (data.deleteFn) {
        const res = await data.deleteFn();
        if (res.success) {
          toast.success("Items has been deleted");
          router.refresh();
          setClose();
        }
        if (!res.success) {
          toast.error("Someting went wrong");
        }

        return;
      }

      await axios.delete(data.url!);
      data.redirect && router.push(data.redirect!);
      router.refresh();
      setClose();
      toast.success("Items has been deleted");
    } catch (error) {
      toast.error("Someting went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete from our
            servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-3 justify-end">
          <Button
            disabled={isLoading}
            onClick={handleDelete}
            variant={"destructive"}
          >
            Delete{" "}
            {isLoading && <Loader className="animate-spin w-3 h-3 ml-3" />}
          </Button>
          <Button disabled={isLoading} onClick={setClose} variant={"ghost"}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
