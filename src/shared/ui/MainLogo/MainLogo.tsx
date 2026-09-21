import Image from 'next/image';
import Link from 'next/link';
import Logo from './logo.png';
import { APP_ROUTES } from '@/shared/constants';

interface MainLogoProps {
  className?: string; 
}

export const MainLogo = ({ className = '' }: MainLogoProps) => {
  return (
    <Link href={APP_ROUTES.HOME} className={`flex items-center ${className}`}>
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
