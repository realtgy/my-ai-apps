type DotProps = {
   className?: string;
};

export const Dot = ({ className = '' }: DotProps) => {
   return (
      <div
         className={`w-2 h-2 bg-gray-800 rounded-full animate-pulse ${className}`}
      />
   );
};

export default function TypingIndicator() {
   return (
      <div className="flex items-center gap-2">
         <Dot className="[animation-delay:0.4s]" />
         <Dot className="[animation-delay:0.6s]" />
         <Dot className="[animation-delay:0.8s]" />
      </div>
   );
}
