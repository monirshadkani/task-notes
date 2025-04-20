import { createContext, useContext, useState, useEffect } from "react";
import { Category } from "@/types/category.types";
import { storageService } from "@/services/storage/asyncStorage";
import { categoryService } from "@/services/categories/categoryService";

type CategoryContextType = {
  categories: Category[];
  setCategories: (categories: Category[]) => Promise<void>;
  getCategories: () => Promise<Category[]>;
  refreshCategories: () => Promise<void>;
};

export const CategoriesContext = createContext<CategoryContextType>({
  categories: [],
  setCategories: async () => {},
  getCategories: async () => [],
  refreshCategories: async () => {},
});

export const useCategories = () => useContext(CategoriesContext);

export const CategoriesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [categories, setCategoriesState] = useState<Category[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeCategories = async () => {
      if (isInitialized) return;

      try {
        const storedCategories = await storageService.getCategoriesStorage();
        if (storedCategories && storedCategories.length > 0) {
          setCategoriesState(storedCategories);
        } else {
          const apiCategories = await categoryService.getCategoriesApi();
          if (apiCategories && apiCategories.length > 0) {
            await storageService.setCategoriesStorage(apiCategories);
            setCategoriesState(apiCategories);
          }
        }
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize categories:", error);
        setCategoriesState([]);
        setIsInitialized(true);
      }
    };

    initializeCategories();
  }, [isInitialized]);

  const refreshCategories = async () => {
    try {
      const apiCategories = await categoryService.getCategoriesApi();
      if (apiCategories && apiCategories.length > 0) {
        await storageService.setCategoriesStorage(apiCategories);
        setCategoriesState(apiCategories);
      } else {
        setCategoriesState([]);
      }
    } catch (error) {
      console.error("Failed to refresh categories:", error);
      setCategoriesState([]);
    }
  };

  const setCategories = async (categories: Category[]) => {
    await storageService.setCategoriesStorage(categories);
    setCategoriesState(categories);
  };

  const getCategories = async () => {
    const storedCategories = await storageService.getCategoriesStorage();
    if (storedCategories.length === 0) {
      await refreshCategories();
      return await storageService.getCategoriesStorage();
    }
    return storedCategories;
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        setCategories,
        getCategories,
        refreshCategories,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};
