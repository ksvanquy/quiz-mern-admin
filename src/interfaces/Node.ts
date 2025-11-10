export interface NodeEntity {
  _id?: string;
  name: string;
  type: "category" | "subcategory" | "topic";
  parentId?: string | null;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}


