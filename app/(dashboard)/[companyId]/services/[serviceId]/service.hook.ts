import { useEdgeStore } from "@/lib/edgestore";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import * as z from "zod";
import { serviceSchema } from "./service-schema";
import { Service } from "@prisma/client";
import axios from "axios";

type Props = {
  setImage: (url: string) => void;
  setImages: (url: string) => void;
  deleteImages: (url: string) => void;
  service:Service | null
};
export const useService = ({ setImage, setImages, deleteImages ,service}: Props) => {
  const params = useParams();

  const [file, setFile] = useState<File>();
  const [imagesFile, setImagesFile] = useState<File>();
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [deleteImagesLoader, setDeleteImagesLoader] = useState("");
  const [imageLoader, setImageLoader] = useState(false);
  const [imagesLoader, setImagesLoader] = useState(false);

  const { edgestore } = useEdgeStore();

  const uploadImage = async () => {
    if (file) {
      setImageLoader(true);
      if (file) {
        const res = await edgestore.publicFiles.upload({
          file,
          onProgressChange: (progress) => {
            if (progress === 0) {
              setImageLoader(true);
            } else {
              setImageLoader(false);
            }
            console.log(progress);
          },
        });
        setImageLoader(false);

        setImage(res.url);
      }
    }
  };
  const uploadImages = async () => {
    if (imagesFile) {
      if (imagesFile) {
        const res = await edgestore.publicFiles.upload({
          file: imagesFile,
          onProgressChange: (progress) => {
            if (progress === 0) {
              setImagesLoader(true);
            } else {
              setImagesLoader(false);
            }
            console.log(progress);
          },
        });

        setImages(res.url);
      }
    }
  };

  const deleteImage = async (image: string) => {
    try {
      setDeleteLoader(true);
      await edgestore.publicFiles.delete({
        url: image,
      });
      setImage("");
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoader(false);
    }
  };

  const deleteanImage = async (image: string) => {
    try {
      setDeleteImagesLoader(image);
      await edgestore.publicFiles.delete({
        url: image,
      });

      deleteImages(image);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteImagesLoader("");
    }
  };

  const { toast } = useToast();
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof serviceSchema>) {
    try {

      if(service){
        const service: Service = await axios.patch(
          `/api/${params.companyId}/service/${params.serviceId}`,
          values
        );
      }else{
        const service: Service = await axios.post(
          `/api/${params.companyId}/service`,
          values
        );
      }
   
      toast({
        title: "Success",
        description:service?'your service is edited': "Youre service is added",
      });
      router.push(`/${params.companyId}/services`);
      router.refresh()
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  }

  return {
    file,
    setFile,
    uploadImage,
    deleteImage,
    deleteLoader,
    onSubmit,
    deleteImagesLoader,
    uploadImages,
    imagesFile,
    setImagesFile,
    deleteanImage,
    imageLoader,
    imagesLoader,
  };
};
