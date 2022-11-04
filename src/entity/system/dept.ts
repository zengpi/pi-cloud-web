interface DeptTree{
    id: number;
    name: string;
    children: Array<DeptTree>;
}

export type { DeptTree }