// // import { cookies } from 'next/headers';
// // import Link from 'next/link';
// // import { MainLogo } from '@/shared/ui/MainLogo';
// // import { SidebarToggle } from './SidebarToggle';
// // import { parseJsonCookie } from '@/shared/utils';
// // import { IUserCookie } from '@/app/api/auth/_storage/types';

// // export const Header = async () => {
// //   const cookieStore = await cookies();
// //   const userCookie = cookieStore.get('user');
// //   const user = parseJsonCookie<IUserCookie>(userCookie?.value);
// //   const username = user?.username || '';
// //   const profileId = user ? String(user.id) : '';

// //   return (
// //     <header className="flex items-center justify-between py-4">
// //       <div className="flex items-center gap-3">
// //         <SidebarToggle />
// //         <MainLogo />
// //       </div>

// //       <div className="flex items-center gap-4">
// //         {username ? (
// //           <div className="flex items-center gap-4">
// //             <span className="flex items-center gap-2 text-sm font-medium text-zinc-200">
// //               <Link
// //                 href={`/profile/${profileId}`}
// //                 className="hover:text-white hover:underline"
// //               >
// //                 {username}
// //               </Link>
// //             </span>
// //             <Link
// //               href="/editor/add-video"
// //               className="flex h-9 items-center gap-2 rounded-full bg-white/10 px-4 transition-colors hover:bg-white/15"
// //             >
// //               <span className="mb-1 text-2xl leading-none font-light">+</span>
// //               <span>Добавить</span>
// //             </Link>
// //           </div>
// //         ) : (
// //           <Link
// //             href="/auth/login"
// //             className="flex h-9 items-center gap-2 rounded-full bg-white/10 px-4 transition-colors hover:bg-white/15"
// //           >
// //             <span>Войти</span>
// //           </Link>
// //         )}
// //       </div>
// //     </header>
// //   );
// // };

// import { cookies } from 'next/headers';
// import Link from 'next/link';
// import { MainLogo } from '@/shared/ui/MainLogo';
// import { SidebarToggle } from './SidebarToggle';
// import { parseJsonCookie } from '@/shared/utils';
// import { IUserCookie } from '@/app/api/auth/_storage/types';

// export const Header = async () => {
//   const cookieStore = await cookies();
//   const userCookie = cookieStore.get('user');

//   const user = parseJsonCookie<IUserCookie>(userCookie?.value);

//   const username = user?.username || '';
//   const profileId = user ? String(user.id) : '';

//   const firstLetter = username ? username.charAt(0).toUpperCase() : '';

//   return (
//     <header className="flex items-center justify-between py-4">
//       <div className="flex items-center gap-3">
//         <SidebarToggle />
//         <MainLogo />
//       </div>

//       <div className="flex items-center gap-4">
//         {username ? (
//           <div className="flex items-center gap-4">
//             <Link
//               href="/editor/add-video"
//               className="flex h-9 items-center gap-2 rounded-full bg-white/10 px-4 transition-colors hover:bg-white/15"
//             >
//               <span className="mb-1 text-2xl leading-none font-light">+</span>
//               <span>Добавить</span>
//             </Link>

//             {/* 2. ИСПРАВЛЕНО: Ссылка на профиль теперь обернута вокруг стильного аватара */}
//             <Link
//               href={`/profile/${profileId}`}
//               title={`Перейти в профиль ${username}`} // Подсказка при наведении
//               className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 font-semibold text-white shadow-md transition-all hover:scale-105 hover:bg-emerald-600"
//             >
//               {/* Выводим заглавную первую букву */}
//               <span className="text-sm select-none">{firstLetter}</span>
//             </Link>
//           </div>
//         ) : (
//           <Link
//             href="/auth/login"
//             className="flex h-9 items-center gap-2 rounded-full bg-white/10 px-4 transition-colors hover:bg-white/15"
//           >
//             <span>Войти</span>
//           </Link>
//         )}
//       </div>
//     </header>
//   );
// };

import { cookies } from 'next/headers';
import Link from 'next/link';
import { MainLogo } from '@/shared/ui/MainLogo';
import { SidebarToggle } from './SidebarToggle';
import { parseJsonCookie } from '@/shared/utils';
import { IUserCookie } from '@/app/api/auth/_storage/types';
import { UserMenu } from './UserMenu'; // 1. Импортируем наше новое выпадающее меню

export const Header = async () => {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user');

  const user = parseJsonCookie<IUserCookie>(userCookie?.value);

  const username = user?.username || '';
  const profileId = user ? String(user.id) : '';
  const firstLetter = username ? username.charAt(0).toUpperCase() : '';

  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <SidebarToggle />
        <MainLogo />
      </div>

      <div className="flex items-center gap-4">
        {username ? (
          <div className="flex items-center gap-4">
            <Link
              href="/editor/add-video"
              className="flex h-9 items-center gap-2 rounded-full bg-white/10 px-4 transition-colors hover:bg-white/15"
            >
              <span className="mb-1 text-2xl leading-none font-light">+</span>
              <span>Добавить</span>
            </Link>

            <UserMenu
              firstLetter={firstLetter}
              username={username}
              profileId={profileId}
            />
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="flex h-9 items-center gap-2 rounded-full bg-white/10 px-4 transition-colors hover:bg-white/15"
          >
            <span>Войти</span>
          </Link>
        )}
      </div>
    </header>
  );
};
