import Image from 'next/image';
import Link from 'next/link';
import Logo from './logo.png';

type HeaderProps = {
  profileId: string;
};

export const Header = ({ profileId }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between px-4 py-4">
      <Link href="/">
        <Image src={Logo} alt="Logo" width={44} />
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/editor/add-video"
          className="flex h-9 items-center gap-2 rounded-full bg-white/10 px-4 transition-colors hover:bg-white/15"
        >
          <span className="mb-1 text-2xl leading-none font-light">+</span>
          <span>Создать</span>
        </Link>

        <Link
          href={`/profile/${profileId}`}
          className="block h-8 w-8 rounded-full bg-white/10 transition-colors hover:bg-white/15"
        >
          <span className="sr-only">Перейти в свой профиль</span>
        </Link>
      </div>
    </header>
  );
};
