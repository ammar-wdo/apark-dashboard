'use client'



import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import AsideWraper from "./aside-wrapper"
import MainAside from "./main-aside"


type Props = {
    children:React.ReactNode,
    AsideWraper:React.ReactNode
 
   

}

const ScreenResizable = ({children,AsideWraper}: Props) => {
    
   
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className=""

    >
        
      <ResizablePanel  defaultSize={10} className="h-screen hidden lg:flex min-w-[250px] max-w-[400px]">
      
        {AsideWraper}
      
      </ResizablePanel>
      <ResizableHandle withHandle   />
      <ResizablePanel defaultSize={90} className="p-24 bg-muted">
    
       {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default ScreenResizable