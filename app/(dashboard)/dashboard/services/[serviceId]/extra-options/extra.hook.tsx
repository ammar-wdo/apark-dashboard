import { useModal } from "@/hooks/use-modal"
import { useEdgeStore } from "@/lib/edgestore"
import { extraSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExraOption } from "@prisma/client"
import axios from "axios"
import { Loader, XIcon } from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"



type Props = {

}

export const useExtra = ()=>{

    const {data:{extraOption},setClose} = useModal()



    const form = useForm<z.infer<typeof extraSchema>>({
        resolver: zodResolver(extraSchema),
        defaultValues: {
          label:extraOption?.label || "",
          description:extraOption?.description || '',
          available:extraOption?.available || false,
        price:extraOption?.price || 0,
        image:extraOption?.image || '',

      
        },
      })


      const [file, setFile] = useState<File>();

      const [deleteLoader, setDeleteLoader] = useState(false);
    
      const [imageLoader, setImageLoader] = useState(false);
    
    
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
    
     
    
    
     const setImage = (url: string) => {
        form.setValue("image", url);
      };

      const ImagePlaceholder = () => {
    
        if(!!form.watch("image")) return (
          <div className="w-[150px] h-[150px] overflow-hidden  relative ">
            {deleteLoader ? (
              <div className="flex items-center justify-center w-full h-full ">
                <Loader className="w-5 h-5 animate-spin" />
              </div>
            ) : (
              <Image
                alt="added logo"
                src={form.getValues("image")}
                fill
                className="object-contain rounded-lg"
              />
            )}
  
            <XIcon
              className="absolute top-1 right-1 cursor-pointer text-white bg-rose-400 p-1 rounded-md"
              onClick={() => {
                deleteImage(form.getValues("image"));
              }}
            />
          </div>
        )
        if(imageLoader) return <div
             
        className="w-[150px] h-[150px] overflow-hidden flex items-center justify-center  relative"
      >  <Loader className="w-5 h-5 animate-spin" /></div>
  
     
    };
   
  
    


     const router = useRouter()
     const params = useParams()

      // 2. Define a submit handler.
     async function onSubmit(values: z.infer<typeof extraSchema>) {
      
  try {

    if(extraOption){
await axios.patch(`/api/service/${params.serviceId}/extra-option/${extraOption.id}`,values)
    }else{
      await axios.post(`/api/service/${params.serviceId}/extra-option`,values)
    }
router.refresh()
setClose()
toast.success(extraOption ? "Updated successfully" : "Created successfully")
    
  } catch (error) {
    console.log(error)
    toast.error("Something went wrong")
  }
      }



      return {form,onSubmit,file,setFile,uploadImage,ImagePlaceholder}

}