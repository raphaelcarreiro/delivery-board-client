import { useCallback } from 'react';

export type UseSearchFunction = <T>(search: string, index: string, source: Array<T>) => Array<T>;

export default function useSearch(): UseSearchFunction {
  const search = useCallback((search: string, index: string, source: Array<any>): Array<any> => {
    source = JSON.parse(JSON.stringify(source));
    const response = source.filter(item => {
      let searched = String(item[index]);
      searched = searched
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return searched.indexOf(search.toLowerCase()) !== -1;
    });

    return response;
  }, []);

  return search;
}
