export type Book = {
  id: number;
  name: string;
  category_id: number;
};

export type CreateUpdateBook = {
  name: string;
  category_id: number;
};
