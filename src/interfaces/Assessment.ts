export interface Assessment {
  _id?: string;
  title: string;
  type: "quiz" | "exam" | "test";
  nodeId: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}


