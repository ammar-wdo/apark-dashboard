import { SingleImageDropzone } from "@/components/single-image-dropezone";
import { useEdgeStore } from "@/lib/edgestore";
import { useState } from "react";

export const useService = (setImage:(res:string)=>void) => {
  const [file, setFile] = useState<File>();
  const [deleteLoader, setDeleteLoader] = useState(false)

  const { edgestore } = useEdgeStore();

  const uploadImage = async () => {
    if (file) {
      if (file) {
        const res = await edgestore.publicFiles.upload({
          file,
          onProgressChange: (progress) => {
            // you can use this to show a progress bar
            console.log(progress);
          },
        });

        console.log(res);
        setImage(res.url)
      }
    }
  };


  const deleteImage =async(image:string)=>{

    try {
        setDeleteLoader(true)
        await edgestore.publicFiles.delete({
            url: image,
          });
          setImage('')
    } catch (error) {
        console.log(error)
        
    }finally{
        setDeleteLoader(false)
    }
  
  }


  return {file,setFile,uploadImage,deleteImage,deleteLoader}
};
