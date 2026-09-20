import Image from 'next/image';
import Link from 'next/link';
import Logo from './logo.png';

interface MainLogoProps {
  className?: string; 
}

export const MainLogo = ({ className = '' }: MainLogoProps) => {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <Image
        src={Logo}
        alt="Logo"
        width={40}
        height={28}
        className="h-auto w-10" 
      />
    </Link>
  );
};
