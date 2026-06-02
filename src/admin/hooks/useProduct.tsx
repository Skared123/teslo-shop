import { useMutation, useQuery } from '@tanstack/react-query';
import { getProductByIdAction } from '../actions/get-product-by-id.action';
import type { Product } from '@/interfaces/product.interface';
import { createUpdateProductAction } from '../actions/create-update-product.action';
import { useQueryClient } from '@tanstack/react-query';

export const useProduct = (id: string) => {

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['product', { id }],
    queryFn: () => getProductByIdAction(id),
    retry: false,
    staleTime: 1000 * 60 * 5,
    // enabled: !!id
  });

  //TODO: manejar la mutacion
  const mutation = useMutation({
    mutationFn: createUpdateProductAction,
    onSuccess: (product: Product) => {

      //Invalidar caché
      queryClient.invalidateQueries({
        queryKey: ['products']
      })
      queryClient.invalidateQueries({
        queryKey: ['product', { id: product.id }]
      })

      //Actualizar queryData
      queryClient.setQueryData(
        ['product', { id: product.id }], product);
    },
  });

  // const handleSubmitForm = async (data: Partial<Product>) => {
  //   console.log(data);
  // };

  return {
    ...query,
    mutation,
  };
};
