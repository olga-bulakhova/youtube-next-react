import Image from 'next/image';
import NotFoundImage from './monkey.png';

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-4">
      <Image
        src={NotFoundImage}
        alt="Страница не найдена (404)"
        width={186}
        preload={true}
        className="object-contain"
      />
      <div className="mt-4 text-center">
        <p>Эта страница недоступна.</p>
        <p>Может, поискать что-нибудь другое?</p>
      </div>
    </div>
  );
};
