import { useEdgeStore } from "@/lib/edgestore";
import { useState } from "react";

import { useParams, useRouter } from "next/navigation";
import * as z from "zod";
import { serviceDefaultValues } from "./service-schema";
import { Service } from "@prisma/client";
import axios from "axios";
import { UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, XIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { serviceSchema } from "@/schemas";

type Props = {
 
  service:Service | null,
 
};
export const useService = ({service}: Props) => {
  const params = useParams();



  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: serviceDefaultValues(service),
  });

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
            ;
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
            ;
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
    
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoader(false);
      setImage("");
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


  const router = useRouter();

  async function onSubmit(values: z.infer<typeof serviceSchema>) {
    try {
     

      if(service){
        const service: Service = await axios.patch(
          `/api/service/${params.serviceId}`,
          values
        );
      }else{
        const service: Service = await axios.post(
          `/api/service`,
          values
        );
      }
   
      toast.success('service has been created')
      router.push(`/dashboard/services`);
      router.refresh()
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong')
    }
  }


  const setImage = (url: string) => {
    form.setValue("logo", url);
  };

  //set the images functions
  const setImages = (url: string) => {
    const images = form.getValues("images");
    form.setValue("images", [...images!, url]);
  };

  const deleteImages = (url: string) => {
    const images = form.getValues("images");
    form.setValue("images", [...images!.filter((image) => image !== url)]);
  };

  const ImagePlaceholder = () => {
    
      if(!!form.watch("logo")) return (
        <div className="w-[150px] h-[150px] overflow-hidden  relative">
          {deleteLoader ? (
            <div className="flex items-center justify-center w-full h-full ">
              <Loader className="w-5 h-5 animate-spin" />
            </div>
          ) : (
            <Image
              alt="added logo"
              src={form.getValues("logo")}
              fill
              className="object-cover rounded-lg"
            />
          )}

          <XIcon
            className="absolute top-1 right-1 cursor-pointer text-white bg-rose-400 p-1 rounded-md"
            onClick={() => {
              deleteImage(form.getValues("logo"));
            }}
          />
        </div>
      )
      if(imageLoader) return <div
           
      className="w-[150px] h-[150px] overflow-hidden flex items-center justify-center  relative"
    >  <Loader className="w-5 h-5 animate-spin" /></div>

   
  };
  const ImagesPlaceholder = () => {
    return (
      <div className="flex items-center gap-3">
      {!!form.watch("images")?.length && (
        <div className="flex items-center gap-3">
          {form.getValues("images")?.map((image) => (
            <div
              key={image}
              className="w-[150px] h-[150px] overflow-hidden  relative"
            >
              {deleteImagesLoader === image ? (
                <div className="flex items-center justify-center w-full h-full ">
                  <Loader className="w-5 h-5 animate-spin" />
                </div>
              ) : (
                <Image
                  alt="added logo"
                  src={image}
                  fill
                  className="object-cover rounded-lg"
                />
              )}

              <XIcon
                className="absolute top-1 right-1 cursor-pointer text-white bg-rose-400 p-1 rounded-md"
                onClick={() => {
                  deleteanImage(image);
                }}
              />
            
            </div>
          ))}
         
        </div>
      )}
         {imagesLoader &&  <div
           
           className="w-[150px] h-[150px] overflow-hidden flex items-center justify-center  relative"
         >  <Loader className="w-5 h-5 animate-spin" /></div>}
   </div> );
  };

  

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
    form,
    setImage, setImages, deleteImages,ImagePlaceholder,ImagesPlaceholder
  };
};
