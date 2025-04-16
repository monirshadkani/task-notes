import { createContext, useContext, useState } from "react";
import { Category } from "@/types/category.types";
import { storageService } from "@/services/storage/asyncStorage";

type CategoryContextType = {
  categories: Category[];
  setCategories: (categories: Category[]) => Promise<void>;
  getCategories: () => Promise<Category[]>;
};

export const CategoriesContext = createContext<CategoryContextType>({
  categories: [],
  setCategories: async () => {},
  getCategories: async () => [],
});

export const useCategories = () => useContext(CategoriesContext);

export const CategoriesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [categories, setCategoriesState] = useState<Category[]>([]);

  const setCategories = async (categories: Category[]) => {
    await storageService.setCategoriesStorage(categories);
    setCategoriesState(categories);
  };

  const getCategories = async () => {
    return storageService.getCategoriesStorage();
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        setCategories,
        getCategories,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};
