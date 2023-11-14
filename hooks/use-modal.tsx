import { create } from 'zustand'

type ModalType = "delete-modal" | "availability-modal"
type Data = {
    url?:string,
    message?:string
    redirect?:string
    metaDate?:string
}

type Modal = {
  open: boolean
  type:ModalType | ''
  data:Data
  setOpen: (type:ModalType,data:Data) => void
  setClose: ()=>void
}

export const useModal = create<Modal>()((set) => ({
  open: false,
  type:'',
  data:{},
  setOpen: (type,data={}) => set({open:true,type,data}),
  setClose:()=>set({open:false,type:'',data:{}})
}))

