import { useToast } from "@/hooks/use-toast"

export default function useToastHook() {
  const { toast } = useToast()
  return (props: { 
    title: string; 
    description: string; 
    variant?: "default" | "destructive";
    size?: "default" | "large" | "fullscreen";
  }) => {
    toast({
      title: props.title,
      description: props.description,
      ...(props.variant && { variant: props.variant }),
      ...(props.size && { size: props.size }),
    })
  }
}

// Remove this line if you're not using it elsewhere
// export const toast = useToastHook()
