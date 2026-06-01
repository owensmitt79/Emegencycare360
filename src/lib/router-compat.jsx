'use client';
import React, { useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter, usePathname, useParams as useNextParams, useSearchParams as useNextSearchParams } from 'next/navigation';

export const Link = React.forwardRef(({ to, href, ...props }, ref) => {
  return <NextLink href={to || href || '#'} {...props} ref={ref} />;
});
Link.displayName = 'Link';

export const useNavigate = () => {
  const router = useRouter();
  return (to, options) => {
    if (options && options.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  };
};

export const useLocation = () => {
  const pathname = usePathname();
  return {
    pathname: pathname || '/',
    search: '',
    hash: '',
    state: null,
  };
};

export const useParams = () => {
  return useNextParams() || {};
};

export const useSearchParams = () => {
  const searchParams = useNextSearchParams();
  return [searchParams, () => {}];
};

export const Navigate = ({ to, replace }) => {
  const router = useRouter();
  useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [to, replace, router]);
  return null;
};
